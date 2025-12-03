'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { FileText, Mail, Phone, MapPin, Calendar, MessageSquare, Receipt } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from '@/hooks/use-toast';
import Link from 'next/link';

interface Quote {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  projectType: string;
  powerNeeds: string;
  timeline: string;
  message: string | null;
  status: string;
  interestedProducts: string[];
  createdAt: string;
  updatedAt: string;
  invoices: Array<{
    id: string;
    invoiceNumber: string;
    status: string;
  }>;
}

export default function QuotesPage() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  useEffect(() => {
    fetchQuotes();
  }, [filterStatus]);

  const fetchQuotes = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/quotes?status=${filterStatus}`);
      if (response.ok) {
        const data = await response.json();
        setQuotes(data);
      }
    } catch (error) {
      console.error('Failed to fetch quotes:', error);
      toast({
        title: 'Error',
        description: 'Failed to load quotes',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const updateQuoteStatus = async (quoteId: string, newStatus: string) => {
    try {
      const response = await fetch('/api/admin/quotes', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: quoteId, status: newStatus }),
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Quote status updated',
        });
        fetchQuotes();
        if (selectedQuote?.id === quoteId) {
          setSelectedQuote({ ...selectedQuote, status: newStatus });
        }
      } else {
        throw new Error('Failed to update');
      }
    } catch (error) {
      console.error('Failed to update quote:', error);
      toast({
        title: 'Error',
        description: 'Failed to update quote status',
        variant: 'destructive',
      });
    }
  };

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
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const openDetails = (quote: Quote) => {
    setSelectedQuote(quote);
    setDetailsOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quote Requests</h1>
          <p className="text-gray-600 mt-1">Manage customer quote requests</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Quotes</SelectItem>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="contacted">Contacted</SelectItem>
              <SelectItem value="quoted">Quoted</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-green-600 border-t-transparent"></div>
            <p className="text-gray-600">Loading quotes...</p>
          </div>
        </div>
      ) : quotes.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <FileText className="h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-600">No quote requests found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {quotes.map((quote) => (
            <Card key={quote.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">
                        {quote.name}
                      </h3>
                      <Badge className={getStatusColor(quote.status)} variant="secondary">
                        {quote.status.charAt(0).toUpperCase() + quote.status.slice(1)}
                      </Badge>
                      {quote.invoices.length > 0 && (
                        <Badge className="bg-green-100 text-green-800" variant="secondary">
                          <Receipt className="h-3 w-3 mr-1" />
                          {quote.invoices.length} Invoice{quote.invoices.length !== 1 ? 's' : ''}
                        </Badge>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Mail className="h-4 w-4" />
                        <span>{quote.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Phone className="h-4 w-4" />
                        <span>{quote.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="h-4 w-4" />
                        <span>{quote.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="h-4 w-4" />
                        <span>{format(new Date(quote.createdAt), 'MMM d, yyyy')}</span>
                      </div>
                    </div>
                    <div className="mt-3 space-y-2">
                      <p className="text-sm">
                        <span className="font-medium text-gray-700">Project Type:</span>{' '}
                        <span className="text-gray-600">{quote.projectType}</span>
                      </p>
                      <p className="text-sm">
                        <span className="font-medium text-gray-700">Timeline:</span>{' '}
                        <span className="text-gray-600">{quote.timeline}</span>
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 mt-4 pt-4 border-t">
                  <Button
                    onClick={() => openDetails(quote)}
                    variant="outline"
                    size="sm"
                  >
                    View Details
                  </Button>
                  <Select
                    value={quote.status}
                    onValueChange={(value) => updateQuoteStatus(quote.id, value)}
                  >
                    <SelectTrigger className="w-[140px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="contacted">Contacted</SelectItem>
                      <SelectItem value="quoted">Quoted</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                  <Link href={`/admin/invoices/new?quoteId=${quote.id}`}>
                    <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                      <Receipt className="h-4 w-4 mr-2" />
                      Create Invoice
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Quote Details Dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Quote Request Details</DialogTitle>
            <DialogDescription>
              Complete information about this quote request
            </DialogDescription>
          </DialogHeader>
          {selectedQuote && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">Customer Name</p>
                  <p className="text-gray-900">{selectedQuote.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">Status</p>
                  <Badge className={getStatusColor(selectedQuote.status)} variant="secondary">
                    {selectedQuote.status.charAt(0).toUpperCase() + selectedQuote.status.slice(1)}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">Email</p>
                  <p className="text-gray-900">{selectedQuote.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">Phone</p>
                  <p className="text-gray-900">{selectedQuote.phone}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">Location</p>
                  <p className="text-gray-900">{selectedQuote.location}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">Project Type</p>
                  <p className="text-gray-900">{selectedQuote.projectType}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">Timeline</p>
                  <p className="text-gray-900">{selectedQuote.timeline}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">Created</p>
                  <p className="text-gray-900">
                    {format(new Date(selectedQuote.createdAt), 'MMM d, yyyy h:mm a')}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Power Needs</p>
                <p className="text-gray-900 whitespace-pre-wrap bg-gray-50 p-4 rounded-lg">
                  {selectedQuote.powerNeeds}
                </p>
              </div>

              {selectedQuote.message && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Additional Message
                  </p>
                  <p className="text-gray-900 whitespace-pre-wrap bg-gray-50 p-4 rounded-lg">
                    {selectedQuote.message}
                  </p>
                </div>
              )}

              {selectedQuote.invoices.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Related Invoices</p>
                  <div className="space-y-2">
                    {selectedQuote.invoices.map((invoice) => (
                      <Link
                        key={invoice.id}
                        href={`/admin/invoices/${invoice.id}`}
                        className="block p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{invoice.invoiceNumber}</span>
                          <Badge className={getStatusColor(invoice.status)} variant="secondary">
                            {invoice.status}
                          </Badge>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
