'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import {
  Calculator,
  Zap,
  DollarSign,
  Package,
  ArrowLeft,
  Check,
  TrendingDown,
  Copy,
  RotateCcw,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from '@/hooks/use-toast';
import {
  calculateDeal,
  INSTALL_PACKAGES,
  formatCurrency,
  formatCurrencyExact,
  type DealCalculation,
} from '@/lib/install-calculator';

interface Product {
  id: string;
  model: string;
  sku: string;
  priceNumeric: number;
  wattage: string;
  category: string;
  tier: string;
}

export default function InstallCalculatorPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [category, setCategory] = useState<'residential' | 'commercial'>('residential');
  const [selectedPackageId, setSelectedPackageId] = useState<string>('');
  const [commissionRate, setCommissionRate] = useState<number>(15);
  const [customerName, setCustomerName] = useState<string>('');

  // Fetch products on mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products');
        if (res.ok) {
          const data = await res.json();
          setProducts(data);
        }
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Derive selected product
  const selectedProduct = useMemo(
    () => products.find((p) => p.id === selectedProductId) ?? null,
    [products, selectedProductId]
  );

  // Parse wattage from product string (e.g., "5,000W" → 5000)
  const productWattage = useMemo(() => {
    if (!selectedProduct) return 0;
    const match = selectedProduct.wattage.replace(/,/g, '').match(/(\d+)/);
    return match ? parseInt(match[1], 10) : 0;
  }, [selectedProduct]);

  // Available install packages for current category
  const availablePackages = useMemo(() => {
    return category === 'commercial'
      ? INSTALL_PACKAGES.commercial
      : INSTALL_PACKAGES.residential;
  }, [category]);

  // Reset package selection when category changes
  useEffect(() => {
    setSelectedPackageId('');
  }, [category]);

  // Calculate deal whenever inputs change
  const calculation: DealCalculation | null = useMemo(() => {
    if (!selectedProduct) return null;
    return calculateDeal({
      unitPrice: selectedProduct.priceNumeric,
      wattage: productWattage,
      quantity,
      installPackageId: selectedPackageId || null,
      commissionRate: commissionRate / 100,
      category,
    });
  }, [selectedProduct, productWattage, quantity, selectedPackageId, commissionRate, category]);

  const handleReset = () => {
    setSelectedProductId('');
    setQuantity(1);
    setCategory('residential');
    setSelectedPackageId('');
    setCommissionRate(15);
    setCustomerName('');
  };

  const handleCopySummary = () => {
    if (!calculation || !selectedProduct) return;
    const pkg = availablePackages.find((p) => p.id === selectedPackageId);
    const lines = [
      `DEAL ESTIMATE${customerName ? ` — ${customerName}` : ''}`,
      `Date: ${new Date().toLocaleDateString()}`,
      '',
      `Equipment: ${selectedProduct.model} (${selectedProduct.wattage})`,
      `Qty: ${quantity} × ${formatCurrency(calculation.unitPrice)} = ${formatCurrency(calculation.equipmentSubtotal)}`,
      calculation.multiUnitDiscount > 0
        ? `Multi-Unit Discount: -${formatCurrency(calculation.multiUnitDiscount)}`
        : null,
      `Equipment Total: ${formatCurrency(calculation.equipmentTotal)}`,
      '',
      `Install Package: ${calculation.installPackageName}`,
      pkg ? `Timeline: ${pkg.timeline}` : null,
      calculation.installBundleSavings > 0
        ? `Bundle Savings: -${formatCurrency(calculation.installBundleSavings)}`
        : null,
      `Install Total: ${formatCurrency(calculation.installTotal)}`,
      calculation.monthlyFee > 0
        ? `Monthly Service: ${formatCurrencyExact(calculation.monthlyFee)}/mo`
        : null,
      '',
      calculation.totalSavings > 0
        ? `Total Savings: -${formatCurrency(calculation.totalSavings)}`
        : null,
      `DEAL TOTAL: ${formatCurrency(calculation.dealTotal)}`,
      `Commission (${commissionRate}%): ${formatCurrencyExact(calculation.commissionAmount)}`,
    ]
      .filter(Boolean)
      .join('\n');

    navigator.clipboard.writeText(lines).then(() => {
      toast({ title: 'Copied', description: 'Deal summary copied to clipboard' });
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-green-600 border-t-transparent" />
          <p className="text-gray-600">Loading calculator...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/admin/dashboard')}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Dashboard
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Calculator className="h-6 w-6 text-green-600" />
              Install Cost Calculator
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Quick deal pricing for reps — equipment + install + savings
            </p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={handleReset} className="gap-2">
          <RotateCcw className="h-4 w-4" />
          Reset
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left: Inputs (3 cols) */}
        <div className="lg:col-span-3 space-y-5">
          {/* Customer (optional) */}
          <Card>
            <CardContent className="pt-5 pb-4">
              <Label htmlFor="customer-name" className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Customer Name (optional)
              </Label>
              <Input
                id="customer-name"
                placeholder="e.g. John Smith"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="mt-1.5"
              />
            </CardContent>
          </Card>

          {/* Step 1: Equipment */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-green-100 text-green-700 text-xs font-bold">
                  1
                </div>
                Select Equipment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="product-select">Generator Model</Label>
                <Select value={selectedProductId} onValueChange={setSelectedProductId}>
                  <SelectTrigger id="product-select" className="mt-1.5">
                    <SelectValue placeholder="Choose a generator..." />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map((product) => (
                      <SelectItem key={product.id} value={product.id}>
                        {product.model} — {product.wattage} — {formatCurrency(product.priceNumeric)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min={1}
                    max={50}
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="category">Project Type</Label>
                  <Select value={category} onValueChange={(v) => setCategory(v as 'residential' | 'commercial')}>
                    <SelectTrigger id="category" className="mt-1.5">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="residential">Residential</SelectItem>
                      <SelectItem value="commercial">Commercial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {selectedProduct && (
                <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 text-sm">
                  <Zap className="h-4 w-4 text-green-600 flex-shrink-0" />
                  <span className="text-gray-700">
                    <span className="font-medium">{selectedProduct.model}</span>
                    {' '}&middot;{' '}{selectedProduct.wattage}
                    {' '}&middot;{' '}{formatCurrency(selectedProduct.priceNumeric)} each
                  </span>
                  {productWattage >= 5000 && (
                    <Badge variant="secondary" className="ml-auto bg-green-100 text-green-700 text-xs">
                      Bundle eligible
                    </Badge>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Step 2: Install Package */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-green-100 text-green-700 text-xs font-bold">
                  2
                </div>
                Choose Install Package
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                {/* No install option */}
                <button
                  type="button"
                  onClick={() => setSelectedPackageId('')}
                  className={`w-full text-left p-3 rounded-lg border-2 transition-colors ${
                    selectedPackageId === ''
                      ? 'border-green-600 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900 text-sm">Equipment Only</p>
                      <p className="text-xs text-gray-500">No installation service</p>
                    </div>
                    <span className="font-semibold text-gray-900">$0</span>
                  </div>
                </button>

                {availablePackages.map((pkg) => {
                  const hasBundlePrice = pkg.bundlePrice != null && productWattage >= 5000;
                  return (
                    <button
                      key={pkg.id}
                      type="button"
                      onClick={() => setSelectedPackageId(pkg.id)}
                      className={`w-full text-left p-3 rounded-lg border-2 transition-colors ${
                        selectedPackageId === pkg.id
                          ? 'border-green-600 bg-green-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-gray-900 text-sm">{pkg.name}</p>
                            {'isPopular' in pkg && (pkg as any).isPopular && (
                              <Badge className="bg-amber-100 text-amber-800 text-[10px] px-1.5 py-0">
                                Popular
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 mt-0.5">{pkg.description}</p>
                          <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-400">
                            <span>{pkg.timeline}</span>
                            <span>&middot;</span>
                            <span>{pkg.warranty}</span>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          {hasBundlePrice ? (
                            <>
                              <p className="text-xs text-gray-400 line-through">
                                {formatCurrency(pkg.price)}
                              </p>
                              <p className="font-semibold text-green-700">
                                {formatCurrency(pkg.bundlePrice!)}
                              </p>
                            </>
                          ) : (
                            <p className="font-semibold text-gray-900">
                              {formatCurrency(pkg.price)}
                            </p>
                          )}
                          {'monthlyFee' in pkg && (pkg as any).monthlyFee > 0 && (
                            <p className="text-[10px] text-gray-400">
                              + ${(pkg as any).monthlyFee}/mo
                            </p>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Commission */}
          <Card>
            <CardContent className="pt-5 pb-4">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <Label htmlFor="commission" className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Commission Rate
                  </Label>
                  <div className="flex items-center gap-2 mt-1.5">
                    <Input
                      id="commission"
                      type="number"
                      min={0}
                      max={50}
                      step={0.5}
                      value={commissionRate}
                      onChange={(e) => setCommissionRate(parseFloat(e.target.value) || 0)}
                      className="w-24"
                    />
                    <span className="text-sm text-gray-500">%</span>
                  </div>
                </div>
                <div className="flex gap-2 mt-5">
                  {[10, 15, 20].map((rate) => (
                    <Button
                      key={rate}
                      variant={commissionRate === rate ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setCommissionRate(rate)}
                      className={commissionRate === rate ? 'bg-green-600 hover:bg-green-700' : ''}
                    >
                      {rate}%
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right: Summary (2 cols) */}
        <div className="lg:col-span-2">
          <div className="sticky top-6">
            <Card className="border-2 border-green-200 bg-gradient-to-b from-white to-green-50/30">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-green-600" />
                  Deal Summary
                </CardTitle>
                {customerName && (
                  <p className="text-sm text-gray-500">{customerName}</p>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                {!calculation ? (
                  <div className="text-center py-8">
                    <Package className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                    <p className="text-sm text-gray-400">
                      Select a generator to see pricing
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Equipment */}
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                        Equipment
                      </p>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">
                            {quantity}× {selectedProduct?.model}
                          </span>
                          <span>{formatCurrency(calculation.equipmentSubtotal)}</span>
                        </div>
                        {calculation.multiUnitDiscount > 0 && (
                          <div className="flex justify-between text-sm text-green-600">
                            <span className="flex items-center gap-1">
                              <TrendingDown className="h-3 w-3" />
                              Multi-unit discount (10%)
                            </span>
                            <span>-{formatCurrency(calculation.multiUnitDiscount)}</span>
                          </div>
                        )}
                        <div className="flex justify-between text-sm font-medium pt-1">
                          <span>Equipment total</span>
                          <span>{formatCurrency(calculation.equipmentTotal)}</span>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Installation */}
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                        Installation
                      </p>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">{calculation.installPackageName}</span>
                          <span>
                            {calculation.installBasePrice > 0
                              ? formatCurrency(calculation.installBasePrice)
                              : '—'}
                          </span>
                        </div>
                        {calculation.installBundleSavings > 0 && (
                          <div className="flex justify-between text-sm text-green-600">
                            <span className="flex items-center gap-1">
                              <TrendingDown className="h-3 w-3" />
                              Bundle savings
                            </span>
                            <span>-{formatCurrency(calculation.installBundleSavings)}</span>
                          </div>
                        )}
                        <div className="flex justify-between text-sm font-medium pt-1">
                          <span>Install total</span>
                          <span>
                            {calculation.installTotal > 0
                              ? formatCurrency(calculation.installTotal)
                              : '—'}
                          </span>
                        </div>
                        {calculation.monthlyFee > 0 && (
                          <p className="text-xs text-gray-400 pt-0.5">
                            + {formatCurrencyExact(calculation.monthlyFee)}/mo ongoing service
                          </p>
                        )}
                      </div>
                    </div>

                    <Separator />

                    {/* Savings */}
                    {calculation.totalSavings > 0 && (
                      <div className="flex items-center justify-between p-2.5 rounded-lg bg-green-50 border border-green-200">
                        <span className="text-sm font-medium text-green-700 flex items-center gap-1.5">
                          <Check className="h-4 w-4" />
                          Total Savings
                        </span>
                        <span className="font-bold text-green-700">
                          -{formatCurrency(calculation.totalSavings)}
                        </span>
                      </div>
                    )}

                    {/* Deal Total */}
                    <div className="p-4 rounded-lg bg-gray-900 text-white">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-300">Deal Total</span>
                        <span className="text-2xl font-bold">
                          {formatCurrency(calculation.dealTotal)}
                        </span>
                      </div>
                    </div>

                    {/* Commission */}
                    <div className="flex items-center justify-between text-sm p-2.5 rounded-lg bg-gray-50">
                      <span className="text-gray-500">
                        Commission ({commissionRate}%)
                      </span>
                      <span className="font-semibold text-gray-700">
                        {formatCurrencyExact(calculation.commissionAmount)}
                      </span>
                    </div>

                    {/* Action */}
                    <Button
                      onClick={handleCopySummary}
                      className="w-full bg-green-600 hover:bg-green-700 text-white gap-2"
                    >
                      <Copy className="h-4 w-4" />
                      Copy Deal Summary
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
