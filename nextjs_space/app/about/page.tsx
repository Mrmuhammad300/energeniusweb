'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Shield, Award, Users, HeadphonesIcon } from 'lucide-react'

const values = [
  {
    icon: Shield,
    title: '5-Year Warranty',
    description: 'Industry-leading warranty coverage, double the standard',
  },
  {
    icon: Award,
    title: 'Superior Quality',
    description: '8,000 cycle lifespan - 30 years of reliable daily use',
  },
  {
    icon: Users,
    title: 'Honest Pricing',
    description: 'All-inclusive pricing with solar panels included',
  },
  {
    icon: HeadphonesIcon,
    title: 'U.S.-Based Support',
    description: '24-hour response guarantee from real experts',
  },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <section className="py-16 bg-gradient-to-r from-emerald-600 to-sky-600 text-white">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h1 className="text-5xl font-bold mb-6">About EnerGenius</h1>
          <p className="text-xl">
            Your trusted partner for premium solar generator solutions
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
          <p className="text-lg text-gray-700 mb-4">
            EnerGenius, operated by <strong>Renewable Resource Group LLC</strong>, is a trusted authorized reseller 
            committed to delivering professional-grade solar generators at honest prices with exceptional support. 
            We eliminate the frustrations customers experience with other brands through transparent pricing, 
            superior warranty coverage, and responsive U.S.-based customer service.
          </p>
          <p className="text-lg text-gray-700 mb-4">
            Through our strategic partnerships and efficient fulfillment operations, we offer <strong>fast shipping</strong> and 
            competitive pricing on premium solar generator solutions. Every order is carefully coordinated to ensure 
            you receive your equipment quickly and in perfect condition.
          </p>
          <p className="text-lg text-gray-700 mb-4">
            Serving homeowners and businesses across Ohio, Texas, Arizona, New Mexico, and the Midwest region,
            we provide complete energy solutions from portable 400W units to commercial-grade 30,000W systems.
          </p>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">The EnerGenius Advantage</h2>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => (
              <Card key={value.title}>
                <CardContent className="p-6 text-center">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
                    <value.icon className="h-6 w-6 text-emerald-600" />
                  </div>
                  <h3 className="font-bold mb-2">{value.title}</h3>
                  <p className="text-sm text-gray-600">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="text-3xl font-bold mb-6 text-center">Quality You Can Trust</h2>
          <div className="space-y-4 text-lg text-gray-700">
            <p>
              Every EnerGenius generator features advanced lithium battery technology with 8,000 cycle lifespan,
              providing up to 30 years of daily use. Our products include solar panels and all necessary
              accessories - no hidden costs or surprise fees.
            </p>
            <p>
              We back our products with a comprehensive 5-year warranty and lifetime battery coverage if capacity
              falls below 70% within 8 years. Our U.S.-based support team provides 24-hour response times and
              expert guidance throughout your ownership experience.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-r from-emerald-600 to-sky-600 text-white">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Experience the Difference?</h2>
          <p className="text-xl mb-8">Join thousands of satisfied customers who chose EnerGenius</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/products">
              <Button size="lg" variant="outline" className="text-emerald-600 bg-white">
                Browse Products
              </Button>
            </Link>
            <Link href="/quote">
              <Button size="lg" className="bg-white text-emerald-600 hover:bg-gray-100">
                Get Free Quote
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
