'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Building, TrendingUp, Wrench, DollarSign } from 'lucide-react'

const benefits = [
  {
    icon: Building,
    title: 'Business Continuity',
    description: 'Keep operations running during outages - every minute counts',
  },
  {
    icon: DollarSign,
    title: 'Reduce Operating Costs',
    description: 'Lower energy expenses and avoid downtime losses',
  },
  {
    icon: TrendingUp,
    title: '30% Tax Credit',
    description: 'Qualify for federal solar tax credit plus accelerated depreciation',
  },
  {
    icon: Wrench,
    title: 'Mobile Power',
    description: 'Perfect for construction sites, food trucks, remote operations',
  },
]

const commercialProducts = [
  { name: 'Titan 10K', power: '10,000W', use: 'Small businesses' },
  { name: 'Titan 15K', power: '15,000W', use: 'Farms & restaurants' },
  { name: 'Apex 20K-30K', power: '20,000-30,000W', use: 'Large operations' },
]

export default function CommercialPage() {
  return (
    <div className="min-h-screen bg-white">
      <section className="relative h-96 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://www.energy.gov/sites/default/files/2021-06/35502216484_c1b49186db_k.jpg"
            alt="Commercial solar"
            fill
            className="object-cover brightness-50"
          />
        </div>
        <div className="relative z-10 text-center text-white px-6">
          <Building className="h-16 w-16 mx-auto mb-4 text-sky-400" />
          <h1 className="text-5xl font-bold mb-4">Commercial Solar Solutions</h1>
          <p className="text-xl max-w-2xl mx-auto">
            Keep your business running, no matter what
          </p>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Why Businesses Choose EnerGenius</h2>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map((benefit) => (
              <Card key={benefit.title}>
                <CardContent className="p-6 text-center">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-sky-100">
                    <benefit.icon className="h-6 w-6 text-sky-600" />
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
          <h2 className="text-3xl font-bold text-center mb-12">Commercial-Grade Power</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {commercialProducts.map((product) => (
              <Card key={product.name}>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-2">{product.name}</h3>
                  <p className="text-sky-600 font-semibold mb-2">{product.power}</p>
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

      <section className="py-16 bg-sky-600 text-white">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-3xl font-bold mb-6">Power Your Business with Confidence</h2>
          <p className="text-xl mb-8">Get a customized quote for your business needs</p>
          <Link href="/quote">
            <Button size="lg" className="bg-white text-sky-600 hover:bg-gray-100">
              Request Business Quote
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
