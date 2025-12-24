'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/hooks/use-toast';

interface CustomerFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  customerType: string;
  status: string;
  billingAddress: string;
  billingCity: string;
  billingState: string;
  billingZip: string;
  billingCountry: string;
  shippingAddress: string;
  shippingCity: string;
  shippingState: string;
  shippingZip: string;
  shippingCountry: string;
  taxExempt: boolean;
  taxId: string;
  businessLicense: string;
  notes: string;
}

export default function CustomerEditPage() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<CustomerFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    customerType: 'residential',
    status: 'active',
    billingAddress: '',
    billingCity: '',
    billingState: '',
    billingZip: '',
    billingCountry: 'US',
    shippingAddress: '',
    shippingCity: '',
    shippingState: '',
    shippingZip: '',
    shippingCountry: 'US',
    taxExempt: false,
    taxId: '',
    businessLicense: '',
    notes: '',
  });

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
        setFormData({
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          email: data.email || '',
          phone: data.phone || '',
          company: data.company || '',
          customerType: data.customerType || 'residential',
          status: data.status || 'active',
          billingAddress: data.billingAddress || '',
          billingCity: data.billingCity || '',
          billingState: data.billingState || '',
          billingZip: data.billingZip || '',
          billingCountry: data.billingCountry || 'US',
          shippingAddress: data.shippingAddress || '',
          shippingCity: data.shippingCity || '',
          shippingState: data.shippingState || '',
          shippingZip: data.shippingZip || '',
          shippingCountry: data.shippingCountry || 'US',
          taxExempt: data.taxExempt || false,
          taxId: data.taxId || '',
          businessLicense: data.businessLicense || '',
          notes: data.notes || '',
        });
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    setSaving(true);
    try {
      const response = await fetch(`/api/admin/customers/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Customer updated successfully',
        });
        router.push(`/admin/customers/${params.id}`);
      } else {
        const data = await response.json();
        toast({
          title: 'Error',
          description: data.error || 'Failed to update customer',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error updating customer:', error);
      toast({
        title: 'Error',
        description: 'Failed to update customer',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href={`/admin/customers/${params.id}`}>
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Customer
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Edit Customer</h1>
            <p className="text-gray-600 mt-1">Update customer information</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone *</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="company">Company</Label>
              <Input
                id="company"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="customerType">Customer Type *</Label>
              <Select
                value={formData.customerType}
                onValueChange={(value) => setFormData({ ...formData, customerType: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="residential">Residential</SelectItem>
                  <SelectItem value="commercial">Commercial</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="status">Status *</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="prospect">Prospect</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        {/* Billing Address */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Billing Address</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="billingAddress">Street Address</Label>
              <Input
                id="billingAddress"
                value={formData.billingAddress}
                onChange={(e) => setFormData({ ...formData, billingAddress: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="billingCity">City</Label>
              <Input
                id="billingCity"
                value={formData.billingCity}
                onChange={(e) => setFormData({ ...formData, billingCity: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="billingState">State</Label>
              <Input
                id="billingState"
                value={formData.billingState}
                onChange={(e) => setFormData({ ...formData, billingState: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="billingZip">ZIP Code</Label>
              <Input
                id="billingZip"
                value={formData.billingZip}
                onChange={(e) => setFormData({ ...formData, billingZip: e.target.value })}
              />
            </div>
          </div>
        </Card>

        {/* Shipping Address */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="shippingAddress">Street Address</Label>
              <Input
                id="shippingAddress"
                value={formData.shippingAddress}
                onChange={(e) => setFormData({ ...formData, shippingAddress: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="shippingCity">City</Label>
              <Input
                id="shippingCity"
                value={formData.shippingCity}
                onChange={(e) => setFormData({ ...formData, shippingCity: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="shippingState">State</Label>
              <Input
                id="shippingState"
                value={formData.shippingState}
                onChange={(e) => setFormData({ ...formData, shippingState: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="shippingZip">ZIP Code</Label>
              <Input
                id="shippingZip"
                value={formData.shippingZip}
                onChange={(e) => setFormData({ ...formData, shippingZip: e.target.value })}
              />
            </div>
          </div>
        </Card>

        {/* Tax Information (Commercial Only) */}
        {formData.customerType === 'commercial' && (
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Tax & Business Information</h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="taxExempt"
                  checked={formData.taxExempt}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, taxExempt: checked as boolean })
                  }
                />
                <Label htmlFor="taxExempt" className="cursor-pointer">
                  Tax Exempt
                </Label>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="taxId">Tax ID</Label>
                  <Input
                    id="taxId"
                    value={formData.taxId}
                    onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="businessLicense">Business License</Label>
                  <Input
                    id="businessLicense"
                    value={formData.businessLicense}
                    onChange={(e) => setFormData({ ...formData, businessLicense: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Notes */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Internal Notes</h2>
          <Textarea
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            rows={4}
            placeholder="Add any internal notes about this customer..."
          />
        </Card>

        {/* Actions */}
        <div className="flex gap-4 justify-end">
          <Link href={`/admin/customers/${params.id}`}>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </Link>
          <Button type="submit" disabled={saving}>
            {saving ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
