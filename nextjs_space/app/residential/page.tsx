'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Home, Shield, Battery, DollarSign, Zap, CheckCircle } from 'lucide-react'

const benefits = [
  {
    icon: Shield,
    title: 'Family Safety',
    description: 'Keep your family safe and comfortable during any power outage',
  },
  {
    icon: DollarSign,
    title: 'Lower Energy Bills',
    description: 'Reduce or eliminate your electricity costs with solar power',
  },
  {
    icon: Battery,
    title: 'Energy Independence',
    description: 'Take control of your power, never worry about blackouts again',
  },
  {
    icon: Zap,
    title: 'Clean & Quiet',
    description: 'Zero emissions, silent operation - perfect for residential areas',
  },
]

const recommendedProducts = [
  { name: 'Guardian 3000', power: '3000W', use: 'Essential backup' },
  { name: 'Guardian 5000', power: '5000W', use: 'Whole-home backup' },
  { name: 'Guardian 8000', power: '8000W', use: 'Extended protection' },
]

export default function ResidentialPage() {
  return (
    <div className="min-h-screen bg-white">
      <section className="relative h-96 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://us.images.westend61.de/0001906127pw/happy-family-standing-in-front-their-family-house-with-solar-panels-on-the-roof-HAPF03484.jpg"
            alt="Residential solar"
            fill
            className="object-cover brightness-50"
          />
        </div>
        <div className="relative z-10 text-center text-white px-6">
          <Home className="h-16 w-16 mx-auto mb-4 text-emerald-400" />
          <h1 className="text-5xl font-bold mb-4">Residential Solar Solutions</h1>
          <p className="text-xl max-w-2xl mx-auto">
            Protect your home and family with reliable backup power
          </p>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Why Homeowners Choose EnerGenius</h2>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map((benefit) => (
              <Card key={benefit.title}>
                <CardContent className="p-6 text-center">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
                    <benefit.icon className="h-6 w-6 text-emerald-600" />
                  </div>
                  <h3 className="font-bold mb-2">{benefit.title}</h3>
                  <p className="text-sm text-gray-600">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Recommended for Homes</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {recommendedProducts.map((product) => (
              <Card key={product.name}>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-2">{product.name}</h3>
                  <p className="text-emerald-600 font-semibold mb-2">{product.power}</p>
                  <p className="text-sm text-gray-600 mb-4">{product.use}</p>
                  <Link href="/products">
                    <Button className="w-full bg-gradient-to-r from-emerald-600 to-sky-600">
                      View Details
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-emerald-600 text-white">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Protect Your Home?</h2>
          <p className="text-xl mb-8">Get a free quote tailored to your home's needs</p>
          <Link href="/quote">
            <Button size="lg" className="bg-white text-emerald-600 hover:bg-gray-100">
              Request Free Quote
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
