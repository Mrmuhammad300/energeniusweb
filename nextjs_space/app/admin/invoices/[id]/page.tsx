'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import {
  Receipt,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  DollarSign,
  FileText,
  ArrowLeft,
  CheckCircle,
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from '@/hooks/use-toast';
import Link from 'next/link';

interface InvoiceItem {
  id: string;
  productSku: string | null;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string | null;
  status: string;
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  totalAmount: number;
  depositAmount: number | null;
  depositPaid: boolean;
  depositPaidAt: string | null;
  balancePaid: boolean;
  balancePaidAt: string | null;
  paymentMethod: string | null;
  paymentNotes: string | null;
  invoiceDate: string;
  dueDate: string | null;
  notes: string | null;
  internalNotes: string | null;
  items: InvoiceItem[];
  createdAt: string;
  createdBy: {
    name: string | null;
    email: string;
  };
}

export default function InvoiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const invoiceId = params?.id as string;

  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [paymentData, setPaymentData] = useState({
    depositPaid: false,
    balancePaid: false,
    paymentMethod: '',
    paymentNotes: '',
  });

  useEffect(() => {
    if (invoiceId) {
      fetchInvoice();
    }
  }, [invoiceId]);

  const fetchInvoice = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/invoices/${invoiceId}`);
      if (response.ok) {
        const data = await response.json();
        setInvoice(data);
        setPaymentData({
          depositPaid: data.depositPaid,
          balancePaid: data.balancePaid,
          paymentMethod: data.paymentMethod || '',
          paymentNotes: data.paymentNotes || '',
        });
      } else {
        toast({
          title: 'Error',
          description: 'Invoice not found',
          variant: 'destructive',
        });
        router.push('/admin/invoices');
      }
    } catch (error) {
      console.error('Failed to fetch invoice:', error);
      toast({
        title: 'Error',
        description: 'Failed to load invoice',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const updatePaymentStatus = async () => {
    try {
      setUpdating(true);
      const response = await fetch(`/api/admin/invoices/${invoiceId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...paymentData,
          depositPaidAt: paymentData.depositPaid ? new Date().toISOString() : null,
          balancePaidAt: paymentData.balancePaid ? new Date().toISOString() : null,
          status: paymentData.balancePaid ? 'paid' : invoice?.status,
        }),
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Payment status updated',
        });
        fetchInvoice();
      } else {
        throw new Error('Failed to update');
      }
    } catch (error) {
      console.error('Failed to update invoice:', error);
      toast({
        title: 'Error',
        description: 'Failed to update payment status',
        variant: 'destructive',
      });
    } finally {
      setUpdating(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'sent':
        return 'bg-blue-100 text-blue-800';
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-green-600 border-t-transparent"></div>
          <p className="text-gray-600">Loading invoice...</p>
        </div>
      </div>
    );
  }

  if (!invoice) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/invoices">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {invoice.invoiceNumber}
            </h1>
            <p className="text-gray-600 mt-1">Invoice Details</p>
          </div>
        </div>
        <Badge className={getStatusColor(invoice.status)} variant="secondary">
          {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
        </Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Invoice Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Customer Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Name</p>
                  <p className="font-medium text-gray-900">{invoice.customerName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Email</p>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <p className="text-gray-900">{invoice.customerEmail}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Phone</p>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <p className="text-gray-900">{invoice.customerPhone}</p>
                  </div>
                </div>
                {invoice.customerAddress && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Address</p>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <p className="text-gray-900">{invoice.customerAddress}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Line Items */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Line Items
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {invoice.items.map((item, index) => (
                  <div key={item.id}>
                    {index > 0 && <Separator className="my-4" />}
                    <div className="space-y-2">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{item.description}</p>
                          {item.productSku && (
                            <p className="text-sm text-gray-500">SKU: {item.productSku}</p>
                          )}
                        </div>
                        <p className="text-lg font-semibold text-gray-900">
                          ${item.totalPrice.toFixed(2)}
                        </p>
                      </div>
                      <div className="flex gap-4 text-sm text-gray-600">
                        <span>Quantity: {item.quantity}</span>
                        <span>Unit Price: ${item.unitPrice.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                ))}
                <Separator className="my-4" />
                <div className="space-y-2">
                  <div className="flex justify-between text-gray-700">
                    <span>Subtotal:</span>
                    <span className="font-medium">${invoice.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Tax ({(invoice.taxRate * 100).toFixed(2)}%):</span>
                    <span className="font-medium">${invoice.taxAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t">
                    <span>Total:</span>
                    <span>${invoice.totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          {(invoice.notes || invoice.internalNotes) && (
            <Card>
              <CardHeader>
                <CardTitle>Notes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {invoice.notes && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      Customer Notes
                    </p>
                    <p className="text-gray-900 whitespace-pre-wrap bg-gray-50 p-3 rounded">
                      {invoice.notes}
                    </p>
                  </div>
                )}
                {invoice.internalNotes && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      Internal Notes
                    </p>
                    <p className="text-gray-900 whitespace-pre-wrap bg-yellow-50 p-3 rounded border border-yellow-200">
                      {invoice.internalNotes}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column - Payment & Metadata */}
        <div className="space-y-6">
          {/* Invoice Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Invoice Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Invoice Date</p>
                <p className="font-medium text-gray-900">
                  {format(new Date(invoice.invoiceDate), 'MMM d, yyyy')}
                </p>
              </div>
              {invoice.dueDate && (
                <div>
                  <p className="text-sm text-gray-600">Due Date</p>
                  <p className="font-medium text-gray-900">
                    {format(new Date(invoice.dueDate), 'MMM d, yyyy')}
                  </p>
                </div>
              )}
              <div>
                <p className="text-sm text-gray-600">Created By</p>
                <p className="font-medium text-gray-900">
                  {invoice.createdBy.name || invoice.createdBy.email}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Created On</p>
                <p className="font-medium text-gray-900">
                  {format(new Date(invoice.createdAt), 'MMM d, yyyy h:mm a')}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Payment Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Payment Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {invoice.depositAmount && invoice.depositAmount > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="depositPaid">Deposit Paid</Label>
                    <div className="flex items-center gap-2">
                      <input
                        id="depositPaid"
                        type="checkbox"
                        checked={paymentData.depositPaid}
                        onChange={(e) =>
                          setPaymentData({
                            ...paymentData,
                            depositPaid: e.target.checked,
                          })
                        }
                        className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                      />
                      {invoice.depositPaid && (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    Deposit Amount: ${invoice.depositAmount.toFixed(2)}
                  </p>
                  {invoice.depositPaidAt && (
                    <p className="text-xs text-gray-500">
                      Paid: {format(new Date(invoice.depositPaidAt), 'MMM d, yyyy')}
                    </p>
                  )}
                </div>
              )}

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="balancePaid">Balance Paid</Label>
                  <div className="flex items-center gap-2">
                    <input
                      id="balancePaid"
                      type="checkbox"
                      checked={paymentData.balancePaid}
                      onChange={(e) =>
                        setPaymentData({
                          ...paymentData,
                          balancePaid: e.target.checked,
                        })
                      }
                      className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                    {invoice.balancePaid && (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    )}
                  </div>
                </div>
                {invoice.balancePaidAt && (
                  <p className="text-xs text-gray-500">
                    Paid: {format(new Date(invoice.balancePaidAt), 'MMM d, yyyy')}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="paymentMethod">Payment Method</Label>
                <Select
                  value={paymentData.paymentMethod}
                  onValueChange={(value) =>
                    setPaymentData({ ...paymentData, paymentMethod: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ach">ACH Transfer</SelectItem>
                    <SelectItem value="wire_transfer">Wire Transfer</SelectItem>
                    <SelectItem value="credit_card">Credit Card</SelectItem>
                    <SelectItem value="check">Check</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="paymentNotes">Payment Notes</Label>
                <Textarea
                  id="paymentNotes"
                  value={paymentData.paymentNotes}
                  onChange={(e) =>
                    setPaymentData({ ...paymentData, paymentNotes: e.target.value })
                  }
                  placeholder="Any notes about the payment"
                  rows={3}
                />
              </div>

              <Button
                onClick={updatePaymentStatus}
                disabled={updating}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
              >
                {updating ? (
                  <span className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Updating...
                  </span>
                ) : (
                  'Update Payment Status'
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
