'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Shield, Award, Users, HeadphonesIcon, Power, Zap, Cpu, Battery, Wifi, CheckCircle } from 'lucide-react'

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

const blackStartFeatures = [
  {
    icon: Power,
    title: 'True Black Start',
    description: 'Self-initiates from zero power without grid voltage, solar input, or pre-charged batteries.',
  },
  {
    icon: Cpu,
    title: 'Autonomous Architecture',
    description: 'Internal DC bus + inverter boot logic enables independent system startup.',
  },
  {
    icon: Battery,
    title: 'Long-Life LFP Batteries',
    description: 'Lithium Iron Phosphate chemistry with high depth-of-discharge operation.',
  },
  {
    icon: Wifi,
    title: 'SmartConnect™ Platform',
    description: 'Cloud-enabled energy management with remote monitoring and control.',
  },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <section className="py-16 bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900 text-white">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/30 rounded-full px-5 py-2 mb-6">
            <Power className="h-4 w-4 text-emerald-400" />
            <span className="text-sm font-semibold text-emerald-300 uppercase tracking-wide">Off-Grid Power Plants</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-6">About EnerGenius</h1>
          <p className="text-xl text-slate-200 max-w-2xl mx-auto">
            Not a backup system. A self-starting power plant designed for continuous power 
            during grid outages, extreme events, and long-duration disruptions.
          </p>
        </div>
      </section>

      {/* Black Start Technology Section */}
      <section className="py-16 bg-slate-50">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Our Core Technology: <span className="text-emerald-600">Black Start Capability</span>
            </h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              What makes EnerGenius fundamentally different from traditional battery backups? 
              Our systems feature true black start architecture — the ability to initiate power 
              independently when everything else has failed.
            </p>
          </div>

          <div className="bg-gradient-to-br from-slate-900 to-emerald-900 rounded-2xl p-8 text-white mb-12">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-bold mb-4">When Everything Else Is Offline, EnerGenius Comes Online First</h3>
                <p className="text-slate-300 mb-6">
                  Unlike traditional battery backups that require grid voltage or solar input to restart, 
                  EnerGenius systems self-initiate from zero power conditions. This means true energy independence — 
                  not just temporary backup.
                </p>
                <div className="space-y-3">
                  {['No reliance on grid voltage', 'No solar irradiance required', 'Automatic restart after full depletion', 'Immediate partial load support'].map((item) => (
                    <div key={item} className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-emerald-400 flex-shrink-0" />
                      <span className="text-slate-200">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white/10 rounded-xl p-6 border border-emerald-500/30">
                <p className="text-emerald-400 font-semibold text-lg mb-2">The Bottom Line</p>
                <p className="text-2xl font-bold text-white mb-4">
                  "Batteries store energy. EnerGenius creates it."
                </p>
                <p className="text-slate-300 text-sm">
                  This system functions as a standalone power plant, not a temporary backup.
                </p>
              </div>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {blackStartFeatures.map((feature) => (
              <Card key={feature.title} className="border-slate-200 hover:border-emerald-300 transition-colors">
                <CardContent className="p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-100 mb-4">
                    <feature.icon className="h-6 w-6 text-emerald-600" />
                  </div>
                  <h3 className="font-bold text-slate-900 mb-2">{feature.title}</h3>
                  <p className="text-sm text-slate-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
          <p className="text-lg text-gray-700 mb-4">
            EnerGenius, operated by <strong>Renewable Resource Group LLC</strong>, is a trusted authorized reseller 
            committed to delivering professional-grade off-grid power systems at honest prices with exceptional support. 
            We eliminate the frustrations customers experience with other brands through transparent pricing, 
            superior warranty coverage, and responsive U.S.-based customer service.
          </p>
          <p className="text-lg text-gray-700 mb-4">
            Through our strategic partnerships and efficient fulfillment operations, we offer <strong>fast shipping</strong> and 
            competitive pricing on premium power solutions. Every order is carefully coordinated to ensure 
            you receive your equipment quickly and in perfect condition.
          </p>
          <p className="text-lg text-gray-700 mb-4">
            Serving homeowners and businesses nationwide across all 50 US states, we provide complete energy 
            solutions from portable 400W units to commercial-grade 80,000W systems with fast shipping to your location.
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
