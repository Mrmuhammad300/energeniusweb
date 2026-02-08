'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, ShieldCheck, CreditCard, Lock, ArrowLeft, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

// Initialize Stripe with better error handling
const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
console.log('[Checkout] Stripe publishable key exists:', !!publishableKey);

if (!publishableKey) {
  console.error('[Checkout] NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not defined');
}

const stripePromise = publishableKey ? loadStripe(publishableKey) : null;

interface Product {
  id: string;
  model: string;
  sku: string;
  priceNumeric: number;
  imageUrl: string;
  wattageNumeric?: number;
  application?: string[];
  // Multi-unit purchase fields
  quantity?: number;
  unitPrice?: number;
  multiUnitDiscount?: number;
  discountedTotal?: number;
  qualifiesForMultiUnitDiscount?: boolean;
  multiUnitDiscountPercent?: number;
}

interface ServicePackage {
  id: string;
  name: string;
  slug?: string;
  price: number;
  priceMonthly: number | null;
  prerequisites: string[];
  exclusions: string[];
  deliverables: string[];
  category?: string;
  // Bundle pricing fields (added by product page for 5kW+ products)
  effectivePrice?: number;
  originalPrice?: number;
  isBundlePrice?: boolean;
  bundleSavings?: number;
}

interface CheckoutData {
  product: Product;
  servicePackage: ServicePackage | null;
}

// Payment Form Component
function PaymentForm({ 
  totalAmount, 
  customerEmail, 
  customerName,
  onSuccess 
}: { 
  totalAmount: number;
  customerEmail: string;
  customerName: string;
  onSuccess: (paymentIntentId: string) => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    console.log('[PaymentForm] Component mounted');
    console.log('[PaymentForm] Stripe initialized:', !!stripe);
    console.log('[PaymentForm] Elements initialized:', !!elements);
  }, [stripe, elements]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('[PaymentForm] Form submitted');

    if (!stripe || !elements) {
      console.log('[PaymentForm] Stripe or Elements not ready');
      toast({
        title: 'Payment System Loading',
        description: 'Please wait for the payment system to initialize.',
        variant: 'default'
      });
      return;
    }

    setProcessing(true);
    console.log('[PaymentForm] Processing payment...');

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: window.location.origin + '/checkout',
        },
        redirect: 'if_required',
      });

      console.log('[PaymentForm] Payment result:', { error, paymentIntent: paymentIntent?.status });

      if (error) {
        console.error('[PaymentForm] Payment error:', error);
        toast({
          title: 'Payment Failed',
          description: error.message,
          variant: 'destructive'
        });
        setProcessing(false);
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        console.log('[PaymentForm] Payment succeeded');
        onSuccess(paymentIntent.id);
      }
    } catch (error) {
      console.error('[PaymentForm] Payment exception:', error);
      toast({
        title: 'Payment Failed',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive'
      });
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      
      <Button
        type="submit"
        disabled={!stripe || processing}
        className="w-full bg-gradient-to-r from-emerald-600 to-sky-600 hover:from-emerald-700 hover:to-sky-700 text-white"
        size="lg"
      >
        {processing ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            Processing Payment...
          </>
        ) : (
          <>
            <Lock className="h-4 w-4 mr-2" />
            Pay ${totalAmount.toLocaleString()}
          </>
        )}
      </Button>
    </form>
  );
}

