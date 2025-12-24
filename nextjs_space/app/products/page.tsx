'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Battery, Zap, Shield, ArrowRight, Sparkles, Activity, TrendingUp } from 'lucide-react'
import { getBatteryRuntimeExamples, getQuickBenefitTags, getBenefitHeadline, parseCapacityToWattHours } from '@/lib/spec-benefits'

interface Product {
  id: string
  model: string
  sku: string
  price: string
  priceNumeric: number
  wattage: string
  batteryCapacity: string
  batteryType: string
  tier: string
  imageUrl: string
  warranty: string
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => {
        setProducts(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  // Helper function to extract numeric capacity for sorting
  const extractCapacity = (product: Product): number => {
    // For generators, extract wattage
    const wattageMatch = product.wattage?.match(/(\d+)/)
    if (wattageMatch) {
      return parseInt(wattageMatch[1])
    }
    // For batteries, extract amp hours
    const ampMatch = product.batteryCapacity?.match(/(\d+)\s*(?:amp|ah)/i)
    if (ampMatch) {
      return parseInt(ampMatch[1])
    }
    return 0
  }

  // Separate and sort products
  const powerBanks = products
    .filter(p => p.model?.toLowerCase().includes('powerbank') || p.tier === 'Battery')
    .sort((a, b) => extractCapacity(a) - extractCapacity(b))
  
  // Separate Scout generators from other generators
  const allGenerators = products.filter(p => !p.model?.toLowerCase().includes('powerbank') && p.tier !== 'Battery')
  const scoutGenerators = allGenerators
    .filter(p => p.model?.toLowerCase().includes('scout'))
    .sort((a, b) => extractCapacity(a) - extractCapacity(b))
  const otherGenerators = allGenerators
    .filter(p => !p.model?.toLowerCase().includes('scout'))
    .sort((a, b) => extractCapacity(a) - extractCapacity(b))
  
  // Combine with Scout generators first
  const generators = [...scoutGenerators, ...otherGenerators]

  // Scroll to product if SKU is in URL hash
  useEffect(() => {
    if (!loading && products.length > 0) {
      const hash = window.location.hash.slice(1) // Remove the # symbol
      if (hash) {
        // Wait a bit for the page to render
        setTimeout(() => {
          const element = document.getElementById(hash)
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' })
            // Add a highlight effect
            element.classList.add('ring-4', 'ring-emerald-500', 'ring-offset-4')
            setTimeout(() => {
              element.classList.remove('ring-4', 'ring-emerald-500', 'ring-offset-4')
            }, 3000)
          }
        }, 100)
      }
    }
  }, [loading, products])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl mb-4">
            Our Complete Product Line
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Professional-grade solar generators from 400W to 30,000W
          </p>
        </div>

        {/* Subscription Upsell Banner */}
        <div className="mb-12">
          <Card className="overflow-hidden border-2 border-emerald-500 bg-gradient-to-br from-emerald-50 via-teal-50 to-blue-50">
            <CardContent className="p-8">
              <div className="flex flex-col lg:flex-row items-center gap-6">
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                    <Sparkles className="h-10 w-10 text-white" />
                  </div>
                </div>
                <div className="flex-grow text-center lg:text-left">
                  <div className="flex items-center justify-center lg:justify-start gap-2 mb-2">
                    <h2 className="text-2xl font-bold text-gray-900">Make Your Generator Smarter</h2>
                    <Badge className="bg-emerald-600 text-white">New</Badge>
                  </div>
                  <p className="text-gray-700 mb-4">
                    Add <span className="font-semibold text-emerald-700">EnerGenius Smart Connect</span> to any generator for real-time monitoring, predictive maintenance, and AI-powered cost optimization. Starting at just <span className="font-bold text-emerald-600">$9.99/month</span>.
                  </p>
                  <div className="flex flex-wrap items-center gap-4 justify-center lg:justify-start text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Activity className="h-4 w-4 text-emerald-600" />
                      <span>24/7 Monitoring</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-emerald-600" />
                      <span>AI Insights</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-emerald-600" />
                      <span>Predictive Maintenance</span>
                    </div>
                  </div>
                </div>
                <div className="flex-shrink-0 flex flex-col gap-3">
                  <Link href="/subscription">
                    <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white w-full lg:w-auto">
                      View Plans & Pricing
                    </Button>
                  </Link>
                  <Link href="/dashboard">
                    <Button size="lg" variant="outline" className="border-emerald-600 text-emerald-600 hover:bg-emerald-50 w-full lg:w-auto">
                      See Demo Dashboard
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Solar Generators Section */}
        {generators.length > 0 && (
          <div className="mb-16">
            <div className="mb-8">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">
                Solar Generators
              </h2>
              <p className="text-gray-600">
                Complete power stations from 400W to 30,000W - Scout series first, then sorted by capacity
              </p>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {generators.map((product) => (
                <Card key={product?.id} id={product?.sku} className="overflow-hidden hover:shadow-xl transition-all">
                  <div className="relative aspect-square">
                    <Image
                      src={product?.imageUrl || ''}
                      alt={product?.model || ''}
                      fill
                      className="object-cover"
                    />
                    {/* EnerGenius Branding Badge */}
                    <div className="absolute bottom-2 left-2 bg-white/95 backdrop-blur rounded-lg p-2 shadow-md">
                      <Image
                        src="/energenius-badge.png"
                        alt="EnerGenius"
                        width={40}
                        height={40}
                        className="object-contain"
                      />
                    </div>
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-emerald-600">{product?.tier}</Badge>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{product?.model}</h3>
                    <p className="text-2xl font-bold text-emerald-600 mb-2">{product?.price}</p>

                    {(() => {
                      // Parse wattage for benefit calculations
                      const wattsMatch = product?.wattage?.match(/(\d+)/);
                      const watts = wattsMatch ? parseInt(wattsMatch[1]) : 0;
                      const isBattery = product?.tier === 'Battery';
                      const benefitHeadline = isBattery ? 'Expandable Energy Storage' : getBenefitHeadline(watts);
                      const benefitTags = getQuickBenefitTags(watts);
                      
                      // Parse battery capacity and convert to Watt Hours for accurate runtime examples
                      const wattHours = parseCapacityToWattHours(product?.batteryCapacity, watts);
                      const runtimeExamples = getBatteryRuntimeExamples(wattHours);

                      return (
                        <>
                          {/* Benefit Headline */}
                          <p className="text-xs font-semibold text-emerald-700 mb-3 uppercase tracking-wide">
                            {benefitHeadline}
                          </p>

                          {/* Real-World Benefits - Prominent Display */}
                          {runtimeExamples.length > 0 && (
                            <div className="mb-4 p-3 bg-gradient-to-br from-emerald-50 to-sky-50 rounded-lg border border-emerald-200">
                              <p className="text-xs font-semibold text-gray-700 mb-2">Real-World Power:</p>
                              <div className="space-y-1.5">
                                {runtimeExamples.slice(0, 3).map((example, idx) => (
                                  <div key={idx} className="text-xs text-gray-700 flex items-start gap-1.5">
                                    <span className="text-emerald-600 flex-shrink-0">✓</span>
                                    <span className="leading-tight">{example}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Technical Specs - Compact */}
                          <div className="space-y-1 mb-4 text-xs text-gray-500">
                            {!isBattery && (
                              <div className="flex items-center gap-2">
                                <Zap className="h-3 w-3 text-emerald-600" />
                                <span>{product?.wattage}</span>
                              </div>
                            )}
                            <div className="flex items-center gap-2">
                              <Battery className="h-3 w-3 text-sky-600" />
                              <span>{wattHours > 0 ? `${wattHours.toLocaleString()}Wh` : product?.batteryCapacity} {product?.batteryType}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Shield className="h-3 w-3 text-emerald-600" />
                              <span>{product?.warranty}</span>
                            </div>
                          </div>
                        </>
                      );
                    })()}

                    <div className="space-y-2">
                      <Link href={`/products/${product?.id}`}>
                        <Button className="w-full bg-gradient-to-r from-emerald-600 to-sky-600">
                          View Details & Purchase
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                      <Link href={`/quote?product=${product?.sku}`}>
                        <Button variant="outline" className="w-full text-sm">
                          Request Custom Quote
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Power Banks & Accessories Section */}
        {powerBanks.length > 0 && (
          <div>
            <div className="mb-8 pb-6 border-t-2 border-gray-200 pt-12">
              <div className="flex items-center gap-4 mb-3">
                <Battery className="h-10 w-10 text-sky-600" />
                <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                  Power Banks & Accessories
                </h2>
              </div>
              <p className="text-gray-600">
                Expandable battery storage solutions - sorted by capacity
              </p>
              <div className="mt-4 p-4 bg-sky-50 rounded-lg border border-sky-200">
                <p className="text-sm text-sky-900">
                  <strong>💡 Pro Tip:</strong> Power banks can be added to any solar generator to extend runtime and capacity. Perfect for off-grid living, emergency backup, or maximizing your existing system.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {powerBanks.map((product) => (
                <Card key={product?.id} id={product?.sku} className="overflow-hidden hover:shadow-xl transition-all border-2 border-sky-200">
                  <div className="relative aspect-square">
                    <Image
                      src={product?.imageUrl || ''}
                      alt={product?.model || ''}
                      fill
                      className="object-cover"
                    />
                    {/* EnerGenius Branding Badge */}
                    <div className="absolute bottom-2 left-2 bg-white/95 backdrop-blur rounded-lg p-2 shadow-md">
                      <Image
                        src="/energenius-badge.png"
                        alt="EnerGenius"
                        width={40}
                        height={40}
                        className="object-contain"
                      />
                    </div>
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-sky-600">Accessory</Badge>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{product?.model}</h3>
                    <p className="text-2xl font-bold text-sky-600 mb-2">{product?.price}</p>

                    {(() => {
                      // Parse wattage for benefit calculations
                      const wattsMatch = product?.wattage?.match(/(\d+)/);
                      const watts = wattsMatch ? parseInt(wattsMatch[1]) : 0;
                      const isBattery = true;
                      const benefitHeadline = 'Expandable Energy Storage';
                      
                      // Parse battery capacity and convert to Watt Hours for accurate runtime examples
                      const wattHours = parseCapacityToWattHours(product?.batteryCapacity, watts);
                      const runtimeExamples = getBatteryRuntimeExamples(wattHours);

                      return (
                        <>
                          {/* Benefit Headline */}
                          <p className="text-xs font-semibold text-sky-700 mb-3 uppercase tracking-wide">
                            {benefitHeadline}
                          </p>

                          {/* Real-World Benefits - Prominent Display */}
                          {runtimeExamples.length > 0 && (
                            <div className="mb-4 p-3 bg-gradient-to-br from-sky-50 to-blue-50 rounded-lg border border-sky-200">
                              <p className="text-xs font-semibold text-gray-700 mb-2">Real-World Power:</p>
                              <div className="space-y-1.5">
                                {runtimeExamples.slice(0, 3).map((example, idx) => (
                                  <div key={idx} className="text-xs text-gray-700 flex items-start gap-1.5">
                                    <span className="text-sky-600 flex-shrink-0">✓</span>
                                    <span className="leading-tight">{example}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Technical Specs - Compact */}
                          <div className="space-y-1 mb-4 text-xs text-gray-500">
                            <div className="flex items-center gap-2">
                              <Battery className="h-3 w-3 text-sky-600" />
                              <span>{wattHours > 0 ? `${wattHours.toLocaleString()}Wh` : product?.batteryCapacity} {product?.batteryType}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Shield className="h-3 w-3 text-sky-600" />
                              <span>{product?.warranty}</span>
                            </div>
                          </div>
                        </>
                      );
                    })()}

                    <div className="space-y-2">
                      <Link href={`/products/${product?.id}`}>
                        <Button className="w-full bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700">
                          View Details & Purchase
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                      <Link href={`/quote?product=${product?.sku}`}>
                        <Button variant="outline" className="w-full text-sm border-sky-600 text-sky-600 hover:bg-sky-50">
                          Request Custom Quote
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
