'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Battery, Zap, Shield, ArrowRight } from 'lucide-react'

interface Product {
  id: string
  model: string
  sku: string
  price: string
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

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products?.map((product) => (
            <Card key={product?.id} className="overflow-hidden hover:shadow-xl transition-all">
              <div className="relative aspect-square">
                <Image
                  src={product?.imageUrl || ''}
                  alt={product?.model || ''}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-2 right-2">
                  <Badge className="bg-emerald-600">{product?.tier}</Badge>
                </div>
              </div>
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-1">{product?.model}</h3>
                <p className="text-2xl font-bold text-emerald-600 mb-3">{product?.price}</p>

                <div className="space-y-1 mb-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-emerald-600" />
                    <span>{product?.wattage}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Battery className="h-4 w-4 text-sky-600" />
                    <span>{product?.batteryCapacity} {product?.batteryType}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-emerald-600" />
                    <span>{product?.warranty}</span>
                  </div>
                </div>

                <Link href={`/quote?product=${product?.sku}`}>
                  <Button className="w-full bg-gradient-to-r from-emerald-600 to-sky-600">
                    Request Quote
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
