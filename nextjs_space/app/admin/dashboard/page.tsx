'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  FileText,
  Receipt,
  MessageSquare,
  Mail,
  TrendingUp,
  DollarSign,
  Clock,
} from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';

interface DashboardData {
  counts: {
    quotes: number;
    contacts: number;
    newsletter: number;
    invoices: number;
  };
  recentQuotes: Array<{
    id: string;
    name: string;
    email: string;
    projectType: string;
    status: string;
    createdAt: string;
  }>;
  quotesByStatus: Array<{
    status: string;
    _count: { status: number };
  }>;
  invoicesByStatus: Array<{
    status: string;
    _count: { status: number };
  }>;
  invoiceStats: {
    totalAmount: number;
    depositAmount: number;
  };
}

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/admin/dashboard');
      if (response.ok) {
        const result = await response.json();
        setData(result);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-green-600 border-t-transparent"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-800';
      case 'contacted':
        return 'bg-yellow-100 text-yellow-800';
      case 'quoted':
        return 'bg-purple-100 text-purple-800';
      case 'closed':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'sent':
        return 'bg-blue-100 text-blue-800';
      case 'paid':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-600 mt-1">Your sales back office at a glance</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-900">
              Quote Requests
            </CardTitle>
            <FileText className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-900">
              {data?.counts.quotes || 0}
            </div>
            <p className="text-xs text-blue-700 mt-1">Total requests</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-900">
              Invoices
            </CardTitle>
            <Receipt className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-900">
              {data?.counts.invoices || 0}
            </div>
            <p className="text-xs text-green-700 mt-1">Total invoices</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-900">
              Contact Messages
            </CardTitle>
            <MessageSquare className="h-5 w-5 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-900">
              {data?.counts.contacts || 0}
            </div>
            <p className="text-xs text-purple-700 mt-1">Total messages</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-900">
              Newsletter Subs
            </CardTitle>
            <Mail className="h-5 w-5 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-900">
              {data?.counts.newsletter || 0}
            </div>
            <p className="text-xs text-orange-700 mt-1">Active subscribers</p>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Stats */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              Revenue Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Total Invoice Value</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${(data?.invoiceStats.totalAmount || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Deposits Collected</p>
                <p className="text-2xl font-bold text-green-600">
                  ${(data?.invoiceStats.depositAmount || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              Quote Status Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data?.quotesByStatus.map((item) => (
                <div key={item.status} className="flex items-center justify-between">
                  <Badge className={getStatusColor(item.status)} variant="secondary">
                    {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                  </Badge>
                  <span className="font-semibold text-gray-900">
                    {item._count.status}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Quotes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-gray-600" />
            Recent Quote Requests
          </CardTitle>
        </CardHeader>
        <CardContent>
          {data?.recentQuotes && data.recentQuotes.length > 0 ? (
            <div className="space-y-4">
              {data.recentQuotes.map((quote) => (
                <Link
                  key={quote.id}
                  href={`/admin/quotes`}
                  className="block p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <p className="font-semibold text-gray-900">{quote.name}</p>
                        <Badge className={getStatusColor(quote.status)} variant="secondary">
                          {quote.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{quote.email}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        {quote.projectType} Project
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">
                        {format(new Date(quote.createdAt), 'MMM d, yyyy')}
                      </p>
                      <p className="text-xs text-gray-400">
                        {format(new Date(quote.createdAt), 'h:mm a')}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No recent quotes</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
