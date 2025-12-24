'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Edit,
  Mail,
  Phone,
  Building2,
  MapPin,
  Calendar,
  Package,
  DollarSign,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';

interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string | null;
  customerType: string;
  status: string;
  billingAddress: string | null;
  billingCity: string | null;
  billingState: string | null;
  billingZip: string | null;
  shippingAddress: string | null;
  shippingCity: string | null;
  shippingState: string | null;
  shippingZip: string | null;
  taxExempt: boolean;
  taxId: string | null;
  businessLicense: string | null;
  notes: string | null;
  orders: any[];
  createdAt: string;
}

export default function CustomerViewPage() {
  const router = useRouter();
  const params = useParams();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetchCustomer();
    }
  }, [params.id]);

  const fetchCustomer = async () => {
    try {
      const response = await fetch(`/api/admin/customers/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setCustomer(data);
      } else if (response.status === 404) {
        toast({
          title: 'Error',
          description: 'Customer not found',
          variant: 'destructive',
        });
        router.push('/admin/customers');
      }
    } catch (error) {
      console.error('Error fetching customer:', error);
      toast({
        title: 'Error',
        description: 'Failed to load customer',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-green-600 border-t-transparent"></div>
          <p className="text-gray-600">Loading customer...</p>
        </div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="flex h-96 items-center justify-center">
        <p className="text-gray-600">Customer not found</p>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive'> = {
      active: 'default',
      inactive: 'secondary',
      prospect: 'secondary',
    };
    return (
      <Badge variant={variants[status] || 'default'}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/customers">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Customers
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {customer.firstName} {customer.lastName}
            </h1>
            <p className="text-gray-600 mt-1">Customer Details</p>
          </div>
        </div>
        <Link href={`/admin/customers/${customer.id}/edit`}>
          <Button>
            <Edit className="h-4 w-4 mr-2" />
            Edit Customer
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="text-sm text-gray-600">Status</div>
          <div className="mt-2">{getStatusBadge(customer.status)}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-600">Customer Type</div>
          <div className="text-xl font-bold text-gray-900 mt-1">
            {customer.customerType === 'commercial' ? (
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Commercial
              </div>
            ) : (
              'Residential'
            )}
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-600">Total Orders</div>
          <div className="text-2xl font-bold text-green-600 mt-1">
            {customer.orders?.length || 0}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Contact Information */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-gray-700">
              <Mail className="h-5 w-5 text-gray-400" />
              <div>
                <div className="text-sm text-gray-500">Email</div>
                <a href={`mailto:${customer.email}`} className="hover:text-green-600">
                  {customer.email}
                </a>
              </div>
            </div>
            <div className="flex items-center gap-3 text-gray-700">
              <Phone className="h-5 w-5 text-gray-400" />
              <div>
                <div className="text-sm text-gray-500">Phone</div>
                <a href={`tel:${customer.phone}`} className="hover:text-green-600">
                  {customer.phone}
                </a>
              </div>
            </div>
            {customer.company && (
              <div className="flex items-center gap-3 text-gray-700">
                <Building2 className="h-5 w-5 text-gray-400" />
                <div>
                  <div className="text-sm text-gray-500">Company</div>
                  <div>{customer.company}</div>
                </div>
              </div>
            )}
            <div className="flex items-center gap-3 text-gray-700">
              <Calendar className="h-5 w-5 text-gray-400" />
              <div>
                <div className="text-sm text-gray-500">Customer Since</div>
                <div>{new Date(customer.createdAt).toLocaleDateString()}</div>
              </div>
            </div>
          </div>
        </Card>

        {/* Billing Address */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Billing Address</h2>
          {customer.billingAddress ? (
            <div className="flex items-start gap-3 text-gray-700">
              <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <div>{customer.billingAddress}</div>
                <div>
                  {customer.billingCity}, {customer.billingState} {customer.billingZip}
                </div>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">No billing address on file</p>
          )}

          <Separator className="my-4" />

          <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
          {customer.shippingAddress ? (
            <div className="flex items-start gap-3 text-gray-700">
              <Package className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <div>{customer.shippingAddress}</div>
                <div>
                  {customer.shippingCity}, {customer.shippingState} {customer.shippingZip}
                </div>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">No shipping address on file</p>
          )}
        </Card>
      </div>

      {/* Tax Information */}
      {customer.customerType === 'commercial' && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Tax & Business Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="text-sm text-gray-500 mb-1">Tax Exempt</div>
              <Badge variant={customer.taxExempt ? 'default' : 'secondary'}>
                {customer.taxExempt ? 'Yes' : 'No'}
              </Badge>
            </div>
            {customer.taxId && (
              <div>
                <div className="text-sm text-gray-500 mb-1">Tax ID</div>
                <div className="font-mono text-sm">{customer.taxId}</div>
              </div>
            )}
            {customer.businessLicense && (
              <div>
                <div className="text-sm text-gray-500 mb-1">Business License</div>
                <div className="font-mono text-sm">{customer.businessLicense}</div>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Notes */}
      {customer.notes && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Internal Notes</h2>
          <p className="text-gray-700 whitespace-pre-wrap">{customer.notes}</p>
        </Card>
      )}

      {/* Recent Orders */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Order History</h2>
        {customer.orders && customer.orders.length > 0 ? (
          <div className="space-y-3">
            {customer.orders.slice(0, 5).map((order) => (
              <Link
                key={order.id}
                href={`/admin/orders/${order.id}`}
                className="block p-4 border rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Order #{order.orderNumber}</div>
                    <div className="text-sm text-gray-500">
                      {new Date(order.orderDate).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-green-600">
                      ${order.totalAmount.toFixed(2)}
                    </div>
                    <Badge variant="outline">{order.status}</Badge>
                  </div>
                </div>
              </Link>
            ))}
            {customer.orders.length > 5 && (
              <p className="text-sm text-gray-500 text-center pt-2">
                Showing 5 of {customer.orders.length} orders
              </p>
            )}
          </div>
        ) : (
          <p className="text-gray-500">No orders yet</p>
        )}
      </Card>
    </div>
  );
}
