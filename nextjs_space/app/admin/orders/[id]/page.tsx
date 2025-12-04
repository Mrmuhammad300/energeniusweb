'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Truck, Mail, Copy, Plus, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [generatedEmail, setGeneratedEmail] = useState<any>(null);
  const [shipmentDialogOpen, setShipmentDialogOpen] = useState(false);
  const [shipmentData, setShipmentData] = useState({
    carrier: '',
    trackingNumber: '',
    trackingUrl: '',
    estimatedDelivery: '',
  });

  useEffect(() => {
    fetchOrder();
  }, [params.id]);

  const fetchOrder = async () => {
    try {
      const response = await fetch(`/api/admin/orders/${params.id}`);
      if (response.ok) {
        setOrder(await response.json());
      } else {
        toast({ title: 'Error', description: 'Order not found', variant: 'destructive' });
        router.push('/admin/orders');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateEmail = async (templateName: string) => {
    try {
      const response = await fetch(`/api/admin/orders/${params.id}/generate-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ templateName }),
      });

      if (response.ok) {
        const email = await response.json();
        setGeneratedEmail(email);
        setEmailDialogOpen(true);
      } else {
        toast({ title: 'Error', description: 'Failed to generate email', variant: 'destructive' });
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to generate email', variant: 'destructive' });
    }
  };

  const copyEmailToClipboard = () => {
    if (!generatedEmail) return;
    const emailText = `To: ${generatedEmail.to}\nSubject: ${generatedEmail.subject}\n\n${generatedEmail.body}`;
    navigator.clipboard.writeText(emailText);
    toast({ title: 'Copied!', description: 'Email content copied to clipboard' });
  };

  const addShipment = async () => {
    if (!shipmentData.carrier || !shipmentData.trackingNumber) {
      toast({ title: 'Error', description: 'Carrier and tracking number required', variant: 'destructive' });
      return;
    }

    try {
      const response = await fetch(`/api/admin/orders/${params.id}/shipments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...shipmentData,
          shippedDate: new Date().toISOString(),
          status: 'in_transit',
        }),
      });

      if (response.ok) {
        toast({ title: 'Success', description: 'Shipment added successfully' });
        setShipmentDialogOpen(false);
        setShipmentData({ carrier: '', trackingNumber: '', trackingUrl: '', estimatedDelivery: '' });
        fetchOrder();
      } else {
        toast({ title: 'Error', description: 'Failed to add shipment', variant: 'destructive' });
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to add shipment', variant: 'destructive' });
    }
  };

  if (loading || !order) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-green-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/orders">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Orders
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">{order.orderNumber}</h1>
            <p className="text-gray-600">Order Details & Fulfillment</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => generateEmail('powerx_order_notification')}>
            <Mail className="h-4 w-4 mr-2" />
            Generate PowerX Email
          </Button>
          <Button variant="outline" onClick={() => setShipmentDialogOpen(true)}>
            <Truck className="h-4 w-4 mr-2" />
            Add Shipment
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 col-span-2">
          <h2 className="text-xl font-semibold mb-4">Order Information</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Status:</span>
              <Badge>{order.status}</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Order Date:</span>
              <span>{new Date(order.orderDate).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Customer:</span>
              <span className="font-medium">{order.customerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Email:</span>
              <span>{order.customerEmail}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Phone:</span>
              <span>{order.customerPhone}</span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal:</span>
              <span>${order.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tax:</span>
              <span>${order.taxAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg pt-3 border-t">
              <span>Total:</span>
              <span>${order.totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
        <div className="text-gray-700">
          <p>{order.shippingAddress}</p>
          <p>{order.shippingCity}, {order.shippingState} {order.shippingZip}</p>
          <p>{order.shippingCountry}</p>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Order Items</h2>
        <div className="space-y-3">
          {order.items.map((item: any) => (
            <div key={item.id} className="flex justify-between items-center py-3 border-b last:border-0">
              <div>
                <div className="font-medium">{item.productName}</div>
                <div className="text-sm text-gray-600">SKU: {item.productSku}</div>
                <div className="text-sm text-gray-600">Qty: {item.quantity}</div>
              </div>
              <div className="text-right">
                <div className="font-medium">${item.totalPrice.toFixed(2)}</div>
                <div className="text-sm text-gray-600">${item.unitPrice.toFixed(2)} each</div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {order.shipments.length > 0 && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Shipment Tracking</h2>
          <div className="space-y-4">
            {order.shipments.map((shipment: any) => (
              <div key={shipment.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Truck className="h-5 w-5 text-blue-600" />
                    <span className="font-medium">{shipment.carrier}</span>
                  </div>
                  <Badge>{shipment.status}</Badge>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-600">Tracking:</span>{' '}
                    <span className="font-mono">{shipment.trackingNumber}</span>
                  </div>
                  {shipment.trackingUrl && (
                    <div>
                      <a href={shipment.trackingUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        Track Package →
                      </a>
                    </div>
                  )}
                  {shipment.estimatedDelivery && (
                    <div>
                      <span className="text-gray-600">Est. Delivery:</span>{' '}
                      {new Date(shipment.estimatedDelivery).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      <Dialog open={emailDialogOpen} onOpenChange={setEmailDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Generated Email</DialogTitle>
            <DialogDescription>
              Copy this email and send it to PowerX supplier
            </DialogDescription>
          </DialogHeader>
          {generatedEmail && (
            <div className="space-y-4">
              <div>
                <Label>To:</Label>
                <Input value={generatedEmail.to} readOnly />
              </div>
              <div>
                <Label>Subject:</Label>
                <Input value={generatedEmail.subject} readOnly />
              </div>
              <div>
                <Label>Body:</Label>
                <Textarea value={generatedEmail.body} readOnly rows={15} className="font-mono text-sm" />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={copyEmailToClipboard}>
              <Copy className="h-4 w-4 mr-2" />
              Copy to Clipboard
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={shipmentDialogOpen} onOpenChange={setShipmentDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Shipment</DialogTitle>
            <DialogDescription>Record shipment tracking information</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Carrier *</Label>
              <Select value={shipmentData.carrier} onValueChange={(v) => setShipmentData({...shipmentData, carrier: v})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select carrier" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="UPS">UPS</SelectItem>
                  <SelectItem value="FedEx">FedEx</SelectItem>
                  <SelectItem value="USPS">USPS</SelectItem>
                  <SelectItem value="DHL">DHL</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Tracking Number *</Label>
              <Input value={shipmentData.trackingNumber} onChange={(e) => setShipmentData({...shipmentData, trackingNumber: e.target.value})} />
            </div>
            <div>
              <Label>Tracking URL</Label>
              <Input value={shipmentData.trackingUrl} onChange={(e) => setShipmentData({...shipmentData, trackingUrl: e.target.value})} placeholder="https://..." />
            </div>
            <div>
              <Label>Estimated Delivery</Label>
              <Input type="date" value={shipmentData.estimatedDelivery} onChange={(e) => setShipmentData({...shipmentData, estimatedDelivery: e.target.value})} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShipmentDialogOpen(false)}>Cancel</Button>
            <Button onClick={addShipment}>Add Shipment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
