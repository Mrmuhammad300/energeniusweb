'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { 
  Zap, ShieldCheck, AlertTriangle, Building2, Home, Church, 
  Timer, Fuel, Volume2, ArrowRight, CheckCircle, Phone, Calendar,
  Factory, Plug, BatteryCharging
} from 'lucide-react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

// Problem statements - what prospects are experiencing
const problems = [
  {
    icon: AlertTriangle,
    title: 'Unexpected Outages',
    description: 'Texas grid failures, Ohio ice storms, Arizona monsoons - power outages cost businesses thousands per hour.',
    color: 'text-red-500',
  },
  {
    icon: Fuel,
    title: 'Diesel Headaches',
    description: 'Fuel storage, maintenance costs, and diesel generators that fail when you need them most.',
    color: 'text-orange-500',
  },
  {
    icon: Volume2,
    title: 'Noise & Fumes',
    description: 'Traditional generators disrupt your business, annoy neighbors, and require ventilation.',
    color: 'text-yellow-600',
  },
  {
    icon: Timer,
    title: 'Downtime Losses',
    description: 'Every minute without power means lost revenue, spoiled inventory, or critical system failures.',
    color: 'text-purple-500',
  },
]

// Who this is for
const audiences = [
  {
    icon: Building2,
    title: 'Commercial Buildings',
    examples: 'Offices, retail stores, warehouses',
  },
  {
    icon: Church,
    title: 'Churches & Non-Profits',
    examples: 'Community centers, shelters, event spaces',
  },
  {
    icon: Home,
    title: 'Property Owners',
    examples: 'Multi-family, rental properties, HOAs',
  },
  {
    icon: Factory,
    title: 'Light Industrial',
    examples: 'Workshops, food service, medical offices',
  },
]

// Nomad 20K key specs
const nomadSpecs = [
  { label: 'Continuous Power', value: '20,000W' },
  { label: 'Peak Power', value: '40,000W' },
  { label: 'Battery Capacity', value: '400 Amp Hours' },
  { label: 'Life Cycles', value: '8,000 cycles' },
  { label: 'Voltage Output', value: '120/240V AC' },
  { label: 'Warranty', value: '5 Years' },
]

// Social proof
const useCases = [
  {
    quote: 'After the Texas freeze, our church became an emergency shelter. The Nomad 20K kept us running for 4 days straight while the grid was down.',
    author: 'Pastor Williams',
    location: 'Houston, TX',
    type: 'Church',
  },
  {
    quote: 'We lost $15,000 in one outage before getting our backup system. Now our cold storage stays at temp no matter what. Worth every penny.',
    author: 'Marcus Chen',
    location: 'Columbus, OH',
    type: 'Restaurant Owner',
  },
  {
    quote: 'The monsoon season used to mean crossing our fingers. Now our medical equipment stays powered and my patients stay safe.',
    author: 'Dr. Sarah Martinez',
    location: 'Phoenix, AZ',
    type: 'Medical Clinic',
  },
]

