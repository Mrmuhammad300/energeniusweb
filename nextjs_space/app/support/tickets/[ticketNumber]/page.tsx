"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, Clock, User, Mail, Phone, Package, Tag, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

interface TicketReply {
  id: string;
  message: string;
  authorName: string;
  authorEmail: string;
  isCustomerReply: boolean;
  createdAt: string;
}

interface Ticket {
  id: string;
  ticketNumber: string;
  subject: string;
  status: string;
  category: string;
  priority: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string | null;
  description: string;
  orderNumber: string | null;
  productSku: string | null;
  createdAt: string;
  updatedAt: string;
  replies: TicketReply[];
}

export default function TicketDetailPage() {
  const params = useParams();
  const ticketNumber = params.ticketNumber as string;
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [replyMessage, setReplyMessage] = useState('');
  const [submittingReply, setSubmittingReply] = useState(false);

  useEffect(() => {
    if (ticketNumber) {
      fetchTicket();
    }
  }, [ticketNumber]);

  const fetchTicket = async () => {
    try {
      const response = await fetch(`/api/support/tickets?ticketNumber=${ticketNumber}`);
      const data = await response.json();

      if (response.ok) {
        setTicket(data.ticket);
      } else {
        toast.error('Ticket not found', {
          description: 'Could not find a ticket with this number'
        });
      }
    } catch (error) {
      toast.error('Failed to load ticket');
    } finally {
      setLoading(false);
    }
  };

  const handleAddReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyMessage.trim()) return;

    setSubmittingReply(true);
    try {
      // This would call an API to add a reply
      // For now, we'll just show a toast
      toast.info('Reply functionality coming soon', {
        description: 'For immediate assistance, please use live chat or call us'
      });
      setReplyMessage('');
    } catch (error) {
      toast.error('Failed to add reply');
    } finally {
      setSubmittingReply(false);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card>
            <CardContent className="py-12 text-center">
              <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Ticket Not Found</h2>
              <p className="text-gray-600 mb-6">We couldn't find a ticket with number {ticketNumber}</p>
              <Link href="/support">
                <Button>Back to Support</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/support" className="text-emerald-600 hover:text-emerald-700 text-sm font-medium mb-4 inline-block">
            ← Back to Support
          </Link>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{ticket.subject}</h1>
              <p className="text-gray-600">Ticket #{ticket.ticketNumber}</p>
            </div>
            <div className="flex space-x-2">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                {ticket.status.replace('_', ' ').toUpperCase()}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                {ticket.priority.toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Original Issue */}
            <Card>
              <CardHeader>
                <CardTitle>Issue Description</CardTitle>
                <CardDescription>
                  Submitted by {ticket.customerName} on {new Date(ticket.createdAt).toLocaleString()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 whitespace-pre-wrap">{ticket.description}</p>
              </CardContent>
            </Card>

            {/* Replies */}
            {ticket.replies && ticket.replies.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Conversation History</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {ticket.replies.map((reply) => (
                    <div
                      key={reply.id}
                      className={`p-4 rounded-lg ${
                        reply.isCustomerReply ? 'bg-blue-50 border-l-4 border-blue-500' : 'bg-emerald-50 border-l-4 border-emerald-500'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4" />
                          <span className="font-semibold">{reply.authorName}</span>
                          {!reply.isCustomerReply && (
                            <Badge variant="outline" className="text-xs">Support Team</Badge>
                          )}
                        </div>
                        <span className="text-xs text-gray-500">
                          {new Date(reply.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-gray-700 whitespace-pre-wrap">{reply.message}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Add Reply Form */}
            <Card>
              <CardHeader>
                <CardTitle>Add a Reply</CardTitle>
                <CardDescription>Our support team will be notified of your message</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddReply} className="space-y-4">
                  <Textarea
                    placeholder="Type your message here..."
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    rows={4}
                    className="resize-none"
                  />
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-500">Feature coming soon</p>
                    <Button type="submit" disabled={submittingReply || !replyMessage.trim()}>
                      {submittingReply ? 'Sending...' : 'Send Reply'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Ticket Details */}
            <Card>
              <CardHeader>
                <CardTitle>Ticket Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center space-x-2 text-gray-600 mb-1">
                    <Tag className="h-4 w-4" />
                    <span className="text-sm font-medium">Category</span>
                  </div>
                  <p className="text-gray-900 ml-6">{ticket.category.replace('_', ' ')}</p>
                </div>

                <div>
                  <div className="flex items-center space-x-2 text-gray-600 mb-1">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm font-medium">Last Updated</span>
                  </div>
                  <p className="text-gray-900 ml-6">{new Date(ticket.updatedAt).toLocaleString()}</p>
                </div>

                {ticket.orderNumber && (
                  <div>
                    <div className="flex items-center space-x-2 text-gray-600 mb-1">
                      <Package className="h-4 w-4" />
                      <span className="text-sm font-medium">Order Number</span>
                    </div>
                    <p className="text-gray-900 ml-6 font-mono text-sm">{ticket.orderNumber}</p>
                  </div>
                )}

                {ticket.productSku && (
                  <div>
                    <div className="flex items-center space-x-2 text-gray-600 mb-1">
                      <Tag className="h-4 w-4" />
                      <span className="text-sm font-medium">Product SKU</span>
                    </div>
                    <p className="text-gray-900 ml-6 font-mono text-sm">{ticket.productSku}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start space-x-2">
                  <User className="h-4 w-4 text-gray-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600">Name</p>
                    <p className="text-gray-900">{ticket.customerName}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-2">
                  <Mail className="h-4 w-4 text-gray-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <a href={`mailto:${ticket.customerEmail}`} className="text-emerald-600 hover:text-emerald-700">
                      {ticket.customerEmail}
                    </a>
                  </div>
                </div>

                {ticket.customerPhone && (
                  <div className="flex items-start space-x-2">
                    <Phone className="h-4 w-4 text-gray-600 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-600">Phone</p>
                      <a href={`tel:${ticket.customerPhone}`} className="text-emerald-600 hover:text-emerald-700">
                        {ticket.customerPhone}
                      </a>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Need More Help?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => {
                    // @ts-ignore
                    if (window.Tawk_API) {
                      // @ts-ignore
                      window.Tawk_API.maximize();
                    }
                  }}
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Start Live Chat
                </Button>
                <Link href="/support/kb" className="block">
                  <Button variant="outline" className="w-full justify-start">
                    Browse Knowledge Base
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}