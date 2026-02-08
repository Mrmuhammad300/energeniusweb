'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Battery, Zap, Box, Shield, Clock, Plus, Check, Power, RefreshCw, Globe, Layers, Gauge, ChevronDown } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface Product {
  id: string;
  model: string;
  sku: string;
  description: string;
  specifications: any;
  features: string[];
  priceNumeric: number;
  wattageNumeric: number;
  imageUrl: string;
  tier: string;
  application: string[];
  warranty: string;
}

interface ServicePackage {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  bundlePrice: number | null;
  priceMonthly: number | null;
  deliverables: string[];
  exclusions: string[];
  prerequisites: string[];
  warrantyInfo: string;
  estimatedTimeline: string;
  category: string;
  isPopular: boolean;
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [servicePackages, setServicePackages] = useState<ServicePackage[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState<number>(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch product details
        const productRes = await fetch('/api/products');
        const products = await productRes.json();
        const currentProduct = products.find((p: Product) => p.id === params.id);
        
        if (!currentProduct) {
          router.push('/products');
          return;
        }
        
        setProduct(currentProduct);
        
        // Determine category based on product application
        const applicationArray = Array.isArray(currentProduct.application) 
          ? currentProduct.application 
          : [currentProduct.application];
        const category = applicationArray.some((app: string) => app?.toLowerCase().includes('commercial'))
          ? 'commercial' 
          : 'residential';
        
        // Fetch relevant service packages
        const servicesRes = await fetch(`/api/services?category=${category}`);
        const services = await servicesRes.json();
        setServicePackages(services);
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };
    
    fetchData();
  }, [params.id, router]);

  // Bundle discount for 20K+ generators when purchasing multiple units
  const MULTI_UNIT_DISCOUNT_THRESHOLD = 20000; // 20kW
  const MULTI_UNIT_DISCOUNT_PERCENT = 10; // 10% discount per unit for multi-unit orders
  
  const qualifiesForMultiUnitDiscount = product ? product.wattageNumeric >= MULTI_UNIT_DISCOUNT_THRESHOLD : false;
  const multiUnitDiscountRate = quantity > 1 && qualifiesForMultiUnitDiscount ? MULTI_UNIT_DISCOUNT_PERCENT / 100 : 0;
  
  const handleAddToCart = () => {
    if (!selectedPackage || !product) {
      alert('Please select an installation package');
      return;
    }
    
    const pkg = servicePackages.find(pkg => pkg.id === selectedPackage);
    const qualifies = product.wattageNumeric >= 5000;
    // Peace of Mind is excluded from bundle discounts for differentiation
    const pkgIsPeaceOfMind = pkg?.slug === 'peace-of-mind' || 
      pkg?.name?.toLowerCase().includes('peace of mind');
    const pkgEligibleForBundle = qualifies && !pkgIsPeaceOfMind;
    const effectivePrice = pkgEligibleForBundle && pkg?.bundlePrice ? pkg.bundlePrice : pkg?.price;
    
    // Calculate multi-unit discount for 20K+ generators
    const baseProductTotal = product.priceNumeric * quantity;
    const multiUnitDiscount = qualifiesForMultiUnitDiscount && quantity > 1 
      ? Math.round(baseProductTotal * multiUnitDiscountRate) 
      : 0;
    const discountedProductTotal = baseProductTotal - multiUnitDiscount;
    
    // Store selection in sessionStorage for checkout with bundle pricing info
    sessionStorage.setItem('checkout_data', JSON.stringify({
      product: {
        ...product,
        quantity: quantity,
        unitPrice: product.priceNumeric,
        multiUnitDiscount: multiUnitDiscount,
        discountedTotal: discountedProductTotal,
        qualifiesForMultiUnitDiscount: qualifiesForMultiUnitDiscount,
        multiUnitDiscountPercent: quantity > 1 && qualifiesForMultiUnitDiscount ? MULTI_UNIT_DISCOUNT_PERCENT : 0,
        wattageNumeric: product.wattageNumeric,
        application: product.application
      },
      servicePackage: pkg ? {
        ...pkg,
        effectivePrice: effectivePrice, // The actual price to charge
        originalPrice: pkg.price,        // For display purposes
        isBundlePrice: pkgEligibleForBundle && pkg.bundlePrice !== null,
        bundleSavings: pkgEligibleForBundle && pkg.bundlePrice ? pkg.price - pkg.bundlePrice : 0
      } : null
    }));
    
    router.push('/checkout');
  };

  const handleProductOnly = () => {
    if (!product) return;
    
    // Calculate multi-unit discount for 20K+ generators
    const baseProductTotal = product.priceNumeric * quantity;
    const multiUnitDiscount = qualifiesForMultiUnitDiscount && quantity > 1 
      ? Math.round(baseProductTotal * multiUnitDiscountRate) 
      : 0;
    const discountedProductTotal = baseProductTotal - multiUnitDiscount;
    
    sessionStorage.setItem('checkout_data', JSON.stringify({
      product: {
        ...product,
        quantity: quantity,
        unitPrice: product.priceNumeric,
        multiUnitDiscount: multiUnitDiscount,
        discountedTotal: discountedProductTotal,
        qualifiesForMultiUnitDiscount: qualifiesForMultiUnitDiscount,
        multiUnitDiscountPercent: quantity > 1 && qualifiesForMultiUnitDiscount ? MULTI_UNIT_DISCOUNT_PERCENT : 0,
        wattageNumeric: product.wattageNumeric,
        application: product.application
      },
      servicePackage: null
    }));
    
    router.push('/checkout');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  // Check if product qualifies for bundle pricing (5,000W+)
  const qualifiesForBundle = product.wattageNumeric >= 5000;
  
  // Get the selected package and determine price
  // Note: "Peace of Mind" package is excluded from bundle discounts for differentiation
  const selectedPkg = servicePackages.find(pkg => pkg.id === selectedPackage);
  const isPeaceOfMind = selectedPkg?.slug === 'peace-of-mind' || 
    selectedPkg?.name?.toLowerCase().includes('peace of mind');
  const eligibleForBundleDiscount = qualifiesForBundle && !isPeaceOfMind;
  
  const installationPrice = selectedPkg 
    ? (eligibleForBundleDiscount && selectedPkg.bundlePrice ? selectedPkg.bundlePrice : selectedPkg.price)
    : 0;
  const originalInstallationPrice = selectedPkg?.price || 0;
  const bundleSavings = eligibleForBundleDiscount && selectedPkg?.bundlePrice 
    ? selectedPkg.price - selectedPkg.bundlePrice 
    : 0;

  // Calculate multi-unit pricing for display
  const baseProductTotal = product.priceNumeric * quantity;
  const currentMultiUnitDiscount = qualifiesForMultiUnitDiscount && quantity > 1 
    ? Math.round(baseProductTotal * multiUnitDiscountRate) 
    : 0;
  const discountedProductTotal = baseProductTotal - currentMultiUnitDiscount;

  const totalPrice = selectedPackage 
    ? discountedProductTotal + installationPrice
    : discountedProductTotal;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Back button */}
        <Link href="/products" className="inline-flex items-center text-emerald-600 hover:text-emerald-700 mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Products
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Image & Info */}
          <div>
            <Card>
              <CardContent className="p-6">
                <div className="relative aspect-video mb-4 bg-gray-100 rounded-lg overflow-hidden">
                  <Image
                    src={product.imageUrl}
                    alt={product.model}
                    fill
                    className="object-contain p-4"
                  />
                </div>
                
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.model}</h1>
                    <p className="text-sm text-gray-600 mb-2">SKU: {product.sku}</p>
                    <Badge variant="outline" className="mb-4">{product.tier}</Badge>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Product Price</p>
                    <p className="text-3xl font-bold text-emerald-600">
                      ${product.priceNumeric.toLocaleString()}
                    </p>
                  </div>
                </div>

                <Separator className="my-6" />

                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                    <p className="text-gray-700 leading-relaxed">{product.description}</p>
                  </div>

                  {product.features && product.features.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Key Features</h3>
                      <ul className="space-y-2">
                        {product.features.slice(0, 8).map((feature, index) => (
                          <li key={index} className="flex items-start text-sm text-gray-700">
                            <Check className="h-4 w-4 text-emerald-600 mr-2 mt-0.5 flex-shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {product.specifications && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Specifications</h3>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        {product.specifications.wattage && (
                          <div className="flex items-center">
                            <Zap className="h-4 w-4 text-amber-500 mr-2" />
                            <div>
                              <p className="text-gray-600">Power</p>
                              <p className="font-medium">{product.specifications.wattage}</p>
                            </div>
                          </div>
                        )}
                        {product.specifications.batteryCapacity && (
                          <div className="flex items-center">
                            <Battery className="h-4 w-4 text-emerald-600 mr-2" />
                            <div>
                              <p className="text-gray-600">Capacity</p>
                              <p className="font-medium">{product.specifications.batteryCapacity}</p>
                            </div>
                          </div>
                        )}
                        {product.specifications.weight && (
                          <div className="flex items-center">
                            <Box className="h-4 w-4 text-blue-600 mr-2" />
                            <div>
                              <p className="text-gray-600">Weight</p>
                              <p className="font-medium">{product.specifications.weight}</p>
                            </div>
                          </div>
                        )}
                        {product.warranty && (
                          <div className="flex items-center">
                            <Shield className="h-4 w-4 text-purple-600 mr-2" />
                            <div>
                              <p className="text-gray-600">Warranty</p>
                              <p className="font-medium">{product.warranty}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Power System Capabilities */}
                  <div className="pt-4 border-t border-gray-200">
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                      <Power className="h-5 w-5 text-emerald-600 mr-2" />
                      Power System Capabilities
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <Gauge className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-gray-900">Continuous Power Architecture</p>
                          <p className="text-sm text-gray-600">Built for sustained operation rather than short-term emergency runtime.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <RefreshCw className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-gray-900">Black Start Capability</p>
                          <p className="text-sm text-gray-600">Restarts independently from zero power without reliance on the utility grid.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Globe className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-gray-900">Off-Grid Ready Design</p>
                          <p className="text-sm text-gray-600">Operates independently when paired with renewable inputs and balance-of-system components.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Layers className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-gray-900">Expandable Energy Ecosystem</p>
                          <p className="text-sm text-gray-600">Supports additional generation, storage, and system scaling as demand increases.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Zap className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-gray-900">Load-Driven Runtime</p>
                          <p className="text-sm text-gray-600">Power availability is governed by energy generation and consumption, not fixed-hour limits.</p>
                        </div>
                      </div>
                    </div>

                    {/* Technical FAQ */}
                    <Accordion type="single" collapsible className="mt-4">
                      <AccordionItem value="runtime-faq" className="border rounded-lg bg-slate-50">
                        <AccordionTrigger className="px-4 text-sm font-medium hover:no-underline">
                          Is this system limited to 48–72 hours of power?
                        </AccordionTrigger>
                        <AccordionContent className="px-4 pb-4 text-sm text-gray-700">
                          <p className="mb-2"><strong>No.</strong></p>
                          <p className="mb-2">
                            EnerGenius systems are not designed around fixed runtime windows. Operating duration depends on 
                            system configuration, connected energy sources, storage capacity, and load management.
                          </p>
                          <p>
                            With proper design, these systems support extended or continuous operation in off-grid or 
                            grid-independent environments.
                          </p>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>

                    {/* Simple Explainer */}
                    <div className="mt-4 p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                      <p className="text-sm text-emerald-800 italic">
                        Think of EnerGenius less like a battery and more like a self-sustaining power plant. 
                        Power continues as long as energy is being generated and managed — not until a timer runs out.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Installation Package Selection */}
          <div className="space-y-6">
            <Card className="border-2 border-emerald-200">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Plus className="h-5 w-5 mr-2 text-emerald-600" />
                  Add Installation Package
                </CardTitle>
                <CardDescription>
                  Choose a professional installation package or purchase the product only
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Quantity Selector for 20K+ Generators */}
                  {qualifiesForMultiUnitDiscount && (
                    <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-4 mb-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-gray-900 flex items-center">
                            <Layers className="h-4 w-4 mr-2 text-amber-600" />
                            Multi-Unit Deployment
                          </h4>
                          <p className="text-sm text-amber-800">
                            Purchase multiple units for full deployment coverage
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-gray-700">
                          Quantity:
                        </label>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            className="h-8 w-8 p-0"
                            disabled={quantity <= 1}
                          >
                            -
                          </Button>
                          <span className="w-12 text-center font-bold text-lg">{quantity}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setQuantity(Math.min(10, quantity + 1))}
                            className="h-8 w-8 p-0"
                            disabled={quantity >= 10}
                          >
                            +
                          </Button>
                        </div>
                      </div>
                      
                      {quantity > 1 && (
                        <div className="mt-3 p-2 bg-emerald-100 rounded border border-emerald-300">
                          <p className="text-sm text-emerald-800 font-medium text-center">
                            🎉 <span className="font-bold">10% Multi-Unit Discount</span> applied! 
                            Save ${currentMultiUnitDiscount.toLocaleString()} on your order
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Installation Package (Optional)
                    </label>
                    <Select value={selectedPackage} onValueChange={setSelectedPackage}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Choose an installation package..." />
                      </SelectTrigger>
                      <SelectContent>
                        {servicePackages.length === 0 ? (
                          <div className="px-4 py-6 text-center text-gray-500 text-sm">
                            No installation packages available
                          </div>
                        ) : (
                          servicePackages.map((pkg) => (
                            <SelectItem key={pkg.id} value={pkg.id}>
                              {pkg.name} - {qualifiesForBundle && pkg.bundlePrice ? (
                                <span>
                                  <span className="line-through text-gray-400">${pkg.price.toLocaleString()}</span>
                                  {' '}
                                  <span className="text-emerald-600 font-semibold">${pkg.bundlePrice.toLocaleString()}</span>
                                </span>
                              ) : (
                                <span>${pkg.price.toLocaleString()}</span>
                              )}
                              {pkg.isPopular ? ' ⭐ Most Popular' : ''}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedPackage && (
                    <Card className="bg-emerald-50 border-emerald-200">
                      <CardContent className="p-4">
                        {(() => {
                          const pkg = servicePackages.find(p => p.id === selectedPackage);
                          if (!pkg) return null;
                          
                          return (
                            <div className="space-y-3">
                              <div>
                                <h4 className="font-semibold text-gray-900 mb-1">{pkg.name}</h4>
                                <p className="text-sm text-gray-700">{pkg.description}</p>
                              </div>

                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                  <p className="text-gray-600 flex items-center">
                                    <Check className="h-3 w-3 mr-1 text-emerald-600" />
                                    Warranty
                                  </p>
                                  <p className="font-medium">{pkg.warrantyInfo}</p>
                                </div>
                                <div>
                                  <p className="text-gray-600 flex items-center">
                                    <Clock className="h-3 w-3 mr-1 text-emerald-600" />
                                    Timeline
                                  </p>
                                  <p className="font-medium">{pkg.estimatedTimeline}</p>
                                </div>
                              </div>

                              {pkg.deliverables && pkg.deliverables.length > 0 && (
                                <div>
                                  <p className="text-sm font-medium text-gray-900 mb-1">Includes:</p>
                                  <ul className="text-sm space-y-1">
                                    {pkg.deliverables.slice(0, 4).map((item, idx) => (
                                      <li key={idx} className="flex items-start text-gray-700">
                                        <Check className="h-3 w-3 text-emerald-600 mr-1 mt-0.5 flex-shrink-0" />
                                        <span>{item}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}

                              {pkg.priceMonthly && (
                                <div className="pt-2 border-t border-emerald-300">
                                  <p className="text-sm text-gray-700">
                                    Plus ${pkg.priceMonthly}/month subscription
                                  </p>
                                </div>
                              )}
                            </div>
                          );
                        })()}
                      </CardContent>
                    </Card>
                  )}

                  <Separator />

                  {/* Bundle Savings Banner - only for eligible packages (not Peace of Mind) */}
                  {qualifiesForBundle && eligibleForBundleDiscount && selectedPkg?.bundlePrice && (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-center">
                      <p className="text-amber-800 text-sm font-medium">
                        🎉 <span className="font-bold">Bundle Discount Applied!</span> This 5kW+ unit qualifies for reduced installation pricing.
                      </p>
                    </div>
                  )}
                  
                  {/* Peace of Mind Premium Value Message */}
                  {qualifiesForBundle && isPeaceOfMind && (
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 text-center">
                      <p className="text-purple-800 text-sm font-medium">
                        ✨ <span className="font-bold">Premium Peace of Mind Package</span> - Includes lifetime annual service & proactive monitoring
                      </p>
                    </div>
                  )}
                  
                  {/* SmartConnect 3-Month Free Promo */}
                  {qualifiesForBundle && selectedPkg && (selectedPkg.slug === 'full-deployment' || selectedPkg.name?.toLowerCase().includes('full deployment')) && selectedPkg.priceMonthly && (
                    <div className="bg-gradient-to-r from-emerald-50 to-sky-50 border border-emerald-300 rounded-lg p-3 text-center">
                      <p className="text-emerald-800 text-sm font-medium">
                        🎁 <span className="font-bold">SmartConnect FREE for 3 Months!</span>
                      </p>
                      <p className="text-xs text-emerald-700 mt-1">
                        Full Deployment + Commercial Generator = ${(selectedPkg.priceMonthly * 3).toLocaleString()} value included FREE
                      </p>
                    </div>
                  )}

                  <div className="space-y-2">
                    {/* Unit Price */}
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        {quantity > 1 ? `Unit Price (×${quantity}):` : 'Product:'}
                      </span>
                      <span className="font-medium">
                        ${quantity > 1 
                          ? `${product.priceNumeric.toLocaleString()} × ${quantity} = $${baseProductTotal.toLocaleString()}`
                          : product.priceNumeric.toLocaleString()
                        }
                      </span>
                    </div>
                    
                    {/* Multi-Unit Discount for 20K+ */}
                    {currentMultiUnitDiscount > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-amber-600 font-medium">Multi-Unit Discount (10%):</span>
                        <span className="font-bold text-amber-600">-${currentMultiUnitDiscount.toLocaleString()}</span>
                      </div>
                    )}
                    
                    {/* Subtotal after multi-unit discount */}
                    {currentMultiUnitDiscount > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Product Subtotal:</span>
                        <span className="font-medium">${discountedProductTotal.toLocaleString()}</span>
                      </div>
                    )}

                    {selectedPackage && (
                      <>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Installation:</span>
                          {bundleSavings > 0 ? (
                            <div className="text-right">
                              <span className="text-gray-400 line-through text-xs">${originalInstallationPrice.toLocaleString()}</span>
                              <span className="font-medium text-emerald-600 ml-2">
                                +${installationPrice.toLocaleString()}
                              </span>
                            </div>
                          ) : (
                            <span className="font-medium text-emerald-600">
                              +${installationPrice.toLocaleString()}
                            </span>
                          )}
                        </div>
                        {bundleSavings > 0 && (
                          <div className="flex justify-between text-sm">
                            <span className="text-emerald-600 font-medium">Install Bundle Savings:</span>
                            <span className="font-bold text-emerald-600">-${bundleSavings.toLocaleString()}</span>
                          </div>
                        )}
                      </>
                    )}
                    <Separator />
                    <div className="flex justify-between">
                      <span className="font-semibold text-gray-900">Total:</span>
                      <span className="text-2xl font-bold text-emerald-600">
                        ${totalPrice.toLocaleString()}
                      </span>
                    </div>
                    
                    {/* Total Savings Summary */}
                    {(currentMultiUnitDiscount > 0 || bundleSavings > 0) && (
                      <div className="bg-emerald-50 rounded p-2 text-center">
                        <p className="text-sm text-emerald-700 font-medium">
                          Total Savings: ${(currentMultiUnitDiscount + bundleSavings).toLocaleString()}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3 pt-4">
                    <Button 
                      onClick={handleAddToCart} 
                      className="w-full bg-gradient-to-r from-emerald-600 to-sky-600 hover:from-emerald-700 hover:to-sky-700 text-white"
                      size="lg"
                    >
                      Proceed to Checkout
                    </Button>
                    
                    <Button 
                      onClick={handleProductOnly} 
                      variant="outline" 
                      className="w-full"
                      size="lg"
                    >
                      Product Only (No Installation)
                    </Button>
                  </div>

                  <p className="text-xs text-gray-600 text-center">
                    100% refund available within 24 hours of purchase
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Trust Signals */}
            <Card>
              <CardContent className="p-4">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <Power className="h-6 w-6 text-emerald-600 mx-auto mb-2" />
                    <p className="text-sm font-medium">Continuous Power</p>
                  </div>
                  <div>
                    <RefreshCw className="h-6 w-6 text-emerald-600 mx-auto mb-2" />
                    <p className="text-sm font-medium">Black Start Capable</p>
                  </div>
                  <div>
                    <Globe className="h-6 w-6 text-emerald-600 mx-auto mb-2" />
                    <p className="text-sm font-medium">Off-Grid Ready</p>
                  </div>
                  <div>
                    <Shield className="h-6 w-6 text-emerald-600 mx-auto mb-2" />
                    <p className="text-sm font-medium">5-Year Warranty</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}