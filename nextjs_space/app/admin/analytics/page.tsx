'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  DollarSign, 
  TrendingUp, 
  Users, 
  Target, 
  Clock, 
  Award,
  BarChart3,
  PieChart,
  Activity,
  ArrowUp,
  ArrowDown,
  Loader2
} from 'lucide-react'
import { LineChart, Line, BarChart, Bar, PieChart as RePieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface AnalyticsData {
  period: string
  dateRange: { start: string; end: string }
  revenue: {
    total: number
    target: number
    progressToTarget: number
    growth: number
  }
  commissions: {
    total: number
    averageRate: number
  }
  sales: {
    count: number
    averageOrderValue: number
    averageSalesCycle: number
  }
  pipeline: {
    totalValue: number
    activeQuotes: number
    conversionRate: number
    wonCount: number
    lostCount: number
  }
  leadSources: Array<{
    source: string
    count: number
    revenue: number
    conversion: number
  }>
  timeSeries: Array<{
    date: string
    revenue: number
  }>
  salesReps: Array<{
    rep: string
    sales: number
    revenue: number
    commission: number
  }>
  quoteStatuses: Array<{
    status: string
    count: number
  }>
  recentActivity: {
    invoices: Array<{
      invoiceNumber: string
      customerName: string
      totalAmount: number
      paidDate: string
    }>
    quotes: Array<{
      name: string
      email: string
      status: string
      estimatedValue: number
      createdAt: string
    }>
  }
}

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']

export default function AnalyticsPage() {
  const [period, setPeriod] = useState('month')
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchAnalytics()
  }, [period])

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(`/api/admin/analytics?period=${period}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch analytics')
      }
      
      const result = await response.json()
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const formatPercent = (value: number) => {
    return `${value.toFixed(1)}%`
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-emerald-600" />
          <p className="mt-4 text-gray-600">Loading analytics...</p>
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">{error || 'Failed to load analytics data'}</p>
            <Button onClick={fetchAnalytics} className="mt-4">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sales Analytics</h1>
          <p className="text-muted-foreground mt-1">
            Comprehensive insights into your sales performance
          </p>
        </div>
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="week">Last 7 Days</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
            <SelectItem value="quarter">This Quarter</SelectItem>
            <SelectItem value="year">This Year</SelectItem>
            <SelectItem value="all">All Time</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Revenue */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(data.revenue.total)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Target: {formatCurrency(data.revenue.target)}
            </p>
            <div className="mt-2 flex items-center text-sm">
              <div className="flex items-center text-emerald-600">
                <TrendingUp className="h-4 w-4 mr-1" />
                {formatPercent(data.revenue.progressToTarget)} of target
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total Commissions */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Commissions</CardTitle>
            <Award className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(data.commissions.total)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Avg Rate: {formatPercent(data.commissions.averageRate * 100)}
            </p>
            <div className="mt-2 flex items-center text-sm text-gray-600">
              {data.sales.count} sales closed
            </div>
          </CardContent>
        </Card>

        {/* Average Order Value */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
            <Target className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(data.sales.averageOrderValue)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              From {data.sales.count} orders
            </p>
          </CardContent>
        </Card>

        {/* Conversion Rate */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <Activity className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPercent(data.pipeline.conversionRate)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {data.pipeline.wonCount} won / {data.pipeline.wonCount + data.pipeline.lostCount} closed
            </p>
            <div className="mt-2 flex items-center text-sm text-gray-600">
              <Clock className="h-3 w-3 mr-1" />
              {data.sales.averageSalesCycle.toFixed(0)} day avg cycle
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pipeline Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Pipeline Overview</CardTitle>
          <CardDescription>Active opportunities and forecasted revenue</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Active Quotes</p>
              <p className="text-2xl font-bold">{data.pipeline.activeQuotes}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Pipeline Value</p>
              <p className="text-2xl font-bold">{formatCurrency(data.pipeline.totalValue)}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Win Rate</p>
              <p className="text-2xl font-bold">{formatPercent(data.pipeline.conversionRate)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Charts Section */}
      <Tabs defaultValue="revenue" className="space-y-4">
        <TabsList>
          <TabsTrigger value="revenue">Revenue Trend</TabsTrigger>
          <TabsTrigger value="sources">Lead Sources</TabsTrigger>
          <TabsTrigger value="reps">Sales Reps</TabsTrigger>
          <TabsTrigger value="status">Quote Status</TabsTrigger>
        </TabsList>

        {/* Revenue Trend Chart */}
        <TabsContent value="revenue" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Trend</CardTitle>
              <CardDescription>Sales performance over time</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              {data.timeSeries.length > 0 ? (
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart data={data.timeSeries}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip formatter={(value) => formatCurrency(value as number)} />
                    <Legend />
                    <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} name="Revenue" />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-[350px] text-gray-500">
                  No data available for this period
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Lead Sources Chart */}
        <TabsContent value="sources" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Lead Sources - Revenue</CardTitle>
                <CardDescription>Revenue by lead source</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                {data.leadSources.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <RePieChart>
                      <Pie
                        data={data.leadSources}
                        dataKey="revenue"
                        nameKey="source"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label={(entry) => `${entry.source}: ${formatCurrency(entry.revenue)}`}
                      >
                        {data.leadSources.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => formatCurrency(value as number)} />
                    </RePieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-[300px] text-gray-500">
                    No data available
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Lead Source Performance</CardTitle>
                <CardDescription>Conversion rates by source</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                {data.leadSources.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={data.leadSources}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="source" />
                      <YAxis />
                      <Tooltip formatter={(value) => formatPercent(value as number)} />
                      <Legend />
                      <Bar dataKey="conversion" fill="#3b82f6" name="Conversion Rate (%)" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-[300px] text-gray-500">
                    No data available
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Sales Reps Performance */}
        <TabsContent value="reps" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sales Rep Performance</CardTitle>
              <CardDescription>Individual performance metrics</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              {data.salesReps.length > 0 ? (
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={data.salesReps}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="rep" />
                    <YAxis />
                    <Tooltip formatter={(value) => formatCurrency(value as number)} />
                    <Legend />
                    <Bar dataKey="revenue" fill="#10b981" name="Revenue" />
                    <Bar dataKey="commission" fill="#3b82f6" name="Commission" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-[350px] text-gray-500">
                  No data available for this period
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Quote Status Distribution */}
        <TabsContent value="status" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Quote Status Distribution</CardTitle>
              <CardDescription>Current status of all quotes</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              {data.quoteStatuses.length > 0 ? (
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={data.quoteStatuses}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="status" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#8b5cf6" name="Count" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-[350px] text-gray-500">
                  No data available for this period
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Recent Activity */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Sales</CardTitle>
            <CardDescription>Last 10 paid invoices</CardDescription>
          </CardHeader>
          <CardContent>
            {data.recentActivity.invoices.length > 0 ? (
              <div className="space-y-4">
                {data.recentActivity.invoices.map((invoice, index) => (
                  <div key={index} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
                    <div>
                      <p className="font-medium">{invoice.customerName}</p>
                      <p className="text-sm text-muted-foreground">{invoice.invoiceNumber}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(invoice.paidDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-emerald-600">{formatCurrency(invoice.totalAmount)}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-8">No recent sales</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Quotes</CardTitle>
            <CardDescription>Last 10 quote requests</CardDescription>
          </CardHeader>
          <CardContent>
            {data.recentActivity.quotes.length > 0 ? (
              <div className="space-y-4">
                {data.recentActivity.quotes.map((quote, index) => (
                  <div key={index} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
                    <div>
                      <p className="font-medium">{quote.name}</p>
                      <p className="text-sm text-muted-foreground">{quote.email}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(quote.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                        quote.status === 'won' ? 'bg-emerald-100 text-emerald-800' :
                        quote.status === 'lost' ? 'bg-red-100 text-red-800' :
                        quote.status === 'quoted' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {quote.status}
                      </span>
                      {quote.estimatedValue > 0 && (
                        <p className="text-sm text-gray-600 mt-1">{formatCurrency(quote.estimatedValue)}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-8">No recent quotes</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