export default function HomePage() {
  const [heroRef, heroInView] = useInView({ triggerOnce: true, threshold: 0.1 })
  const [problemRef, problemInView] = useInView({ triggerOnce: true, threshold: 0.1 })
  const [solutionRef, solutionInView] = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <div className="flex flex-col">
      {/* Hero Section - Outcome-Based Messaging */}
      <section
        ref={heroRef}
        className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900"
      >
        <div className="absolute inset-0 z-0 opacity-30">
          <Image
            src="https://www.energy.gov/sites/default/files/2021-06/35502216484_c1b49186db_k.jpg"
            alt="Commercial backup power"
            fill
            className="object-cover"
            priority
          />
        </div>
        
        <div className="relative z-10 w-full mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8 }}
            className="w-full"
          >
            {/* Problem-Solution Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight px-2">
              Your Business Never Stops<br className="hidden sm:block" />
              <span className="text-emerald-400">Even When the Grid Does</span>
            </h1>
            
            <p className="mt-4 sm:mt-6 text-lg sm:text-xl md:text-2xl text-slate-200 max-w-3xl mx-auto px-4 leading-relaxed">
              Stay online and productive with silent, fuel-free power that eliminates downtime automatically.
            </p>
            
            <p className="mt-4 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto px-4">
              Commercial-grade lithium backup systems sized, installed, and monitored for real-world use.
            </p>

            {/* Primary CTA */}
            <div className="mt-8 sm:mt-10 flex flex-col items-center gap-4 px-4">
              <Link href="/quote" className="w-full sm:w-auto">
                <Button 
                  size="lg" 
                  className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-600 text-white text-base sm:text-lg px-8 py-6 rounded-xl shadow-lg shadow-emerald-500/30 font-semibold"
                >
                  <Calendar className="mr-2 h-5 w-5" />
                  Book a Free Power Resilience Assessment
                </Button>
              </Link>
              <p className="text-sm text-slate-400">
                Free • No obligation • Discover your backup power needs
              </p>
            </div>

            {/* Trust indicators */}
            <div className="mt-8 flex flex-wrap justify-center gap-6 text-slate-300 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-emerald-400" />
                <span>5-Year Warranty</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-emerald-400" />
                <span>30% Federal Tax Credit</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-emerald-400" />
                <span>Professional Installation</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Problem Framing Section */}
      <section ref={problemRef} className="py-16 sm:py-20 bg-slate-50">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Power Outages Aren't Just Inconvenient. <span className="text-red-600">They're Expensive.</span>
            </h2>
            <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
              The average business loses $5,600 per minute of downtime. Is your backup plan ready?
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {problems.map((problem, index) => (
              <motion.div
                key={problem.title}
                initial={{ opacity: 0, y: 20 }}
                animate={problemInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full border-2 border-slate-200 hover:border-red-200 transition-colors bg-white">
                  <CardContent className="p-6">
                    <problem.icon className={`h-10 w-10 mb-4 ${problem.color}`} />
                    <h3 className="font-bold text-slate-900 mb-2">{problem.title}</h3>
                    <p className="text-sm text-slate-600">{problem.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Who It's For */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-emerald-600 font-semibold text-sm uppercase tracking-wide mb-3">
              Stay Online, Stay Productive. No Fuel. No Noise. No Downtime.
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Built For Organizations That Can't Afford Downtime
            </h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {audiences.map((audience) => (
              <div key={audience.title} className="text-center p-6 rounded-xl bg-slate-50 hover:bg-emerald-50 transition-colors">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 mb-4">
                  <audience.icon className="h-8 w-8 text-emerald-600" />
                </div>
                <h3 className="font-bold text-slate-900 mb-1">{audience.title}</h3>
                <p className="text-sm text-slate-500">{audience.examples}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Nomad 20K Feature Section */}
      <section ref={solutionRef} className="py-16 sm:py-24 bg-gradient-to-br from-emerald-900 to-slate-900 text-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={solutionInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 bg-emerald-500/20 rounded-full px-4 py-1.5 mb-6">
                <Zap className="h-4 w-4 text-emerald-400" />
                <span className="text-sm font-medium text-emerald-300">Our Most Popular Commercial System</span>
              </div>
              
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                EnerGenius Nomad 20K
              </h2>
              
              <p className="text-lg text-slate-300 mb-8 leading-relaxed">
                The reference standard for commercial backup power. 20,000 watts of clean, silent power 
                that runs for days—not hours. No fuel, no fumes, no noise complaints.
              </p>

              {/* Key Specs Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
                {nomadSpecs.map((spec) => (
                  <div key={spec.label} className="bg-white/10 rounded-lg p-4">
                    <p className="text-2xl font-bold text-emerald-400">{spec.value}</p>
                    <p className="text-sm text-slate-400">{spec.label}</p>
                  </div>
                ))}
              </div>

              {/* Benefits */}
              <div className="space-y-3 mb-8">
                {[
                  'Continuous power with black start capability',
                  'Silent operation—no noise complaints',
                  'Zero fuel storage or maintenance',
                  'Qualifies for 30% Federal Tax Credit',
                  'Professional installation included with Turnkey package',
                ].map((benefit) => (
                  <div key={benefit} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-200">{benefit}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/quote">
                  <Button size="lg" className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-600 text-white px-8">
                    Get Your Assessment
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/products">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto border-emerald-300 bg-emerald-800/50 text-white hover:bg-emerald-800">
                    See All Systems
                  </Button>
                </Link>
              </div>
            </motion.div>

            {/* Image */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={solutionInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="relative aspect-square rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="https://powerxgenerators.com/wp-content/uploads/2021/09/Hnet.com-image-500x375.jpg"
                  alt="EnerGenius Nomad 20K Commercial Solar Generator"
                  fill
                  className="object-cover"
                />
              </div>
              {/* Price badge */}
              <div className="absolute -bottom-4 -right-4 bg-white text-slate-900 rounded-xl shadow-xl p-4">
                <p className="text-sm text-slate-500">Starting at</p>
                <p className="text-2xl font-bold text-emerald-600">$18,750</p>
                <p className="text-xs text-slate-400">Tax credit eligible</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Installation Options */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Two Ways to Get Started
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              From DIY setup to complete turnkey installation
            </p>
          </div>

          {/* Bundle Savings Banner */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-8 max-w-4xl mx-auto">
            <p className="text-center text-amber-800 font-medium">
              <span className="font-bold">🎉 Bundle & Save!</span> Get discounted installation when you purchase a 5,000W+ generator
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Quick Start */}
            <Card className="border-2 hover:border-emerald-200 transition-colors">
              <CardContent className="p-8">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-slate-100 mb-6">
                  <Plug className="h-7 w-7 text-slate-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Quick Start Install</h3>
                <div className="mb-4">
                  <span className="text-slate-400 line-through text-lg">$3,499</span>
                  <span className="text-emerald-600 font-bold text-2xl ml-2">$399</span>
                  <span className="text-xs text-slate-500 block mt-1">with 5kW+ generator purchase</span>
                </div>
                <p className="text-slate-600 mb-6">
                  Perfect if you have a licensed electrician. We deliver, you handle installation.
                </p>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-500" />
                    System delivery & setup guidance
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-500" />
                    Remote technical support
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-500" />
                    Installation documentation
                  </li>
                </ul>
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <p className="text-xs text-emerald-600 font-semibold">Save $3,100 with bundle!</p>
                </div>
              </CardContent>
            </Card>

            {/* Turnkey - Emphasized */}
            <Card className="border-2 border-emerald-500 bg-emerald-50 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-emerald-500 text-white text-sm font-semibold px-4 py-1 rounded-full">
                  Most Popular
                </span>
              </div>
              <CardContent className="p-8">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-emerald-100 mb-6">
                  <ShieldCheck className="h-7 w-7 text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Turnkey Installation</h3>
                <div className="mb-4">
                  <span className="text-slate-400 line-through text-lg">$5,999</span>
                  <span className="text-emerald-600 font-bold text-2xl ml-2">$2,499</span>
                  <span className="text-xs text-slate-500 block mt-1">with 5kW+ generator purchase</span>
                </div>
                <p className="text-slate-600 mb-6">
                  We handle everything. Site audit, permits, professional installation, and commissioning.
                </p>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-600" />
                    Complete site assessment
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-600" />
                    Professional installation
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-600" />
                    Permit coordination
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-600" />
                    System commissioning & training
                  </li>
                </ul>
                <div className="mt-4 pt-4 border-t border-emerald-200">
                  <p className="text-xs text-emerald-700 font-semibold">Save $3,500 with bundle!</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-16 sm:py-20 bg-slate-50">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Real Businesses. Real Results.
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {useCases.map((useCase, index) => (
              <Card key={index} className="border-0 shadow-lg bg-white">
                <CardContent className="p-6">
                  <div className="mb-4">
                    <span className="inline-block bg-emerald-100 text-emerald-700 text-xs font-semibold px-3 py-1 rounded-full">
                      {useCase.type}
                    </span>
                  </div>
                  <p className="text-slate-700 italic mb-6">"{useCase.quote}"</p>
                  <div className="border-t pt-4">
                    <p className="font-semibold text-slate-900">{useCase.author}</p>
                    <p className="text-sm text-slate-500">{useCase.location}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 sm:py-24 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Don't Wait for the Next Outage
          </h2>
          <p className="text-xl text-emerald-50 mb-8 max-w-2xl mx-auto">
            A 15-minute assessment will tell you exactly what size system your building needs 
            and what it will cost—no pressure, no obligation.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/quote">
              <Button 
                size="lg" 
                className="bg-white text-emerald-700 hover:bg-slate-100 px-10 py-7 text-lg font-semibold rounded-xl"
              >
                <Calendar className="mr-2 h-5 w-5" />
                Get a 15-Minute Energy Assessment
              </Button>
            </Link>
          </div>
          
          <p className="mt-6 text-emerald-100 text-sm">
            Or call us directly: <a href="tel:+18005551234" className="underline font-semibold">1-800-555-1234</a>
          </p>
        </div>
      </section>
    </div>
  )
}
