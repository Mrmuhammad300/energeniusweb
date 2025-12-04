import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get counts
    const [quotesCount, contactsCount, newsletterCount, invoicesCount, ordersCount, customersCount, teamMembersCount] =
      await Promise.all([
        prisma.quoteRequest.count(),
        prisma.contactSubmission.count(),
        prisma.newsletterSubscriber.count({ where: { status: 'active' } }),
        prisma.invoice.count(),
        prisma.order.count(),
        prisma.customer.count(),
        prisma.teamMember.count({ where: { status: 'active' } }),
      ]);

    // Get recent quotes
    const recentQuotes = await prisma.quoteRequest.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        projectType: true,
        status: true,
        createdAt: true,
      },
    });

    // Get quotes by status
    const quotesByStatus = await prisma.quoteRequest.groupBy({
      by: ['status'],
      _count: { status: true },
    });

    // Get invoices by status
    const invoicesByStatus = await prisma.invoice.groupBy({
      by: ['status'],
      _count: { status: true },
    });

    // Calculate total invoice amounts
    const invoiceStats = await prisma.invoice.aggregate({
      _sum: {
        totalAmount: true,
        depositAmount: true,
      },
      where: {
        status: { in: ['sent', 'paid'] },
      },
    });

    // Get recent orders (Phase 2)
    const recentOrders = await prisma.order.findMany({
      take: 5,
      orderBy: { orderDate: 'desc' },
      select: {
        id: true,
        orderNumber: true,
        customerName: true,
        status: true,
        fulfillmentStatus: true,
        totalAmount: true,
        orderDate: true,
      },
    });

    // Get orders by status (Phase 2)
    const ordersByStatus = await prisma.order.groupBy({
      by: ['status'],
      _count: { status: true },
    });

    // Calculate total order amounts (Phase 2)
    const orderStats = await prisma.order.aggregate({
      _sum: {
        totalAmount: true,
      },
    });

    return NextResponse.json({
      counts: {
        quotes: quotesCount,
        contacts: contactsCount,
        newsletter: newsletterCount,
        invoices: invoicesCount,
        orders: ordersCount,
        customers: customersCount,
        teamMembers: teamMembersCount,
      },
      recentQuotes,
      recentOrders,
      quotesByStatus,
      invoicesByStatus,
      ordersByStatus,
      invoiceStats: {
        totalAmount: invoiceStats._sum.totalAmount || 0,
        depositAmount: invoiceStats._sum.depositAmount || 0,
      },
      orderStats: {
        totalAmount: orderStats._sum.totalAmount || 0,
      },
    });
  } catch (error) {
    console.error('Dashboard data fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
}
