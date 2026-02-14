'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Battery, Zap, Shield, ArrowRight, Star, CheckCircle, Calendar, Building2, Home, Briefcase, BatteryCharging } from 'lucide-react'

interface Product {
  id: string
  model: string
  sku: string
  price: string
  priceNumeric: number
  wattage: string
  wattageNumeric: number
  batteryCapacity: string
  batteryType: string
  tier: string
  imageUrl: string
  warranty: string
  description?: string
}

// Product categories for easier navigation
const categories = [
  { id: 'featured', label: 'Featured', icon: Star },
  { id: 'residential', label: 'Residential', icon: Home },
  { id: 'commercial', label: 'Commercial', icon: Building2 },
  { id: 'powerbanks', label: 'Power Banks', icon: BatteryCharging },
  { id: 'all', label: 'All Products', icon: Briefcase },
]

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('featured')

  useEffect(() => {
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => {
        setProducts(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  // Helper to get wattage - use wattageNumeric directly
  const getWattage = (product: Product): number => {
    return product.wattageNumeric || 0
  }

  // Find featured product (Nomad 20K) - specifically match 20,000W
  const nomad20k = products.find(p => {
    const wattage = getWattage(p)
    return wattage === 20000
  })

  // Helper to extract capacity for power banks (Amp Hours)
  const extractCapacity = (product: Product): number => {
    const capacityMatch = product.batteryCapacity?.match(/(\d+)/);
    return capacityMatch ? parseInt(capacityMatch[1]) : 0;
  }

  // Categorize products - Power Banks have tier "Battery" or very low wattage
  const isPowerBank = (p: Product) => 
    p.model?.toLowerCase().includes('powerbank') || p.tier === 'Battery'

  const powerBankProducts = products
    .filter(p => isPowerBank(p))
    .sort((a, b) => extractCapacity(a) - extractCapacity(b))

  // Residential: 1,000W to 10,000W (inclusive)
  const residentialProducts = products
    .filter(p => !isPowerBank(p))
    .filter(p => {
      const wattage = getWattage(p)
      return wattage >= 1000 && wattage <= 10000
    })
    .sort((a, b) => getWattage(a) - getWattage(b))

  // Commercial: 15,000W to 30,000W (products above 10K)
  const commercialProducts = products
    .filter(p => !isPowerBank(p))
    .filter(p => {
      const wattage = getWattage(p)
      return wattage > 10000 && wattage <= 30000
    })
    .sort((a, b) => getWattage(a) - getWattage(b))

  const allGenerators = products
    .filter(p => !isPowerBank(p))
    .sort((a, b) => getWattage(a) - getWattage(b))

  // Get products based on active category
  const getDisplayedProducts = () => {
    switch (activeCategory) {
      case 'residential':
        return residentialProducts
      case 'commercial':
        return commercialProducts
      case 'powerbanks':
        return powerBankProducts
      case 'all':
        return [...allGenerators, ...powerBankProducts]
      default:
        return []
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-eg-forest"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-900 to-eg-forest-dark text-white py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold mb-4">
              Find Your Perfect Backup Power System
            </h1>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto">
              From portable units to commercial-grade systems. All backed by our 5-year warranty.
            </p>
          </div>
          
          {/* Quick Assessment CTA */}
          <div className="flex justify-center">
            <Link href="/quote">
              <Button className="bg-eg-forest-light hover:bg-eg-forest text-white px-8 py-6 text-lg">
                <Calendar className="mr-2 h-5 w-5" />
                Not Sure What You Need? Get a Free Assessment
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Product - Nomad 20K */}
      {nomad20k && (
        <section className="py-12 bg-white border-b">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 mb-6">
              <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
              <span className="text-sm font-semibold text-amber-600 uppercase tracking-wide">Most Popular for Commercial</span>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden shadow-lg">
                <Image
                  src={nomad20k.imageUrl}
                  alt={nomad20k.model}
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute top-4 left-4">
                  <Badge className="bg-eg-forest text-white px-3 py-1">Best Seller</Badge>
                </div>
              </div>
              
              <div>
                <h2 className="text-3xl font-bold text-slate-900 mb-2">{nomad20k.model}</h2>
                <p className="text-3xl font-bold text-eg-forest mb-4">{nomad20k.price}</p>
                
                <p className="text-slate-600 mb-6">
                  The reference standard for commercial backup power. Powers entire buildings for days, 
                  not hours. Silent, clean, and maintenance-free.
                </p>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-slate-50 rounded-lg p-4">
                    <p className="text-2xl font-bold text-eg-forest">20,000W</p>
                    <p className="text-sm text-slate-500">Continuous Power</p>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-4">
                    <p className="text-2xl font-bold text-eg-forest">40,000W</p>
                    <p className="text-sm text-slate-500">Peak Power</p>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-4">
                    <p className="text-2xl font-bold text-eg-forest">8,000</p>
                    <p className="text-sm text-slate-500">Life Cycles</p>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-4">
                    <p className="text-2xl font-bold text-eg-forest">5 Year</p>
                    <p className="text-sm text-slate-500">Warranty</p>
                  </div>
                </div>
                
                <div className="space-y-2 mb-6">
                  {[
                    'Powers commercial HVAC, refrigeration, medical equipment',
                    'Qualifies for 30% Federal Tax Credit',
                    'Zero fuel costs, zero maintenance',
                    'Professional installation available',
                  ].map((benefit) => (
                    <div key={benefit} className="flex items-center gap-2 text-slate-700">
                      <CheckCircle className="h-5 w-5 text-eg-forest-light flex-shrink-0" />
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link href={`/products/${nomad20k.id}`} className="flex-1">
                    <Button className="w-full bg-eg-forest hover:bg-eg-forest-dark text-white py-6">
                      View Full Details
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <Link href="/quote" className="flex-1">
                    <Button variant="outline" className="w-full border-eg-forest text-eg-forest-dark hover:bg-eg-forest/5 py-6">
                      Get Custom Quote
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Category Navigation */}
      <section className="py-8 bg-slate-100 sticky top-[73px] z-40 border-b">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex gap-2 overflow-x-auto pb-2 -mb-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm whitespace-nowrap transition-colors ${
                  activeCategory === cat.id
                    ? 'bg-eg-forest text-white'
                    : 'bg-white text-slate-700 hover:bg-slate-200'
                }`}
              >
                <cat.icon className="h-4 w-4" />
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          {activeCategory === 'featured' ? (
            // Featured view - Show category overview
            <div className="space-y-12">
              {/* Residential Preview */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">Residential Solutions</h2>
                    <p className="text-slate-600">1,000W - 10,000W systems for home backup</p>
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={() => setActiveCategory('residential')}
                    className="hidden sm:flex"
                  >
                    View All ({residentialProducts.length})
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {residentialProducts.slice(0, 3).map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
                <div className="mt-4 sm:hidden">
                  <Button 
                    variant="outline" 
                    onClick={() => setActiveCategory('residential')}
                    className="w-full"
                  >
                    View All Residential ({residentialProducts.length})
                  </Button>
                </div>
              </div>
              
              {/* Commercial Preview */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">Commercial Solutions</h2>
                    <p className="text-slate-600">10,000W - 30,000W systems for business</p>
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={() => setActiveCategory('commercial')}
                    className="hidden sm:flex"
                  >
                    View All ({commercialProducts.length})
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {commercialProducts.slice(0, 3).map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
                <div className="mt-4 sm:hidden">
                  <Button 
                    variant="outline" 
                    onClick={() => setActiveCategory('commercial')}
                    className="w-full"
                  >
                    View All Commercial ({commercialProducts.length})
                  </Button>
                </div>
              </div>

              {/* Power Banks Preview */}
              {powerBankProducts.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900">Power Banks &amp; Expandable Storage</h2>
                      <p className="text-slate-600">Extend your system capacity with additional batteries</p>
                    </div>
                    <Button 
                      variant="outline" 
                      onClick={() => setActiveCategory('powerbanks')}
                      className="hidden sm:flex"
                    >
                      View All ({powerBankProducts.length})
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {powerBankProducts.slice(0, 3).map((product) => (
                      <ProductCard key={product.id} product={product} isPowerBank />
                    ))}
                  </div>
                  <div className="mt-4 sm:hidden">
                    <Button 
                      variant="outline" 
                      onClick={() => setActiveCategory('powerbanks')}
                      className="w-full"
                    >
                      View All Power Banks ({powerBankProducts.length})
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            // Category view - Show all products in category
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-slate-900">
                  {activeCategory === 'residential' && 'Residential Solutions'}
                  {activeCategory === 'commercial' && 'Commercial Solutions'}
                  {activeCategory === 'powerbanks' && 'Power Banks & Expandable Storage'}
                  {activeCategory === 'all' && 'All Products'}
                </h2>
                <p className="text-slate-600">
                  {activeCategory === 'residential' && `${residentialProducts.length} products for home backup power`}
                  {activeCategory === 'commercial' && `${commercialProducts.length} products for business backup power`}
                  {activeCategory === 'powerbanks' && `${powerBankProducts.length} expansion batteries for your system`}
                  {activeCategory === 'all' && `${allGenerators.length + powerBankProducts.length} total products`}
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {getDisplayedProducts().map((product) => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    isPowerBank={product.model?.toLowerCase().includes('powerbank') || product.tier === 'Battery'}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Assessment CTA */}
      <section className="py-16 bg-eg-forest">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Not Sure Which System Is Right for You?
          </h2>
          <p className="text-eg-forest/10 mb-8 max-w-2xl mx-auto">
            Our 15-minute energy assessment will analyze your power needs and recommend 
            the perfect system for your situation.
          </p>
          <Link href="/quote">
            <Button className="bg-white text-eg-forest-dark hover:bg-slate-100 px-8 py-6 text-lg font-semibold">
              <Calendar className="mr-2 h-5 w-5" />
              Get Your Free Assessment
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}

// Simplified Product Card Component
function ProductCard({ product, isPowerBank = false }: { product: Product; isPowerBank?: boolean }) {
  // Use wattageNumeric directly from product data
  const watts = product.wattageNumeric || 0
  
  // Extract capacity for power banks
  const extractCapacity = (capacity: string): string => {
    const match = capacity?.match(/(\d+)\s*(Ah|AH|amp|Amp)/i)
    return match ? `${match[1]} Ah` : capacity || ''
  }
  
  return (
    <Card className={`overflow-hidden hover:shadow-lg transition-all bg-white ${isPowerBank ? 'border-sky-200 border-2' : ''}`}>
      <div className="relative aspect-[4/3]">
        <Image
          src={product.imageUrl || ''}
          alt={product.model || ''}
          fill
          className="object-cover"
        />
        <div className="absolute top-3 right-3">
          <Badge className={isPowerBank ? 'bg-sky-600 text-white' : 'bg-slate-900/80 text-white'}>
            {isPowerBank ? 'Expansion Battery' : product.tier}
          </Badge>
        </div>
      </div>
      <CardContent className="p-5">
        <h3 className="text-lg font-bold text-slate-900 mb-1">{product.model}</h3>
        <p className={`text-xl font-bold mb-3 ${isPowerBank ? 'text-sky-600' : 'text-eg-forest'}`}>{product.price}</p>
        
        {/* Key Specs - Clean and Simple */}
        <div className="flex flex-wrap gap-3 mb-4 text-sm text-slate-600">
          {isPowerBank ? (
            <>
              <div className="flex items-center gap-1">
                <BatteryCharging className="h-4 w-4 text-sky-600" />
                <span>{extractCapacity(product.batteryCapacity)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Battery className="h-4 w-4 text-sky-600" />
                <span>{product.batteryType}</span>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-1">
                <Zap className="h-4 w-4 text-eg-forest" />
                <span>{product.wattage?.split('/')[0]}</span>
              </div>
              <div className="flex items-center gap-1">
                <Battery className="h-4 w-4 text-sky-600" />
                <span>{product.batteryType}</span>
              </div>
            </>
          )}
          <div className="flex items-center gap-1">
            <Shield className="h-4 w-4 text-slate-500" />
            <span>{product.warranty}</span>
          </div>
        </div>
        
        {/* What it can power - Simple examples */}
        <div className="mb-4 text-sm text-slate-500">
          {isPowerBank ? (
            'Expands capacity for extended off-grid operation'
          ) : (
            <>
              {watts <= 1000 && 'Great for: Phones, laptops, small appliances'}
              {watts > 1000 && watts <= 3000 && 'Great for: Fridge, lights, TV, computers'}
              {watts > 3000 && watts <= 10000 && 'Great for: Whole home essentials, AC unit'}
              {watts > 10000 && watts <= 20000 && 'Great for: Full building, multiple AC units'}
              {watts > 20000 && 'Great for: Commercial buildings, industrial use'}
            </>
          )}
        </div>
        
        <Link href={`/products/${product.id}`}>
          <Button className={`w-full ${isPowerBank ? 'bg-sky-600 hover:bg-sky-700' : 'bg-eg-forest hover:bg-eg-forest-dark'} text-white`}>
            View Details
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}
