'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { 
  Zap, ShieldCheck, AlertTriangle, Building2, Home, Church, 
  Timer, Fuel, Volume2, ArrowRight, CheckCircle, Phone, Calendar,
  Factory, Plug, BatteryCharging, Power, Cpu, Wifi, Thermometer, Gift, Star, Sparkles
} from 'lucide-react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

// Black Start Differentiators
const blackStartFeatures = [
  {
    icon: Power,
    title: 'True Black Start',
    description: 'Self-initiates from zero power. No grid, no solar, no external input required.',
  },
  {
    icon: Cpu,
    title: 'Autonomous Startup',
    description: 'Internal DC bus + inverter boot logic enables independent system recovery.',
  },
  {
    icon: Zap,
    title: 'Instant Partial Load',
    description: 'Supports immediate partial load upon startup — power when you need it.',
  },
  {
    icon: ShieldCheck,
    title: 'Auto-Restart',
    description: 'Automatically restores power after full system depletion.',
  },
]

// Problem statements - what prospects are experiencing
const problems = [
  {
    icon: AlertTriangle,
    title: 'Grid Dependence',
    description: 'Traditional battery backups wait for grid voltage. When the grid is down, they\'re down too.',
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
      {/* Hero Section - Black Start Power Plant Positioning */}
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
            {/* Black Start Badge */}
            <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/30 rounded-full px-5 py-2 mb-6">
              <Power className="h-4 w-4 text-emerald-400" />
              <span className="text-sm font-semibold text-emerald-300 uppercase tracking-wide">True Black Start Power</span>
            </div>
            
            {/* Primary Headline - Core Differentiator */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight px-2">
              When Everything Else Is Offline<br className="hidden sm:block" />
              <span className="text-emerald-400">EnerGenius Comes Online First</span>
            </h1>
            
            <p className="mt-4 sm:mt-6 text-lg sm:text-xl md:text-2xl text-slate-200 max-w-3xl mx-auto px-4 leading-relaxed">
              The only off-grid power system that starts itself from zero. No grid. No solar. No external input required.
            </p>
            
            <p className="mt-4 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto px-4">
              <span className="text-amber-400 font-medium">This isn't a backup system.</span> It's a self-starting power plant for businesses that need certainty.
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

      {/* Nomad 20K Feature Section - Most Popular First */}
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
                  'True black start — self-initiates from zero power',
                  'Silent, zero-emission operation — no noise or fumes',
                  'Zero fuel storage, delivery, or maintenance',
                  'SmartConnect™ cloud monitoring included',
                  'Qualifies for 30% Federal Tax Credit',
                  'Professional installation with Turnkey package',
                ].map((benefit) => (
                  <div key={benefit} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-200">{benefit}</span>
                  </div>
                ))}
              </div>
              
              {/* SmartConnect Badge */}
              <div className="bg-white/10 rounded-lg p-4 mb-8 border border-emerald-500/30">
                <div className="flex items-center gap-3">
                  <Wifi className="h-6 w-6 text-emerald-400" />
                  <div>
                    <p className="font-semibold text-white">SmartConnect™ Included</p>
                    <p className="text-sm text-slate-300">Remote monitoring, load prioritization, and fleet management</p>
                  </div>
                </div>
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

      {/* Featured Promotions Banner - High Visibility */}
      <section className="py-8 sm:py-10 bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            {/* Promo Message */}
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex h-14 w-14 items-center justify-center rounded-full bg-white/30 backdrop-blur">
                <Gift className="h-7 w-7 text-amber-900" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="bg-amber-900 text-white text-xs font-bold px-2 py-0.5 rounded uppercase">Limited Time</span>
                  <h3 className="text-lg sm:text-xl font-bold text-amber-900">3 Months SmartConnect Pro FREE</h3>
                </div>
                <p className="text-amber-800 text-sm mt-1">
                  With any <span className="font-semibold">Nomad Series</span> purchase (5kW+) + Premium Installation • $60 Value
                </p>
              </div>
            </div>
            
            {/* Quick Links */}
            <div className="flex flex-wrap gap-3">
              <Link href="/commercial">
                <Button className="bg-amber-900 hover:bg-amber-950 text-white text-sm font-semibold">
                  <Star className="mr-2 h-4 w-4" />
                  Nomad Series
                </Button>
              </Link>
              <Link href="/subscription">
                <Button variant="outline" className="border-amber-900 text-amber-900 hover:bg-amber-900 hover:text-white text-sm font-semibold">
                  <Wifi className="mr-2 h-4 w-4" />
                  SmartConnect Plans
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Nomad Series Quick Overview */}
      <section className="py-12 sm:py-16 bg-slate-900 text-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-emerald-500/20 rounded-full px-4 py-1.5 mb-4">
              <Sparkles className="h-4 w-4 text-emerald-400" />
              <span className="text-sm font-medium text-emerald-300">Featured Products</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold">
              The <span className="text-emerald-400">Nomad Series</span> — Commercial Off-Grid Power
            </h2>
            <p className="mt-3 text-slate-400 max-w-2xl mx-auto">
              Self-starting power plants for businesses that can't afford downtime. True black start technology.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Nomad 20K */}
            <Link href="/commercial" className="group">
              <Card className="bg-slate-800 border-slate-700 hover:border-emerald-500 transition-all h-full group-hover:shadow-lg group-hover:shadow-emerald-500/20">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="bg-emerald-500 text-white text-xs font-bold px-2 py-1 rounded">Most Popular</span>
                    <span className="text-emerald-400 text-sm font-medium">From $18,750</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Nomad 20K</h3>
                  <p className="text-slate-400 text-sm mb-4">20,000W continuous • 40,000W peak</p>
                  <div className="text-xs text-slate-500">
                    Offices, retail, medical clinics, churches
                  </div>
                  <div className="mt-4 pt-4 border-t border-slate-700 flex items-center text-emerald-400 text-sm font-medium group-hover:text-emerald-300">
                    View Details <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </CardContent>
              </Card>
            </Link>

            {/* Nomad 40K */}
            <Link href="/commercial" className="group">
              <Card className="bg-slate-800 border-slate-700 hover:border-emerald-500 transition-all h-full group-hover:shadow-lg group-hover:shadow-emerald-500/20">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded">High Capacity</span>
                    <span className="text-emerald-400 text-sm font-medium">From $34,500</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Nomad 40K</h3>
                  <p className="text-slate-400 text-sm mb-4">40,000W continuous • 80,000W peak</p>
                  <div className="text-xs text-slate-500">
                    Warehouses, manufacturing, data centers
                  </div>
                  <div className="mt-4 pt-4 border-t border-slate-700 flex items-center text-emerald-400 text-sm font-medium group-hover:text-emerald-300">
                    View Details <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </CardContent>
              </Card>
            </Link>

            {/* Nomad 80K */}
            <Link href="/commercial" className="group">
              <Card className="bg-slate-800 border-slate-700 hover:border-emerald-500 transition-all h-full group-hover:shadow-lg group-hover:shadow-emerald-500/20">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="bg-purple-500 text-white text-xs font-bold px-2 py-1 rounded">Enterprise</span>
                    <span className="text-emerald-400 text-sm font-medium">From $67,500</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Nomad 80K</h3>
                  <p className="text-slate-400 text-sm mb-4">80,000W continuous • 160,000W peak</p>
                  <div className="text-xs text-slate-500">
                    Large facilities, emergency services, EV charging
                  </div>
                  <div className="mt-4 pt-4 border-t border-slate-700 flex items-center text-emerald-400 text-sm font-medium group-hover:text-emerald-300">
                    View Details <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>

          {/* Bundle Promo */}
          <div className="mt-8 bg-gradient-to-r from-emerald-900/50 to-slate-800/50 rounded-xl p-6 border border-emerald-500/30">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <Gift className="h-6 w-6 text-emerald-400" />
                </div>
                <div>
                  <p className="text-white font-semibold">Bundle & Save Up to $7,000</p>
                  <p className="text-slate-400 text-sm">Installation + SmartConnect Pro 3-months free with any Nomad system</p>
                </div>
              </div>
              <Link href="/quote">
                <Button className="bg-emerald-500 hover:bg-emerald-600 text-white">
                  Get Custom Quote
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Black Start Differentiator Section */}
      <section className="py-16 sm:py-20 bg-gradient-to-b from-slate-900 to-slate-800 text-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-amber-500/20 rounded-full px-4 py-1.5 mb-4">
              <Zap className="h-4 w-4 text-amber-400" />
              <span className="text-sm font-medium text-amber-300">Key Differentiator</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold">
              What Is <span className="text-emerald-400">Black Start</span> Capability?
            </h2>
            <p className="mt-4 text-lg text-slate-300 max-w-3xl mx-auto">
              Traditional battery backups require grid voltage or solar input to restart after depletion. 
              EnerGenius systems feature true black start architecture — they initiate power independently, 
              bringing your facility online even when everything else has failed.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {blackStartFeatures.map((feature, index) => (
              <Card key={feature.title} className="bg-slate-800/50 border-slate-700 hover:border-emerald-500/50 transition-colors">
                <CardContent className="p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-500/20 mb-4">
                    <feature.icon className="h-6 w-6 text-emerald-400" />
                  </div>
                  <h3 className="font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-sm text-slate-400">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <p className="text-xl font-semibold text-emerald-400 italic">
              "Batteries store energy. EnerGenius creates it."
            </p>
          </div>
        </div>
      </section>

      {/* Problem Framing Section */}
      <section ref={problemRef} className="py-16 sm:py-20 bg-slate-50">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Why Traditional Backup Power <span className="text-red-600">Falls Short</span>
            </h2>
            <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
              The average business loses $5,600 per minute of downtime. Most backup solutions can't keep up.
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
