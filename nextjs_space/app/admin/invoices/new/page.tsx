'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Plus, Trash2, Save, ArrowLeft } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import Link from 'next/link';

interface InvoiceItem {
  id: string;
  productSku: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

interface Product {
  id: string;
  sku: string;
  name: string;
  description: string;
  priceNumeric: number;
}

function NewInvoiceForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const quoteId = searchParams?.get('quoteId');

  const [loading, setLoading] = useState(false);
  const [loadingQuote, setLoadingQuote] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [formData, setFormData] = useState({
    quoteRequestId: quoteId || '',
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    customerAddress: '',
    status: 'draft',
    taxRate: 0.0,
    depositAmount: 0,
    invoiceDate: new Date().toISOString().split('T')[0],
    dueDate: '',
    notes: '',
    internalNotes: '',
  });

  const [items, setItems] = useState<InvoiceItem[]>([
    {
      id: '1',
      productSku: '',
      description: '',
      quantity: 1,
      unitPrice: 0,
      totalPrice: 0,
    },
  ]);

  useEffect(() => {
    if (quoteId) {
      loadQuoteData(quoteId);
    }
    loadProducts();
  }, [quoteId]);

  const loadProducts = async () => {
    try {
      const response = await fetch('/api/products');
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      }
    } catch (error) {
      console.error('Failed to load products:', error);
    }
  };

  const loadQuoteData = async (id: string) => {
    try {
      setLoadingQuote(true);
      const response = await fetch(`/api/admin/quotes?status=all`);
      if (response.ok) {
        const quotes = await response.json();
        const quote = quotes.find((q: any) => q.id === id);
        if (quote) {
          setFormData((prev) => ({
            ...prev,
            quoteRequestId: quote.id,
            customerName: quote.name,
            customerEmail: quote.email,
            customerPhone: quote.phone,
            customerAddress: quote.location || '',
          }));
        }
      }
    } catch (error) {
      console.error('Failed to load quote:', error);
    } finally {
      setLoadingQuote(false);
    }
  };

  const addItem = () => {
    setItems([
      ...items,
      {
        id: Date.now().toString(),
        productSku: '',
        description: '',
        quantity: 1,
        unitPrice: 0,
        totalPrice: 0,
      },
    ]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter((item) => item.id !== id));
    }
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: any) => {
    setItems(
      items.map((item) => {
        if (item.id === id) {
          const updated = { ...item, [field]: value };
          if (field === 'quantity' || field === 'unitPrice') {
            updated.totalPrice = updated.quantity * updated.unitPrice;
          }
          return updated;
        }
        return item;
      })
    );
  };

  const handleProductSelect = (itemId: string, productId: string) => {
    const product = products.find((p) => p.id === productId);
    if (product) {
      // Use product description if available, otherwise fall back to product name
      const itemDescription = product.description && product.description.trim() 
        ? product.description 
        : product.name;
      
      setItems(
        items.map((item) => {
          if (item.id === itemId) {
            return {
              ...item,
              productSku: product.sku,
              description: itemDescription,
              unitPrice: product.priceNumeric,
              totalPrice: item.quantity * product.priceNumeric,
            };
          }
          return item;
        })
      );
    }
  };

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + item.totalPrice, 0);
  };

  const calculateTax = () => {
    return calculateSubtotal() * formData.taxRate;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate
      if (!formData.customerName || !formData.customerEmail || !formData.customerPhone) {
        toast({
          title: 'Validation Error',
          description: 'Please fill in all required customer fields',
          variant: 'destructive',
        });
        setLoading(false);
        return;
      }

      if (items.some((item) => !item.description || item.unitPrice <= 0)) {
        toast({
          title: 'Validation Error',
          description: 'Please fill in all line items with valid prices',
          variant: 'destructive',
        });
        setLoading(false);
        return;
      }

      const response = await fetch('/api/admin/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          items,
        }),
      });

      if (response.ok) {
        const invoice = await response.json();
        toast({
          title: 'Success',
          description: 'Invoice created successfully',
        });
        router.push(`/admin/invoices/${invoice.id}`);
      } else {
        throw new Error('Failed to create invoice');
      }
    } catch (error) {
      console.error('Failed to create invoice:', error);
      toast({
        title: 'Error',
        description: 'Failed to create invoice',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (loadingQuote) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-green-600 border-t-transparent"></div>
          <p className="text-gray-600">Loading quote data...</p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/invoices">
            <Button type="button" variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Create New Invoice</h1>
            <p className="text-gray-600 mt-1">Fill in the details to generate an invoice</p>
          </div>
        </div>
        <Button
          type="submit"
          disabled={loading}
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Creating...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              Create Invoice
            </span>
          )}
        </Button>
      </div>

      {/* Customer Information */}
      <Card>
        <CardHeader>
          <CardTitle>Customer Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="customerName">Customer Name *</Label>
              <Input
                id="customerName"
                value={formData.customerName}
                onChange={(e) =>
                  setFormData({ ...formData, customerName: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="customerEmail">Email *</Label>
              <Input
                id="customerEmail"
                type="email"
                value={formData.customerEmail}
                onChange={(e) =>
                  setFormData({ ...formData, customerEmail: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="customerPhone">Phone *</Label>
              <Input
                id="customerPhone"
                value={formData.customerPhone}
                onChange={(e) =>
                  setFormData({ ...formData, customerPhone: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="customerAddress">Address</Label>
              <Input
                id="customerAddress"
                value={formData.customerAddress}
                onChange={(e) =>
                  setFormData({ ...formData, customerAddress: e.target.value })
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Invoice Details */}
      <Card>
        <CardHeader>
          <CardTitle>Invoice Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="sent">Sent</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="invoiceDate">Invoice Date</Label>
              <Input
                id="invoiceDate"
                type="date"
                value={formData.invoiceDate}
                onChange={(e) =>
                  setFormData({ ...formData, invoiceDate: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                id="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Line Items */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Line Items</CardTitle>
            <Button type="button" onClick={addItem} variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {items.map((item, index) => (
            <div key={item.id} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Item {index + 1}
                </span>
                {items.length > 1 && (
                  <Button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
              
              {/* Quick Fill from Product Dropdown */}
              <div className="space-y-2 mb-3 bg-blue-50 p-3 rounded-md">
                <Label htmlFor={`product-${item.id}`} className="text-blue-900 font-medium">
                  🚀 Quick Fill from Product Catalog
                </Label>
                <Select onValueChange={(value) => handleProductSelect(item.id, value)}>
                  <SelectTrigger id={`product-${item.id}`} className="bg-white">
                    <SelectValue placeholder="Select a product to auto-fill..." />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    {products.map((product) => (
                      <SelectItem key={product.id} value={product.id}>
                        {product.name} - ${product.priceNumeric.toFixed(2)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-blue-700">
                  Select a product to automatically fill SKU, description, and price
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                <div className="space-y-2">
                  <Label htmlFor={`sku-${item.id}`}>SKU</Label>
                  <Input
                    id={`sku-${item.id}`}
                    value={item.productSku}
                    onChange={(e) => updateItem(item.id, 'productSku', e.target.value)}
                    placeholder="Optional"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor={`desc-${item.id}`}>Description *</Label>
                  <Input
                    id={`desc-${item.id}`}
                    value={item.description}
                    onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                    placeholder="Item description"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`qty-${item.id}`}>Quantity</Label>
                  <Input
                    id={`qty-${item.id}`}
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) =>
                      updateItem(item.id, 'quantity', parseInt(e.target.value) || 1)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`price-${item.id}`}>Unit Price</Label>
                  <Input
                    id={`price-${item.id}`}
                    type="number"
                    min="0"
                    step="0.01"
                    value={item.unitPrice}
                    onChange={(e) =>
                      updateItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)
                    }
                  />
                </div>
              </div>
              <div className="text-right">
                <span className="text-sm text-gray-600">Total: </span>
                <span className="text-lg font-semibold text-gray-900">
                  ${item.totalPrice.toFixed(2)}
                </span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Totals */}
      <Card>
        <CardHeader>
          <CardTitle>Totals</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="taxRate">Tax Rate (%)</Label>
              <Input
                id="taxRate"
                type="number"
                min="0"
                max="100"
                step="0.01"
                value={formData.taxRate * 100}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    taxRate: parseFloat(e.target.value) / 100 || 0,
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="depositAmount">Deposit Amount ($)</Label>
              <Input
                id="depositAmount"
                type="number"
                min="0"
                step="0.01"
                value={formData.depositAmount}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    depositAmount: parseFloat(e.target.value) || 0,
                  })
                }
              />
            </div>
          </div>
          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between text-gray-700">
              <span>Subtotal:</span>
              <span className="font-medium">${calculateSubtotal().toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>Tax ({(formData.taxRate * 100).toFixed(2)}%):</span>
              <span className="font-medium">${calculateTax().toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t">
              <span>Total:</span>
              <span>${calculateTotal().toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notes */}
      <Card>
        <CardHeader>
          <CardTitle>Notes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="notes">Customer Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Notes visible to customer"
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="internalNotes">Internal Notes</Label>
            <Textarea
              id="internalNotes"
              value={formData.internalNotes}
              onChange={(e) =>
                setFormData({ ...formData, internalNotes: e.target.value })
              }
              placeholder="Internal notes (not visible to customer)"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>
    </form>
  );
}

export default function NewInvoicePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NewInvoiceForm />
    </Suspense>
  );
}
