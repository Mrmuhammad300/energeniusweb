'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { 
  Building, TrendingUp, Wrench, DollarSign, Power, Zap, Shield,
  CheckCircle, ArrowRight, Wifi, Volume2, Fuel, Factory,
  Thermometer, Truck, Hospital, Church, Building2, Car
} from 'lucide-react'

// Black Start Benefits for Commercial
const blackStartBenefits = [
  {
    icon: Power,
    title: 'True Black Start',
    description: 'Self-initiates from zero power — no grid, no solar, no external input required.',
  },
  {
    icon: Shield,
    title: 'Automatic Recovery',
    description: 'Restores power automatically after full system depletion.',
  },
  {
    icon: Volume2,
    title: 'Silent Operation',
    description: 'Zero noise, zero emissions — no diesel engine disruption.',
  },
  {
    icon: Fuel,
    title: 'Fuel-Free',
    description: 'No fuel storage, no delivery logistics, no maintenance costs.',
  },
]

// Nomad Series Products
const nomadSeries = [
  {
    name: 'Nomad 20K',
    power: '20 kW',
    description: 'Compact, commercial-grade power for businesses that cannot afford downtime.',
    specs: [
      'Rated Output: 20 kW continuous',
      'Scalable energy storage',
      'High surge for motors & HVAC',
      'Indoor or outdoor installation',
    ],
    applications: ['Medical & dental offices', 'Small commercial buildings', 'Refrigeration & cold storage', 'Churches & community facilities'],
    tagline: 'Power for businesses that need certainty.',
    price: 'Starting at $18,750',
    featured: true,
  },
  {
    name: 'Nomad 40K',
    power: '40 kW',
    description: 'Doubles down on resilience for mid-sized facilities with higher continuous output.',
    specs: [
      'Rated Output: 40 kW continuous',
      'Three-phase power options',
      'Expandable battery + solar',
      'Supports larger HVAC & EV loads',
    ],
    applications: ['Multi-tenant commercial buildings', 'Food processing & storage', 'Manufacturing light loads', 'Retail plazas'],
    tagline: 'More load. Same independence. Zero compromise.',
    price: 'Starting at $34,500',
    featured: false,
  },
  {
    name: 'Nomad 80K',
    power: '80 kW',
    description: 'High-capacity black start energy system built for campuses, estates, and critical infrastructure.',
    specs: [
      'Rated Output: 80 kW continuous',
      'Three-phase commercial power',
      'High surge for industrial equipment',
      'Parallel operation & scaling',
    ],
    applications: ['Commercial campuses', 'Industrial facilities', 'Large cold storage', 'EV charging hubs'],
    tagline: "Nomad 80K isn't protection from outages — it's immunity.",
    price: 'Starting at $67,500',
    featured: false,
  },
]

// Ideal Applications with icons
const idealApplications = [
  { icon: Hospital, label: 'Medical & Dental Facilities', description: 'Keep critical equipment running without interruption' },
  { icon: Thermometer, label: 'Cold Storage & Food Logistics', description: 'Protect inventory from temperature excursions' },
  { icon: Building2, label: 'Commercial Buildings & Campuses', description: 'Maintain operations across multi-tenant spaces' },
  { icon: Car, label: 'EV Charging Sites', description: 'Reliable charging even during grid outages' },
  { icon: Church, label: 'Emergency Response & Shelters', description: 'Become the community lifeline during crises' },
  { icon: Factory, label: 'Off-Grid Developments', description: 'Complete energy independence for remote operations' },
]

