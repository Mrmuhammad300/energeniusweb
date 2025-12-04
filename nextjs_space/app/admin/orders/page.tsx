'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Plus, Search, Eye, Package, Mail, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  status: string;
  fulfillmentStatus: string;
  totalAmount: number;
  orderDate: string;
  items: any[];
  shipments: any[];
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  customerName: string;
  customerEmail: string;
  status: string;
  depositPaid: boolean;
  balancePaid: boolean;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [paidInvoices, setPaidInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  useEffect(() => {
    fetchOrders();
    fetchPaidInvoices();
  }, [statusFilter]);

  const fetchOrders = async () => {
    try {
      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.append('status', statusFilter);

      const response = await fetch(`/api/admin/orders?${params.toString()}`);
      if (response.ok) {
        setOrders(await response.json());
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPaidInvoices = async () => {
    try {
      const response = await fetch('/api/admin/invoices?status=paid');
      if (response.ok) {
        const invoices = await response.json();
        const fullyPaid = invoices.filter((inv: Invoice) => 
          inv.depositPaid && inv.balancePaid
        );
        setPaidInvoices(fullyPaid);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const createOrderFromInvoice = async (invoiceId: string) => {
    try {
      const response = await fetch(`/api/admin/invoices/${invoiceId}`);
      if (!response.ok) {
        toast({ title: 'Error', description: 'Failed to load invoice', variant: 'destructive' });
        return;
      }

      const invoice = await response.json();
      
      // Create order from invoice
      const orderResponse = await fetch('/api/admin/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          invoiceId: invoice.id,
          invoiceNumber: invoice.invoiceNumber,
          customerName: invoice.customerName,
          customerEmail: invoice.customerEmail,
          customerPhone: invoice.customerPhone || '(000) 000-0000',
          shippingAddress: invoice.customerAddress?.split('\n')[0] || 'TBD',
          shippingCity: invoice.customerAddress?.split(',')[0] || 'TBD',
          shippingState: 'OH',
          shippingZip: '00000',
          billingAddress: invoice.customerAddress?.split('\n')[0] || 'TBD',
          billingCity: invoice.customerAddress?.split(',')[0] || 'TBD',
          billingState: 'OH',
          billingZip: '00000',
          taxAmount: invoice.taxAmount,
          items: invoice.items.map((item: any) => ({
            productSku: item.productSku || 'CUSTOM',
            productName: item.description,
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.totalPrice,
          })),
        }),
      });

      if (orderResponse.ok) {
        toast({ title: 'Success', description: 'Order created successfully!' });
        setCreateDialogOpen(false);
        fetchOrders();
        fetchPaidInvoices();
      } else {
        const data = await orderResponse.json();
        toast({ title: 'Error', description: data.error, variant: 'destructive' });
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to create order', variant: 'destructive' });
    }
  };

  const getStatusBadge = (status: string) => {
    const config: Record<string, { variant: any; text: string }> = {
      pending: { variant: 'secondary', text: 'Pending' },
      processing: { variant: 'default', text: 'Processing' },
      shipped: { variant: 'default', text: 'Shipped' },
      delivered: { variant: 'default', text: 'Delivered' },
      completed: { variant: 'default', text: 'Completed' },
      cancelled: { variant: 'destructive', text: 'Cancelled' },
    };
    const { variant, text } = config[status] || config.pending;
    return <Badge variant={variant}>{text}</Badge>;
  };

  const filteredOrders = orders.filter(order => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      order.orderNumber.toLowerCase().includes(search) ||
      order.customerName.toLowerCase().includes(search) ||
      order.customerEmail.toLowerCase().includes(search)
    );
  });

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-green-600 border-t-transparent"></div>
          <p className="text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Orders & Fulfillment</h1>
            <p className="text-gray-600 mt-1">Manage orders and track shipments</p>
          </div>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Order from Invoice
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-sm text-gray-600">Total Orders</div>
          <div className="text-2xl font-bold">{orders.length}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-600">Pending</div>
          <div className="text-2xl font-bold text-amber-600">
            {orders.filter(o => o.status === 'pending').length}
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-600">Shipped</div>
          <div className="text-2xl font-bold text-blue-600">
            {orders.filter(o => o.status === 'shipped').length}
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-600">Delivered</div>
          <div className="text-2xl font-bold text-green-600">
            {orders.filter(o => o.status === 'delivered').length}
          </div>
        </Card>
      </div>

      <Card className="p-4">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="shipped">Shipped</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {filteredOrders.length === 0 ? (
        <Card className="p-12 text-center">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No orders found</p>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredOrders.map((order) => (
            <Card key={order.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold">{order.orderNumber}</h3>
                    {getStatusBadge(order.status)}
                  </div>
                  <div className="text-gray-600 mb-2">
                    {order.customerName} • {order.customerEmail}
                  </div>
                  <div className="text-sm text-gray-600">
                    <div className="flex items-center gap-4">
                      <span>💰 ${order.totalAmount.toFixed(2)}</span>
                      <span>📦 {order.items.length} item(s)</span>
                      <span>📅 {new Date(order.orderDate).toLocaleDateString()}</span>
                      {order.shipments.length > 0 && (
                        <span className="flex items-center gap-1">
                          <Truck className="h-4 w-4" />
                          {order.shipments.length} shipment(s)
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link href={`/admin/orders/${order.id}`}>
                    <Button size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create Order from Paid Invoice</DialogTitle>
            <DialogDescription>
              Select a fully paid invoice to create an order and begin fulfillment
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-96 overflow-y-auto space-y-2">
            {paidInvoices.length === 0 ? (
              <p className="text-center text-gray-600 py-8">
                No fully paid invoices available
              </p>
            ) : (
              paidInvoices.map((invoice) => (
                <Card key={invoice.id} className="p-4 hover:bg-gray-50 cursor-pointer" onClick={() => createOrderFromInvoice(invoice.id)}>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{invoice.invoiceNumber}</div>
                      <div className="text-sm text-gray-600">
                        {invoice.customerName} • {invoice.customerEmail}
                      </div>
                    </div>
                    <Button size="sm">Create Order</Button>
                  </div>
                </Card>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