export default function CheckoutPage() {
  const router = useRouter();
  const [checkoutData, setCheckoutData] = useState<CheckoutData | null>(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState<'info' | 'payment' | 'success'>('info');
  const [orderId, setOrderId] = useState<string>('');
  const [clientSecret, setClientSecret] = useState<string>('');
  
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

  const proceedToPayment = async () => {
    console.log('[Checkout] proceedToPayment called');
    
    if (!validateForm()) {
      console.log('[Checkout] Form validation failed');
      return;
    }

    setLoading(true);
    console.log('[Checkout] Creating payment intent...');

    try {
      // Use effectivePrice if available (for bundle pricing), otherwise fall back to price
      const installationPrice = checkoutData!.servicePackage?.effectivePrice ?? checkoutData!.servicePackage?.price ?? 0;
      const totalPrice = checkoutData!.product.priceNumeric + installationPrice;

      console.log('[Checkout] Total price:', totalPrice);
      console.log('[Checkout] Customer email:', formData.email);

      // Create payment intent
      const paymentResponse = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: totalPrice,
          customerEmail: formData.email,
          customerName: `${formData.firstName} ${formData.lastName}`,
        })
      });

      console.log('[Checkout] Payment response status:', paymentResponse.status);
      const paymentData = await paymentResponse.json();
      console.log('[Checkout] Payment data:', paymentData);

      if (paymentResponse.ok) {
        console.log('[Checkout] Setting client secret and moving to payment step');
        setClientSecret(paymentData.clientSecret);
        setStep('payment');
      } else {
        throw new Error(paymentData.error || 'Failed to initialize payment');
      }
    } catch (error) {
      console.error('[Checkout] Payment initialization error:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to initialize payment',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = async (paymentIntentId: string) => {
    setLoading(true);

    try {
      const orderData = {
        ...formData,
        product: checkoutData?.product,
        servicePackage: checkoutData?.servicePackage,
        prerequisitesAcknowledged: prerequisites,
        termsAccepted,
        paymentIntentId
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
        setOrderId(result.orderNumber);
        setStep('success');
        
        // Redirect to dashboard after 3 seconds
        setTimeout(() => {
          router.push('/dashboard');
        }, 3000);
      } else {
        throw new Error(result.error || 'Failed to create order');
      }
    } catch (error) {
      console.error('Order creation error:', error);
      toast({
        title: 'Order Failed',
        description: error instanceof Error ? error.message : 'Please contact support',
        variant: 'destructive'
      });
      setLoading(false);
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

  // Calculate product total (with quantity and multi-unit discount if applicable)
  const quantity = checkoutData.product.quantity || 1;
  const unitPrice = checkoutData.product.unitPrice || checkoutData.product.priceNumeric;
  const baseProductTotal = unitPrice * quantity;
  const multiUnitDiscount = checkoutData.product.multiUnitDiscount || 0;
  const productTotal = checkoutData.product.discountedTotal || (baseProductTotal - multiUnitDiscount);
  
  // Use effectivePrice if available (for bundle pricing), otherwise fall back to price
  // Note: Peace of Mind package is excluded from bundle discounts (isBundlePrice will be false)
  const servicePrice = checkoutData.servicePackage?.effectivePrice ?? checkoutData.servicePackage?.price ?? 0;
  const bundleSavings = checkoutData.servicePackage?.bundleSavings ?? 0;
  const isPeaceOfMindPackage = checkoutData.servicePackage?.slug === 'peace-of-mind' || 
    checkoutData.servicePackage?.name?.toLowerCase().includes('peace of mind');
  
  // Check if eligible for SmartConnect Pro 3-month free promo
  // Commercial generators + Full Deployment installation = SmartConnect Pro free for 3 months
  const isCommercialGenerator = checkoutData.product.wattageNumeric && checkoutData.product.wattageNumeric >= 5000;
  const isFullDeployment = checkoutData.servicePackage?.slug === 'full-deployment' || 
    checkoutData.servicePackage?.name?.toLowerCase().includes('full deployment');
  const qualifiesForSmartConnectPromo = isCommercialGenerator && isFullDeployment;
  // SmartConnect Pro plan is $19.99/mo (changed from Business $49.99/mo)
  const smartConnectMonthlyValue = 19.99;
  const smartConnectPromoValue = qualifiesForSmartConnectPromo ? smartConnectMonthlyValue * 3 : 0;
  
  const totalPrice = productTotal + servicePrice;
  const totalSavings = multiUnitDiscount + bundleSavings + smartConnectPromoValue;

  // Success step
  if (step === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          <Card className="border-2 border-emerald-500">
            <CardContent className="p-12 text-center">
              <div className="mb-6">
                <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="h-12 w-12 text-emerald-600" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Thank You for Your Purchase!
                </h1>
                <p className="text-lg text-gray-600 mb-4">
                  Your order has been successfully placed
                </p>
                {orderId && (
                  <Badge className="bg-emerald-600 text-white text-lg px-4 py-2">
                    Order #{orderId}
                  </Badge>
                )}
              </div>

              <Separator className="my-6" />

              <div className="space-y-4 text-left">
                <p className="text-gray-700">
                  <strong>What's Next:</strong>
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span>You'll receive an order confirmation email shortly</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Our team will contact you within 24 hours to coordinate delivery/installation</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Monitor your system with Smart Connect dashboard</span>
                  </li>
                </ul>
              </div>

              <div className="mt-8">
                <p className="text-sm text-gray-600 mb-4">
                  Redirecting to Smart Connect dashboard in 3 seconds...
                </p>
                <Button
                  onClick={() => router.push('/dashboard')}
                  className="bg-gradient-to-r from-emerald-600 to-sky-600 hover:from-emerald-700 hover:to-sky-700 text-white"
                  size="lg"
                >
                  Go to Dashboard Now
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Link href={`/products/${checkoutData.product.id}`} className="inline-flex items-center text-emerald-600 hover:text-emerald-700 mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Product
        </Link>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">Secure Checkout</h1>
        <p className="text-gray-600 mb-8">
          {step === 'info' ? 'Complete your information' : 'Enter payment details'}
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {step === 'info' ? (
              <>
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

                {/* Prerequisites */}
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

                {/* Exclusions */}
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

                {/* Terms */}
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
              </>
            ) : (
              // Payment Step
              <Card>
                <CardHeader>
                  <CardTitle>Payment Information</CardTitle>
                  <CardDescription>Enter your card details to complete the purchase</CardDescription>
                </CardHeader>
                <CardContent>
                  {!clientSecret ? (
                    <div className="flex flex-col items-center justify-center py-8 space-y-4">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
                      <p className="text-gray-600">Initializing secure payment...</p>
                    </div>
                  ) : !stripePromise ? (
                    <div className="flex flex-col items-center justify-center py-8 space-y-4">
                      <AlertCircle className="h-12 w-12 text-red-600" />
                      <p className="text-red-600 font-medium">Payment system unavailable</p>
                      <p className="text-sm text-gray-600">Please contact support if this issue persists.</p>
                    </div>
                  ) : (
                    <Elements stripe={stripePromise} options={{ clientSecret }}>
                      <PaymentForm
                        totalAmount={totalPrice}
                        customerEmail={formData.email}
                        customerName={`${formData.firstName} ${formData.lastName}`}
                        onSuccess={handlePaymentSuccess}
                      />
                    </Elements>
                  )}
                </CardContent>
              </Card>
            )}
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
                        alt={checkoutData.product.model}
                        fill
                        className="object-contain p-2"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{checkoutData.product.model}</p>
                      <p className="text-xs text-gray-600">SKU: {checkoutData.product.sku}</p>
                      {quantity > 1 && (
                        <Badge variant="secondary" className="mt-1">
                          Qty: {quantity}
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  {/* Product Pricing */}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {quantity > 1 ? `Unit Price (×${quantity}):` : 'Product:'}
                    </span>
                    <span className="font-medium">
                      {quantity > 1 
                        ? `$${unitPrice.toLocaleString()} × ${quantity}`
                        : `$${unitPrice.toLocaleString()}`
                      }
                    </span>
                  </div>
                  
                  {quantity > 1 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal:</span>
                      <span className="font-medium">${baseProductTotal.toLocaleString()}</span>
                    </div>
                  )}
                  
                  {/* Multi-Unit Discount */}
                  {multiUnitDiscount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-amber-600 font-medium">Multi-Unit Discount (10%):</span>
                      <span className="font-bold text-amber-600">-${multiUnitDiscount.toLocaleString()}</span>
                    </div>
                  )}
                  
                  {multiUnitDiscount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Product Total:</span>
                      <span className="font-medium">${productTotal.toLocaleString()}</span>
                    </div>
                  )}
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
                            <div className="mt-1">
                              {qualifiesForSmartConnectPromo ? (
                                <Badge className="bg-gradient-to-r from-emerald-500 to-sky-500 text-white">
                                  🎁 SmartConnect Pro FREE for 3 months!
                                </Badge>
                              ) : (
                                <Badge variant="outline">
                                  +${checkoutData.servicePackage.priceMonthly}/month
                                </Badge>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Installation:</span>
                        {bundleSavings > 0 ? (
                          <div className="text-right">
                            <span className="text-gray-400 line-through text-xs">${checkoutData.servicePackage.originalPrice?.toLocaleString() || checkoutData.servicePackage.price.toLocaleString()}</span>
                            <span className="font-medium text-emerald-600 ml-2">
                              +${servicePrice.toLocaleString()}
                            </span>
                          </div>
                        ) : (
                          <span className="font-medium text-emerald-600">
                            +${servicePrice.toLocaleString()}
                          </span>
                        )}
                      </div>
                      {bundleSavings > 0 && (
                        <div className="flex justify-between text-sm mt-1">
                          <span className="text-emerald-600 font-medium">Install Bundle Savings:</span>
                          <span className="font-bold text-emerald-600">-${bundleSavings.toLocaleString()}</span>
                        </div>
                      )}
                      
                      {/* Peace of Mind Premium Value Banner */}
                      {isPeaceOfMindPackage && (
                        <div className="mt-2 p-2 bg-purple-50 rounded border border-purple-200">
                          <p className="text-xs text-purple-800">
                            <strong>✨ Premium Package:</strong> Lifetime annual service & proactive dealer monitoring included
                          </p>
                        </div>
                      )}
                      
                      {/* SmartConnect Pro Promo Details */}
                      {qualifiesForSmartConnectPromo && smartConnectMonthlyValue > 0 && (
                        <div className="mt-2 p-2 bg-emerald-50 rounded border border-emerald-200">
                          <p className="text-xs text-emerald-800">
                            <strong>SmartConnect Pro:</strong> ${smartConnectMonthlyValue}/mo × 3 months = 
                            <span className="font-bold"> ${smartConnectPromoValue} value FREE!</span>
                          </p>
                        </div>
                      )}
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
                
                {/* Total Savings Summary */}
                {totalSavings > 0 && (
                  <div className="bg-gradient-to-r from-emerald-50 to-amber-50 rounded-lg p-3 border border-emerald-200">
                    <p className="text-sm text-emerald-800 font-semibold text-center">
                      🎉 Total Savings: ${totalSavings.toLocaleString()}
                    </p>
                    <div className="mt-1 text-xs text-gray-600 text-center space-y-0.5">
                      {multiUnitDiscount > 0 && <p>Multi-Unit: -${multiUnitDiscount.toLocaleString()}</p>}
                      {bundleSavings > 0 && <p>Bundle: -${bundleSavings.toLocaleString()}</p>}
                      {smartConnectPromoValue > 0 && <p>SmartConnect Pro (3mo): ${smartConnectPromoValue.toFixed(2)} value</p>}
                    </div>
                  </div>
                )}

                {step === 'info' && (
                  <Button
                    onClick={proceedToPayment}
                    disabled={loading || !termsAccepted || (!!checkoutData.servicePackage && !allPrerequisitesChecked)}
                    className="w-full bg-gradient-to-r from-emerald-600 to-sky-600 hover:from-emerald-700 hover:to-sky-700 text-white"
                    size="lg"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Please wait...
                      </>
                    ) : (
                      <>
                        <CreditCard className="h-4 w-4 mr-2" />
                        Proceed to Payment
                      </>
                    )}
                  </Button>
                )}

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
