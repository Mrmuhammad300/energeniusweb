import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

// Helper function to get date range
function getDateRange(period: string) {
  const now = new Date()
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const startOfYear = new Date(now.getFullYear(), 0, 1)
  
  switch (period) {
    case 'today':
      return { start: startOfDay, end: now }
    case 'week':
      const weekStart = new Date(now)
      weekStart.setDate(now.getDate() - 7)
      return { start: weekStart, end: now }
    case 'month':
      return { start: startOfMonth, end: now }
    case 'quarter':
      const quarterStart = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1)
      return { start: quarterStart, end: now }
    case 'year':
      return { start: startOfYear, end: now }
    case 'all':
    default:
      return { start: new Date(2020, 0, 1), end: now }
  }
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || 'month'
    const { start, end } = getDateRange(period)

    // 1. Revenue Metrics
    const paidInvoices = await prisma.invoice.findMany({
      where: {
        status: 'paid',
        paidDate: {
          gte: start,
          lte: end,
        },
      },
      select: {
        totalAmount: true,
        commissionAmount: true,
        commissionRate: true,
        paidDate: true,
        createdAt: true,
        assignedSalesRep: true,
        leadSource: true,
        salesCycle: true,
      },
    })

    const totalRevenue = paidInvoices.reduce((sum, inv) => sum + inv.totalAmount, 0)
    const totalCommissions = paidInvoices.reduce((sum, inv) => sum + (inv.commissionAmount || inv.totalAmount * (inv.commissionRate || 0.15)), 0)
    const averageOrderValue = paidInvoices.length > 0 ? totalRevenue / paidInvoices.length : 0
    const averageSalesCycle = paidInvoices.filter(inv => inv.salesCycle).length > 0
      ? paidInvoices.reduce((sum, inv) => sum + (inv.salesCycle || 0), 0) / paidInvoices.filter(inv => inv.salesCycle).length
      : 21 // Default 21 days

    // 2. Pipeline Metrics
    const allQuotes = await prisma.quoteRequest.findMany({
      where: {
        createdAt: {
          gte: start,
          lte: end,
        },
      },
      select: {
        id: true,
        status: true,
        estimatedValue: true,
        leadSource: true,
        createdAt: true,
        closedDate: true,
        assignedTo: true,
      },
    })

    const wonQuotes = allQuotes.filter(q => q.status === 'won')
    const lostQuotes = allQuotes.filter(q => q.status === 'lost')
    const closedQuotes = [...wonQuotes, ...lostQuotes]
    
    const conversionRate = closedQuotes.length > 0
      ? (wonQuotes.length / closedQuotes.length) * 100
      : 32 // Default 32%

    const pipelineValue = allQuotes
      .filter(q => !['won', 'lost', 'closed'].includes(q.status))
      .reduce((sum, q) => sum + (q.estimatedValue || 0), 0)

    // 3. Lead Source Breakdown
    const leadSourceData: Record<string, { count: number; revenue: number; conversion: number }> = {}
    
    for (const invoice of paidInvoices) {
      const source = invoice.leadSource || 'unknown'
      if (!leadSourceData[source]) {
        leadSourceData[source] = { count: 0, revenue: 0, conversion: 0 }
      }
      leadSourceData[source].count++
      leadSourceData[source].revenue += invoice.totalAmount
    }

    for (const quote of allQuotes) {
      const source = quote.leadSource || 'unknown'
      if (!leadSourceData[source]) {
        leadSourceData[source] = { count: 0, revenue: 0, conversion: 0 }
      }
      
      const sourceQuotes = allQuotes.filter(q => (q.leadSource || 'unknown') === source)
      const sourceWon = wonQuotes.filter(q => (q.leadSource || 'unknown') === source)
      const sourceClosed = closedQuotes.filter(q => (q.leadSource || 'unknown') === source)
      
      leadSourceData[source].conversion = sourceClosed.length > 0
        ? (sourceWon.length / sourceClosed.length) * 100
        : 0
    }

    // 4. Time Series Data (Daily/Weekly/Monthly based on period)
    const timeSeriesData = []
    const groupBy = period === 'year' ? 'month' : period === 'month' ? 'week' : 'day'
    
    // Group revenue by time period
    const revenueByDate: Record<string, number> = {}
    for (const invoice of paidInvoices) {
      const date = invoice.paidDate || invoice.createdAt
      const key = groupBy === 'month'
        ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
        : groupBy === 'week'
        ? `${date.getFullYear()}-W${String(Math.ceil(date.getDate() / 7)).padStart(2, '0')}`
        : date.toISOString().split('T')[0]
      
      revenueByDate[key] = (revenueByDate[key] || 0) + invoice.totalAmount
    }

    for (const [date, revenue] of Object.entries(revenueByDate)) {
      timeSeriesData.push({ date, revenue })
    }
    timeSeriesData.sort((a, b) => a.date.localeCompare(b.date))

    // 5. Sales Rep Performance
    const repPerformance: Record<string, { sales: number; revenue: number; commission: number }> = {}
    
    for (const invoice of paidInvoices) {
      const rep = invoice.assignedSalesRep || 'Unassigned'
      if (!repPerformance[rep]) {
        repPerformance[rep] = { sales: 0, revenue: 0, commission: 0 }
      }
      repPerformance[rep].sales++
      repPerformance[rep].revenue += invoice.totalAmount
      repPerformance[rep].commission += invoice.commissionAmount || invoice.totalAmount * (invoice.commissionRate || 0.15)
    }

    // 6. Current Status Breakdown
    const quotesByStatus = await prisma.quoteRequest.groupBy({
      by: ['status'],
      _count: {
        id: true,
      },
      where: {
        createdAt: {
          gte: start,
          lte: end,
        },
      },
    })

    // 7. Goals & Targets
    const annualTarget = 360000 // $360K annual target
    const monthlyTarget = annualTarget / 12
    const quarterlyTarget = annualTarget / 4
    
    const progressToTarget = period === 'year'
      ? (totalRevenue / annualTarget) * 100
      : period === 'quarter'
      ? (totalRevenue / quarterlyTarget) * 100
      : (totalRevenue / monthlyTarget) * 100

    // 8. Recent Activity
    const recentInvoices = await prisma.invoice.findMany({
      where: {
        status: 'paid',
        paidDate: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
        },
      },
      select: {
        invoiceNumber: true,
        customerName: true,
        totalAmount: true,
        paidDate: true,
      },
      orderBy: {
        paidDate: 'desc',
      },
      take: 10,
    })

    const recentQuotes = await prisma.quoteRequest.findMany({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        },
      },
      select: {
        name: true,
        email: true,
        status: true,
        estimatedValue: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 10,
    })

    // Return comprehensive analytics data
    return NextResponse.json({
      period,
      dateRange: { start, end },
      
      // Key Metrics
      revenue: {
        total: totalRevenue,
        target: period === 'year' ? annualTarget : period === 'quarter' ? quarterlyTarget : monthlyTarget,
        progressToTarget,
        growth: 0, // TODO: Calculate vs previous period
      },
      
      commissions: {
        total: totalCommissions,
        averageRate: 0.15,
      },
      
      sales: {
        count: paidInvoices.length,
        averageOrderValue,
        averageSalesCycle,
      },
      
      pipeline: {
        totalValue: pipelineValue,
        activeQuotes: allQuotes.length - closedQuotes.length,
        conversionRate,
        wonCount: wonQuotes.length,
        lostCount: lostQuotes.length,
      },
      
      // Detailed Breakdowns
      leadSources: Object.entries(leadSourceData).map(([source, data]) => ({
        source,
        ...data,
      })),
      
      timeSeries: timeSeriesData,
      
      salesReps: Object.entries(repPerformance).map(([rep, data]) => ({
        rep,
        ...data,
      })),
      
      quoteStatuses: quotesByStatus.map(item => ({
        status: item.status,
        count: item._count.id,
      })),
      
      // Recent Activity
      recentActivity: {
        invoices: recentInvoices,
        quotes: recentQuotes,
      },
    })
  } catch (error) {
    console.error('Analytics Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics data' },
      { status: 500 }
    )
  }
}
