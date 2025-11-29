'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Check, X, TrendingUp, Shield, Bell, Activity, Zap, Users, BarChart, Calendar } from 'lucide-react'

type PricingTier = 'basic' | 'pro' | 'business'

const pricingTiers = [
  {
    id: 'basic' as PricingTier,
    name: 'Basic',
    tagline: 'Essential Monitoring',
    price: 9.99,
    description: 'Perfect for homeowners who want peace of mind',
    features: [
      { name: 'Real-time system monitoring', included: true },
      { name: 'Battery health tracking', included: true },
      { name: 'Usage alerts & notifications', included: true },
      { name: 'Mobile app access', included: true },
      { name: 'Basic energy reports', included: true },
      { name: 'Email support', included: true },
      { name: 'Predictive maintenance AI', included: false },
      { name: 'Cost optimization recommendations', included: false },
      { name: 'Priority support', included: false },
      { name: 'Advanced analytics', included: false },
    ],
    cta: 'Contact to Activate',
    popular: false
  },
  {
    id: 'pro' as PricingTier,
    name: 'Pro',
    tagline: 'AI-Powered Optimization',
    price: 19.99,
    description: 'Maximum savings with intelligent automation',
    features: [
      { name: 'Real-time system monitoring', included: true },
      { name: 'Battery health tracking', included: true },
      { name: 'Usage alerts & notifications', included: true },
      { name: 'Mobile app access', included: true },
      { name: 'Basic energy reports', included: true },
      { name: 'Email support', included: true },
      { name: 'Predictive maintenance AI', included: true },
      { name: 'Cost optimization recommendations', included: true },
      { name: 'Priority support', included: true },
      { name: 'Advanced analytics', included: true },
    ],
    cta: 'Contact to Activate',
    popular: true
  },
  {
    id: 'business' as PricingTier,
    name: 'Business',
    tagline: 'Enterprise Fleet Management',
    price: 49.99,
    description: 'Complete solution for commercial operations',
    features: [
      { name: 'Real-time system monitoring', included: true },
      { name: 'Battery health tracking', included: true },
      { name: 'Usage alerts & notifications', included: true },
      { name: 'Mobile app access', included: true },
      { name: 'Basic energy reports', included: true },
      { name: 'Email support', included: true },
      { name: 'Predictive maintenance AI', included: true },
      { name: 'Cost optimization recommendations', included: true },
      { name: 'Priority support', included: true },
      { name: 'Advanced analytics', included: true },
      { name: 'Multi-unit fleet management', included: true },
      { name: 'Custom reporting dashboard', included: true },
      { name: 'Dedicated account manager', included: true },
      { name: 'API access', included: true },
    ],
    cta: 'Contact to Activate',
    popular: false
  }
]

const testimonials = [
  {
    name: 'Sarah Mitchell',
    role: 'Homeowner, Arizona',
    text: 'The Pro plan paid for itself in the first month! The AI caught a potential issue before it became a problem.',
    savings: '$240/year'
  },
  {
    name: 'Mike Rodriguez',
    role: 'Construction Company Owner, Texas',
    text: 'Managing our 15 generators across job sites is effortless now. The Business plan is worth every penny.',
    savings: '$5,000+/year'
  },
  {
    name: 'Jennifer Park',
    role: 'Residential Customer, Ohio',
    text: 'Love getting alerts before storms. Basic plan gives me the peace of mind I need without breaking the bank.',
    savings: 'Priceless'
  }
]

