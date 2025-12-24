'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, ShieldCheck, CreditCard, Lock, ArrowLeft, AlertTriangle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Product {
  id: string;
  name: string;
  sku: string;
  priceNumeric: number;
  imageUrl: string;
}

interface ServicePackage {
  id: string;
  name: string;
  price: number;
  priceMonthly: number | null;
  prerequisites: string[];
  exclusions: string[];
  deliverables: string[];
}

interface CheckoutData {
  product: Product;
  servicePackage: ServicePackage | null;
}

export default function CheckoutPage() {
  const router = useRouter();
  const [checkoutData, setCheckoutData] = useState<CheckoutData | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  
  // Form data
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
  });

  // Prerequisite acknowledgments
  const [prerequisites, setPrerequisites] = useState<{ [key: string]: boolean }>({});
  const [allPrerequisitesChecked, setAllPrerequisitesChecked] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  useEffect(() => {
    // Retrieve checkout data from sessionStorage
    const data = sessionStorage.getItem('checkout_data');
    if (!data) {
      router.push('/products');
      return;
    }
    
    try {
      const parsedData: CheckoutData = JSON.parse(data);
      setCheckoutData(parsedData);
      
      // Initialize prerequisite checkboxes
      if (parsedData.servicePackage?.prerequisites) {
        const initialPrereqs: { [key: string]: boolean } = {};
        parsedData.servicePackage.prerequisites.forEach((_, index) => {
          initialPrereqs[`prereq_${index}`] = false;
        });
        setPrerequisites(initialPrereqs);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error parsing checkout data:', error);
      router.push('/products');
    }
  }, [router]);

  useEffect(() => {
    // Check if all prerequisites are acknowledged
    if (checkoutData?.servicePackage?.prerequisites) {
      const allChecked = Object.values(prerequisites).every(val => val === true);
      setAllPrerequisitesChecked(allChecked);
    } else {
      setAllPrerequisitesChecked(true); // No prerequisites needed
    }
  }, [prerequisites, checkoutData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePrerequisiteChange = (key: string, checked: boolean) => {
    setPrerequisites({
      ...prerequisites,
      [key]: checked
    });
  };

  const validateForm = () => {
    const required = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'state', 'zipCode'];
    for (const field of required) {
      if (!formData[field as keyof typeof formData]) {
        toast({
          title: 'Missing Information',
          description: `Please fill in your ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`,
          variant: 'destructive'
        });
        return false;
      }
    }
    
    if (!termsAccepted) {
      toast({
        title: 'Terms Required',
        description: 'Please accept the Terms of Service to continue',
        variant: 'destructive'
      });
      return false;
    }
    
    if (checkoutData?.servicePackage && !allPrerequisitesChecked) {
      toast({
        title: 'Prerequisites Required',
        description: 'Please acknowledge all prerequisites before proceeding',
        variant: 'destructive'
      });
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setProcessing(true);
    
    try {
      const orderData = {
        ...formData,
        product: checkoutData?.product,
        servicePackage: checkoutData?.servicePackage,
        prerequisitesAcknowledged: prerequisites,
        termsAccepted
      };
      
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });
      
      const result = await response.json();
      
      if (response.ok) {
        // Clear checkout data
        sessionStorage.removeItem('checkout_data');
        
        toast({
          title: 'Order Submitted!',
          description: 'Your order has been received. We\'ll contact you shortly.'
        });
        
        // Redirect to confirmation page or dashboard
        router.push(`/dashboard?order=${result.orderId}`);
      } else {
        throw new Error(result.error || 'Failed to submit order');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast({
        title: 'Order Failed',
        description: error instanceof Error ? error.message : 'Please try again or contact support',
        variant: 'destructive'
      });
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading checkout...</p>
        </div>
      </div>
    );
  }

  if (!checkoutData) {
    return null;
  }

  const totalPrice = checkoutData.product.priceNumeric + 
    (checkoutData.servicePackage?.price || 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Link href={`/products/${checkoutData.product.id}`} className="inline-flex items-center text-emerald-600 hover:text-emerald-700 mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Product
        </Link>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">Secure Checkout</h1>
        <p className="text-gray-600 mb-8">Complete your purchase with confidence</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Information */}
            <Card>
              <CardHeader>
                <CardTitle>Customer Information</CardTitle>
                <CardDescription>Please provide your contact details</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone *</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <Separator className="my-6" />

                  <div>
                    <Label htmlFor="address">Installation Address *</Label>
                    <Input
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Street address"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">State *</Label>
                      <Input
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        placeholder="e.g., OH"
                        maxLength={2}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="zipCode">ZIP Code *</Label>
                      <Input
                        id="zipCode"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Prerequisites (if service package selected) */}
            {checkoutData.servicePackage && checkoutData.servicePackage.prerequisites.length > 0 && (
              <Card className="border-amber-200 bg-amber-50">
                <CardHeader>
                  <CardTitle className="flex items-center text-amber-900">
                    <AlertTriangle className="h-5 w-5 mr-2" />
                    Prerequisites & Requirements
                  </CardTitle>
                  <CardDescription className="text-amber-800">
                    Please confirm you meet these requirements for {checkoutData.servicePackage.name}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {checkoutData.servicePackage.prerequisites.map((prereq, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <Checkbox
                          id={`prereq_${index}`}
                          checked={prerequisites[`prereq_${index}`] || false}
                          onCheckedChange={(checked) => 
                            handlePrerequisiteChange(`prereq_${index}`, checked as boolean)
                          }
                        />
                        <Label 
                          htmlFor={`prereq_${index}`}
                          className="text-sm text-gray-900 leading-relaxed cursor-pointer"
                        >
                          {prereq}
                        </Label>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Exclusions (if service package selected) */}
            {checkoutData.servicePackage && checkoutData.servicePackage.exclusions.length > 0 && (
              <Card className="border-red-200 bg-red-50">
                <CardHeader>
                  <CardTitle className="flex items-center text-red-900">
                    <AlertCircle className="h-5 w-5 mr-2" />
                    What's Not Included
                  </CardTitle>
                  <CardDescription className="text-red-800">
                    Please note these exclusions for {checkoutData.servicePackage.name}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {checkoutData.servicePackage.exclusions.map((exclusion, index) => (
                      <li key={index} className="flex items-start text-sm text-gray-900">
                        <span className="text-red-600 mr-2">•</span>
                        <span>{exclusion}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Terms & Conditions */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="terms"
                    checked={termsAccepted}
                    onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
                  />
                  <Label htmlFor="terms" className="text-sm text-gray-700 leading-relaxed cursor-pointer">
                    I agree to the{' '}
                    <Link href="/terms" target="_blank" className="text-emerald-600 hover:text-emerald-700 underline">
                      Terms of Service
                    </Link>
                    {' '}including refund policy, scope limits, dormancy clauses, and communication requirements *
                  </Label>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Product */}
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="relative w-20 h-20 bg-gray-100 rounded">
                      <Image
                        src={checkoutData.product.imageUrl}
                        alt={checkoutData.product.name}
                        fill
                        className="object-contain p-2"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{checkoutData.product.name}</p>
                      <p className="text-xs text-gray-600">SKU: {checkoutData.product.sku}</p>
                    </div>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Product:</span>
                    <span className="font-medium">${checkoutData.product.priceNumeric.toLocaleString()}</span>
                  </div>
                </div>

                {/* Service Package */}
                {checkoutData.servicePackage && (
                  <>
                    <Separator />
                    <div>
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-medium text-sm">{checkoutData.servicePackage.name}</p>
                          {checkoutData.servicePackage.priceMonthly && (
                            <Badge variant="outline" className="mt-1">
                              +${checkoutData.servicePackage.priceMonthly}/month
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Installation:</span>
                        <span className="font-medium text-emerald-600">
                          +${checkoutData.servicePackage.price.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </>
                )}

                <Separator />

                {/* Total */}
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-900">Total:</span>
                  <span className="text-2xl font-bold text-emerald-600">
                    ${totalPrice.toLocaleString()}
                  </span>
                </div>

                <Button
                  onClick={handleSubmit}
                  disabled={processing || !termsAccepted || (!!checkoutData.servicePackage && !allPrerequisitesChecked)}
                  className="w-full bg-gradient-to-r from-emerald-600 to-sky-600 hover:from-emerald-700 hover:to-sky-700 text-white"
                  size="lg"
                >
                  {processing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <Lock className="h-4 w-4 mr-2" />
                      Complete Order
                    </>
                  )}
                </Button>

                <div className="space-y-2 pt-4 border-t">
                  <div className="flex items-center text-xs text-gray-600">
                    <ShieldCheck className="h-4 w-4 mr-2 text-emerald-600" />
                    <span>Secure checkout protected by SSL</span>
                  </div>
                  <div className="flex items-center text-xs text-gray-600">
                    <CreditCard className="h-4 w-4 mr-2 text-emerald-600" />
                    <span>100% refund within 24 hours</span>
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