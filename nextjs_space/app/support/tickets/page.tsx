"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, Mail } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

interface Ticket {
  id: string;
  ticketNumber: string;
  subject: string;
  status: string;
  category: string;
  priority: string;
  createdAt: string;
}

export default function TicketStatusPage() {
  const [searchType, setSearchType] = useState<'ticketNumber' | 'email'>('ticketNumber');
  const [searchValue, setSearchValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [singleTicket, setSingleTicket] = useState<Ticket | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTickets([]);
    setSingleTicket(null);

    try {
      const params = new URLSearchParams();
      if (searchType === 'ticketNumber') {
        params.set('ticketNumber', searchValue);
      } else {
        params.set('email', searchValue);
      }

      const response = await fetch(`/api/support/tickets?${params.toString()}`);
      const data = await response.json();

      if (response.ok) {
        if (data.ticket) {
          setSingleTicket(data.ticket);
        } else if (data.tickets) {
          setTickets(data.tickets);
          if (data.tickets.length === 0) {
            toast.info('No tickets found', {
              description: 'No support tickets found for this email address'
            });
          }
        }
      } else {
        toast.error('Not found', {
          description: data.error || 'Could not find any matching tickets'
        });
      }
    } catch (error) {
      toast.error('Search failed', {
        description: 'Please try again later'
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'waiting_customer':
        return 'bg-yellow-100 text-yellow-800';
      case 'resolved':
        return 'bg-purple-100 text-purple-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'medium':
        return 'bg-blue-100 text-blue-800';
      case 'low':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Check Ticket Status</h1>
          <p className="text-gray-600">Search for your support ticket by ticket number or email address</p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Search Tickets</CardTitle>
            <CardDescription>Find your support tickets</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="flex space-x-4">
                <Button
                  type="button"
                  variant={searchType === 'ticketNumber' ? 'default' : 'outline'}
                  onClick={() => setSearchType('ticketNumber')}
                  className="flex-1"
                >
                  <Search className="h-4 w-4 mr-2" />
                  By Ticket Number
                </Button>
                <Button
                  type="button"
                  variant={searchType === 'email' ? 'default' : 'outline'}
                  onClick={() => setSearchType('email')}
                  className="flex-1"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  By Email
                </Button>
              </div>

              <div>
                <Label htmlFor="searchValue">
                  {searchType === 'ticketNumber' ? 'Ticket Number' : 'Email Address'}
                </Label>
                <Input
                  id="searchValue"
                  type={searchType === 'ticketNumber' ? 'text' : 'email'}
                  placeholder={searchType === 'ticketNumber' ? 'TKT-12345678-001' : 'your@email.com'}
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  required
                />
              </div>

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? 'Searching...' : 'Search Tickets'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Single Ticket Result */}
        {singleTicket && (
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>{singleTicket.subject}</CardTitle>
                  <CardDescription>Ticket #{singleTicket.ticketNumber}</CardDescription>
                </div>
                <div className="flex space-x-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(singleTicket.status)}`}>
                    {singleTicket.status.replace('_', ' ').toUpperCase()}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(singleTicket.priority)}`}>
                    {singleTicket.priority.toUpperCase()}
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Category</p>
                  <p className="font-medium">{singleTicket.category.replace('_', ' ')}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Created</p>
                  <p className="font-medium">{new Date(singleTicket.createdAt).toLocaleString()}</p>
                </div>
                <Link href={`/support/tickets/${singleTicket.ticketNumber}`}>
                  <Button className="w-full">View Full Ticket Details</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Multiple Tickets Result */}
        {tickets.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">Your Tickets ({tickets.length})</h2>
            {tickets.map((ticket) => (
              <Card key={ticket.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{ticket.subject}</CardTitle>
                      <CardDescription>#{ticket.ticketNumber}</CardDescription>
                    </div>
                    <div className="flex space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                        {ticket.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      Created: {new Date(ticket.createdAt).toLocaleDateString()}
                    </div>
                    <Link href={`/support/tickets/${ticket.ticketNumber}`}>
                      <Button variant="outline" size="sm">View Details</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}