export default function CommercialPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900">
        <div className="absolute inset-0 z-0 opacity-30">
          <Image
            src="https://www.energy.gov/sites/default/files/2021-06/35502216484_c1b49186db_k.jpg"
            alt="Commercial power systems"
            fill
            className="object-cover"
          />
        </div>
        <div className="relative z-10 text-center text-white px-6 py-16 max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/30 rounded-full px-5 py-2 mb-6">
            <Power className="h-4 w-4 text-emerald-400" />
            <span className="text-sm font-semibold text-emerald-300 uppercase tracking-wide">Off-Grid Power Plants</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            EnerGenius Nomad Series
          </h1>
          <p className="text-xl sm:text-2xl text-slate-200 max-w-3xl mx-auto mb-4">
            Commercial-grade off-grid power systems with true black start capability.
          </p>
          <p className="text-lg text-amber-400 font-medium mb-8">
            This isn't a backup system. It's a self-starting power plant.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/quote">
              <Button size="lg" className="bg-emerald-500 hover:bg-emerald-600 text-white px-8">
                Get Commercial Quote
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/products">
              <Button size="lg" variant="outline" className="border-white/30 bg-white/10 text-white hover:bg-white/20">
                View All Systems
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Black Start Differentiator */}
      <section className="py-16 bg-slate-900 text-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              What Makes <span className="text-emerald-400">Nomad</span> Different?
            </h2>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto">
              Unlike battery backups that wait for the grid, Nomad systems are standalone power plants 
              that start themselves from zero power.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {blackStartBenefits.map((benefit) => (
              <Card key={benefit.title} className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-500/20 mb-4">
                    <benefit.icon className="h-6 w-6 text-emerald-400" />
                  </div>
                  <h3 className="font-bold text-white mb-2">{benefit.title}</h3>
                  <p className="text-sm text-slate-400">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Nomad Product Series */}
      <section className="py-20 bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">The Nomad Series</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Scalable commercial power from 20kW to 80kW. Every system features black start capability, 
              SmartConnect™ monitoring, and zero-emission operation.
            </p>
          </div>

          <div className="space-y-12">
            {nomadSeries.map((product, index) => (
              <Card 
                key={product.name} 
                className={`overflow-hidden ${product.featured ? 'border-2 border-emerald-500 shadow-xl' : 'border border-slate-200'}`}
              >
                {product.featured && (
                  <div className="bg-emerald-500 text-white text-center py-2 text-sm font-semibold">
                    Most Popular Commercial System
                  </div>
                )}
                <CardContent className="p-8">
                  <div className="grid lg:grid-cols-2 gap-8 items-start">
                    {/* Product Info */}
                    <div>
                      <div className="flex items-center gap-4 mb-4">
                        <h3 className="text-3xl font-bold text-slate-900">{product.name}</h3>
                        <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-semibold">
                          {product.power}
                        </span>
                      </div>
                      <p className="text-lg text-slate-600 mb-6">{product.description}</p>
                      
                      {/* Specs */}
                      <div className="mb-6">
                        <h4 className="font-semibold text-slate-900 mb-3">Key Specifications</h4>
                        <div className="grid sm:grid-cols-2 gap-2">
                          {product.specs.map((spec) => (
                            <div key={spec} className="flex items-start gap-2">
                              <CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                              <span className="text-sm text-slate-600">{spec}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* SmartConnect Badge */}
                      <div className="bg-slate-100 rounded-lg p-4 mb-6">
                        <div className="flex items-center gap-3">
                          <Wifi className="h-5 w-5 text-emerald-600" />
                          <div>
                            <p className="font-semibold text-slate-900">SmartConnect™ Included</p>
                            <p className="text-sm text-slate-600">Remote start/stop, real-time monitoring, load prioritization</p>
                          </div>
                        </div>
                      </div>

                      <p className="text-emerald-600 font-semibold italic mb-6">{product.tagline}</p>
                      
                      <div className="flex items-center gap-4">
                        <span className="text-2xl font-bold text-slate-900">{product.price}</span>
                        <Link href="/quote">
                          <Button className="bg-emerald-600 hover:bg-emerald-700">
                            Get Quote
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </div>

                    {/* Applications */}
                    <div className="bg-slate-50 rounded-xl p-6">
                      <h4 className="font-semibold text-slate-900 mb-4">Ideal Applications</h4>
                      <div className="space-y-3">
                        {product.applications.map((app) => (
                          <div key={app} className="flex items-center gap-3 bg-white rounded-lg p-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100">
                              <CheckCircle className="h-4 w-4 text-emerald-600" />
                            </div>
                            <span className="text-slate-700">{app}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Ideal Applications Section */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Built For Critical Operations</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              EnerGenius powers facilities where downtime isn't an option.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {idealApplications.map((app) => (
              <Card key={app.label} className="hover:shadow-lg transition-shadow border-slate-200">
                <CardContent className="p-6">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-emerald-100 mb-4">
                    <app.icon className="h-7 w-7 text-emerald-600" />
                  </div>
                  <h3 className="font-bold text-slate-900 mb-2">{app.label}</h3>
                  <p className="text-sm text-slate-600">{app.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Tax Credit & ROI Section */}
      <section className="py-16 bg-slate-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-6">
                Financial Advantages for Businesses
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 flex-shrink-0">
                    <TrendingUp className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">30% Federal Tax Credit</h3>
                    <p className="text-slate-600">All Nomad systems qualify for the Investment Tax Credit through 2032.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 flex-shrink-0">
                    <DollarSign className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">Accelerated Depreciation</h3>
                    <p className="text-slate-600">MACRS depreciation provides additional tax benefits for business owners.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 flex-shrink-0">
                    <Shield className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">Eliminate Downtime Costs</h3>
                    <p className="text-slate-600">Average business loses $5,600/minute during outages. Nomad pays for itself.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-emerald-600 rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">You're Not Buying Hardware</h3>
              <p className="text-emerald-50 text-lg mb-6">
                You're owning energy control. EnerGenius Nomad systems function as standalone power plants, 
                not temporary backups. When everything else is offline, you're online.
              </p>
              <div className="border-t border-emerald-500 pt-6">
                <p className="font-semibold text-emerald-100 mb-2">Standards Compliance</p>
                <p className="text-sm text-emerald-200">IEEE 1547 / UL 1741 / UL 9540</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Ready for Grid Independence?
          </h2>
          <p className="text-xl text-emerald-50 mb-8 max-w-2xl mx-auto">
            Get a customized assessment for your facility. Our team will help you size the right 
            Nomad system for your power requirements and budget.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/quote">
              <Button size="lg" className="bg-white text-emerald-700 hover:bg-slate-100 px-10 py-6 text-lg font-semibold">
                Request Commercial Quote
              </Button>
            </Link>
            <Link href="/education">
              <Button size="lg" variant="outline" className="border-white/30 bg-white/10 text-white hover:bg-white/20 px-10 py-6">
                Learn About Black Start
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