export default function SubscriptionPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly')

  const getPrice = (basePrice: number) => {
    if (billingCycle === 'annual') {
      return (basePrice * 12 * 0.85).toFixed(2) // 15% discount for annual
    }
    return basePrice.toFixed(2)
  }

  const getMonthlyEquivalent = (basePrice: number) => {
    if (billingCycle === 'annual') {
      return (basePrice * 0.85).toFixed(2)
    }
    return basePrice.toFixed(2)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-teal-50 to-blue-50 opacity-60"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <Badge className="mb-4 bg-emerald-500 hover:bg-emerald-600 text-white">EnerGenius Smart Connect</Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Unlock the Full Power of Your Solar Generator
            </h1>
            <p className="text-xl text-gray-700 leading-relaxed">
              Turn your EnerGenius generator into an intelligent energy system with real-time monitoring, predictive maintenance, and AI-powered cost savings.
            </p>
          </div>

          {/* Billing Toggle */}
          <div className="flex justify-center items-center gap-4 mb-12">
            <span className={`text-sm font-medium ${billingCycle === 'monthly' ? 'text-gray-900' : 'text-gray-500'}`}>
              Monthly
            </span>
            <button
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly')}
              className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
              style={{ backgroundColor: billingCycle === 'annual' ? '#10b981' : '#e5e7eb' }}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  billingCycle === 'annual' ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`text-sm font-medium ${billingCycle === 'annual' ? 'text-gray-900' : 'text-gray-500'}`}>
              Annual <Badge variant="secondary" className="ml-1">Save 15%</Badge>
            </span>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingTiers.map((tier) => (
              <Card
                key={tier.id}
                className={`relative flex flex-col ${
                  tier.popular
                    ? 'border-emerald-500 border-2 shadow-xl scale-105 z-10'
                    : 'border-gray-200'
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-1">
                      Most Popular
                    </Badge>
                  </div>
                )}

                <CardHeader className="text-center pb-8">
                  <CardTitle className="text-2xl font-bold text-gray-900">{tier.name}</CardTitle>
                  <CardDescription className="text-sm font-medium text-emerald-600 mt-2">
                    {tier.tagline}
                  </CardDescription>
                  <div className="mt-6">
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-5xl font-bold text-gray-900">
                        ${billingCycle === 'annual' ? getMonthlyEquivalent(tier.price) : tier.price}
                      </span>
                      <span className="text-gray-500">/month</span>
                    </div>
                    {billingCycle === 'annual' && (
                      <p className="text-sm text-gray-600 mt-2">
                        ${getPrice(tier.price)} billed annually
                      </p>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-4">{tier.description}</p>
                </CardHeader>

                <CardContent className="flex-grow">
                  <ul className="space-y-3">
                    {tier.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        {feature.included ? (
                          <Check className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                        ) : (
                          <X className="h-5 w-5 text-gray-300 shrink-0 mt-0.5" />
                        )}
                        <span className={feature.included ? 'text-gray-700' : 'text-gray-400'}>
                          {feature.name}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>

                <CardFooter>
                  <Link href="/contact" className="w-full">
                    <Button
                      className={`w-full ${
                        tier.popular
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                          : 'bg-gray-900 hover:bg-gray-800 text-white'
                      }`}
                    >
                      {tier.cta}
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Value Propositions */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">Why Smart Connect?</h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 mb-4">
                <Activity className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900">Real-Time Insights</h3>
              <p className="text-gray-600 text-sm">
                Monitor your system 24/7 from anywhere with live data updates
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900">Predictive Maintenance</h3>
              <p className="text-gray-600 text-sm">
                AI detects issues before they happen, saving you money on repairs
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-100 mb-4">
                <TrendingUp className="h-8 w-8 text-amber-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900">Cost Optimization</h3>
              <p className="text-gray-600 text-sm">
                Smart recommendations help you maximize savings and ROI
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-100 mb-4">
                <Bell className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900">Instant Alerts</h3>
              <p className="text-gray-600 text-sm">
                Get notified immediately about critical events or maintenance needs
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ROI Calculator */}
      <section className="py-16 bg-gradient-to-br from-emerald-50 to-teal-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-6 text-gray-900">Calculate Your Savings</h2>
            <p className="text-center text-gray-700 mb-12">
              See how Smart Connect subscriptions pay for themselves through predictive maintenance and optimized usage
            </p>

            <div className="grid md:grid-cols-3 gap-6">
              <Card className="bg-white">
                <CardHeader>
                  <CardTitle className="text-lg text-emerald-700">Basic Plan</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600">Monthly Cost</p>
                    <p className="text-2xl font-bold text-gray-900">$9.99</p>
                  </div>
                  <Separator />
                  <div>
                    <p className="text-sm text-gray-600">Avg. Annual Savings</p>
                    <p className="text-xl font-semibold text-emerald-600">$150-300</p>
                    <p className="text-xs text-gray-500 mt-1">Through early issue detection</p>
                  </div>
                  <Separator />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Net Benefit Year 1</p>
                    <p className="text-2xl font-bold text-emerald-600">+$30-180</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-2 border-emerald-500">
                <CardHeader>
                  <CardTitle className="text-lg text-emerald-700 flex items-center gap-2">
                    Pro Plan
                    <Badge variant="secondary" className="text-xs">Best Value</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600">Monthly Cost</p>
                    <p className="text-2xl font-bold text-gray-900">$19.99</p>
                  </div>
                  <Separator />
                  <div>
                    <p className="text-sm text-gray-600">Avg. Annual Savings</p>
                    <p className="text-xl font-semibold text-emerald-600">$400-800</p>
                    <p className="text-xs text-gray-500 mt-1">AI optimization + maintenance</p>
                  </div>
                  <Separator />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Net Benefit Year 1</p>
                    <p className="text-2xl font-bold text-emerald-600">+$160-560</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white">
                <CardHeader>
                  <CardTitle className="text-lg text-emerald-700">Business Plan</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600">Monthly Cost</p>
                    <p className="text-2xl font-bold text-gray-900">$49.99</p>
                  </div>
                  <Separator />
                  <div>
                    <p className="text-sm text-gray-600">Avg. Annual Savings</p>
                    <p className="text-xl font-semibold text-emerald-600">$2,000+</p>
                    <p className="text-xs text-gray-500 mt-1">Fleet efficiency + downtime prevention</p>
                  </div>
                  <Separator />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Net Benefit Year 1</p>
                    <p className="text-2xl font-bold text-emerald-600">+$1,400+</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <p className="text-center text-sm text-gray-600 mt-8">
              * Savings estimates based on average customer data. Actual results may vary based on usage patterns and system configuration.
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">What Customers Are Saying</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, idx) => (
              <Card key={idx} className="bg-gradient-to-br from-gray-50 to-white">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-1 mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg
                        key={star}
                        className="h-5 w-5 text-amber-400 fill-current"
                        viewBox="0 0 20 20"
                      >
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-gray-700 italic mb-4">"{testimonial.text}"</p>
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="font-semibold text-gray-900">{testimonial.name}</p>
                      <p className="text-sm text-gray-600">{testimonial.role}</p>
                    </div>
                    <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">
                      {testimonial.savings}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Deep Dive */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">Planned Smart Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="flex gap-4">
              <div className="shrink-0">
                <div className="w-12 h-12 rounded-lg bg-emerald-100 flex items-center justify-center">
                  <Activity className="h-6 w-6 text-emerald-600" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Live Monitoring Dashboard</h3>
                <p className="text-sm text-gray-600">
                  Real-time display of battery charge, power output, and system health metrics
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="shrink-0">
                <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Bell className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Smart Alerts</h3>
                <p className="text-sm text-gray-600">
                  Instant notifications for low battery, maintenance needs, or system anomalies
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="shrink-0">
                <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                  <BarChart className="h-6 w-6 text-purple-600" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Usage Analytics</h3>
                <p className="text-sm text-gray-600">
                  Detailed breakdowns of energy consumption patterns and cost analysis
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="shrink-0">
                <div className="w-12 h-12 rounded-lg bg-amber-100 flex items-center justify-center">
                  <Zap className="h-6 w-6 text-amber-600" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Predictive AI</h3>
                <p className="text-sm text-gray-600">
                  Machine learning algorithms predict failures before they occur
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="shrink-0">
                <div className="w-12 h-12 rounded-lg bg-rose-100 flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-rose-600" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Maintenance Tracking</h3>
                <p className="text-sm text-gray-600">
                  Automated service reminders and warranty status monitoring
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="shrink-0">
                <div className="w-12 h-12 rounded-lg bg-teal-100 flex items-center justify-center">
                  <Users className="h-6 w-6 text-teal-600" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Fleet Management</h3>
                <p className="text-sm text-gray-600">
                  Centralized control for businesses managing multiple generator units
                </p>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link href="/roadmap">
              <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white">
                View Full Roadmap
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-emerald-600 to-teal-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Make Your Generator Smarter?
          </h2>
          <p className="text-xl mb-8 text-emerald-50 max-w-2xl mx-auto">
            Contact us today to activate Smart Connect on your EnerGenius system. Our team will help you choose the perfect plan.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button size="lg" className="bg-white text-emerald-600 hover:bg-gray-100">
                Contact Us to Activate
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="lg" variant="outline" className="border-white text-white bg-transparent hover:bg-white hover:text-emerald-600">
                View Demo Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
