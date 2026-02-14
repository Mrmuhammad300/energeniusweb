'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Zap, ShieldCheck, AlertTriangle, Building2, Home, Church,
  Timer, Fuel, Volume2, ArrowRight, CheckCircle, Phone, Calendar,
  Factory, Plug, BatteryCharging, Power, Cpu, Wifi, Thermometer,
  Gift, Star, Sparkles, Globe, Activity, Shield, Battery,
  Sun, Wind, Monitor, Signal, ChevronRight, Award, TrendingUp
} from 'lucide-react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { useRef, useState, useEffect } from 'react'

// ═══════════════════════════════════════════════════════════════
// DATA: Black Start Features
// ═══════════════════════════════════════════════════════════════
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

// ═══════════════════════════════════════════════════════════════
// DATA: Problem statements
// ═══════════════════════════════════════════════════════════════
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

// ═══════════════════════════════════════════════════════════════
// DATA: Audience segments
// ═══════════════════════════════════════════════════════════════
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

// ═══════════════════════════════════════════════════════════════
// DATA: Nomad Series — Ideal Application Comparison
// ═══════════════════════════════════════════════════════════════
const nomadModels = [
  {
    name: 'Nomad 20K',
    badge: 'Most Popular',
    badgeColor: 'bg-eg-lime text-eg-forest-dark',
    price: '$18,750',
    afterCredit: '$13,125',
    continuous: '20,000W',
    peak: '40,000W',
    battery: '400 Ah',
    cycles: '8,000',
    voltage: '120/240V AC',
    weight: '425 lbs',
    solarController: '160A',
    outlets: '8 AC / 2 DC / 4 USB',
    warranty: '5 Years',
    idealFor: ['Offices & Retail', 'Medical Clinics', 'Churches', 'Restaurants'],
    featured: true,
  },
  {
    name: 'Nomad 40K',
    badge: 'High Capacity',
    badgeColor: 'bg-eg-teal-light text-white',
    price: '$34,500',
    afterCredit: '$24,150',
    continuous: '40,000W',
    peak: '80,000W',
    battery: '800 Ah',
    cycles: '8,000',
    voltage: '120/240V AC',
    weight: '1,100 lbs',
    solarController: '320A',
    outlets: '16 AC / 4 DC / 8 USB',
    warranty: '5 Years',
    idealFor: ['Warehouses', 'Manufacturing', 'Data Centers', 'Multi-Tenant'],
    featured: false,
  },
  {
    name: 'Nomad 80K',
    badge: 'Enterprise',
    badgeColor: 'bg-purple-600 text-white',
    price: '$67,500',
    afterCredit: '$47,250',
    continuous: '80,000W',
    peak: '160,000W',
    battery: '1,600 Ah',
    cycles: '8,000',
    voltage: '120/240V AC',
    weight: '2,200 lbs',
    solarController: '640A',
    outlets: '32 AC / 8 DC / 16 USB',
    warranty: '5 Years',
    idealFor: ['Large Facilities', 'Emergency Services', 'EV Charging', 'Campus Power'],
    featured: false,
  },
]

// ═══════════════════════════════════════════════════════════════
// DATA: Nomad 20K Key Specs
// ═══════════════════════════════════════════════════════════════
const nomadSpecs = [
  { label: 'Continuous Power', value: '20,000W', icon: Zap },
  { label: 'Peak Power', value: '40,000W', icon: TrendingUp },
  { label: 'Battery Capacity', value: '400 Ah', icon: Battery },
  { label: 'Life Cycles', value: '8,000', icon: Activity },
  { label: 'Voltage Output', value: '120/240V', icon: Plug },
  { label: 'Warranty', value: '5 Years', icon: Shield },
]

// ═══════════════════════════════════════════════════════════════
// DATA: SmartConnect Features
// ═══════════════════════════════════════════════════════════════
const smartConnectFeatures = [
  {
    icon: Monitor,
    title: 'Real-Time Dashboard',
    description: 'Monitor power output, battery levels, and load distribution from any device.',
  },
  {
    icon: Signal,
    title: 'Remote Diagnostics',
    description: 'Proactive alerts, fault detection, and remote troubleshooting capabilities.',
  },
  {
    icon: Activity,
    title: 'Load Prioritization',
    description: 'Intelligent load management ensures critical circuits stay powered first.',
  },
  {
    icon: Globe,
    title: 'Fleet Management',
    description: 'Manage multiple units across locations from a single command center.',
  },
]

// ═══════════════════════════════════════════════════════════════
// DATA: Social proof
// ═══════════════════════════════════════════════════════════════
const useCases = [
  {
    quote: 'After the Texas freeze, our church became an emergency shelter. The Nomad 20K kept us running for 4 days straight while the grid was down.',
    author: 'Pastor Williams',
    location: 'Houston, TX',
    type: 'Church',
    rating: 5,
  },
  {
    quote: 'We lost $15,000 in one outage before getting our backup system. Now our cold storage stays at temp no matter what. Worth every penny.',
    author: 'Marcus Chen',
    location: 'Columbus, OH',
    type: 'Restaurant Owner',
    rating: 5,
  },
  {
    quote: 'The monsoon season used to mean crossing our fingers. Now our medical equipment stays powered and my patients stay safe.',
    author: 'Dr. Sarah Martinez',
    location: 'Phoenix, AZ',
    type: 'Medical Clinic',
    rating: 5,
  },
]

// ═══════════════════════════════════════════════════════════════
// COMPONENT: SmartConnect Globe (SVG-based)
// ═══════════════════════════════════════════════════════════════
function SmartConnectGlobe() {
  return (
    <div className="relative w-64 h-64 mx-auto globe-container">
      <svg viewBox="0 0 200 200" className="w-full h-full animate-globe-rotate" style={{ transformOrigin: 'center center' }}>
        {/* Globe outline */}
        <circle cx="100" cy="100" r="80" fill="none" stroke="#1A5D1A" strokeWidth="1" opacity="0.4" />
        <ellipse cx="100" cy="100" rx="80" ry="30" fill="none" stroke="#1A5D1A" strokeWidth="0.5" opacity="0.3" />
        <ellipse cx="100" cy="100" rx="30" ry="80" fill="none" stroke="#1A5D1A" strokeWidth="0.5" opacity="0.3" />
        <ellipse cx="100" cy="100" rx="55" ry="80" fill="none" stroke="#1A5D1A" strokeWidth="0.5" opacity="0.2" />

        {/* Latitude lines */}
        <ellipse cx="100" cy="65" rx="72" ry="15" fill="none" stroke="#1A5D1A" strokeWidth="0.5" opacity="0.2" />
        <ellipse cx="100" cy="135" rx="72" ry="15" fill="none" stroke="#1A5D1A" strokeWidth="0.5" opacity="0.2" />

        {/* Network nodes */}
        <circle cx="75" cy="70" r="4" fill="#BADA55" className="animate-node-pulse" style={{ animationDelay: '0s' }} />
        <circle cx="130" cy="85" r="3" fill="#BADA55" className="animate-node-pulse" style={{ animationDelay: '0.5s' }} />
        <circle cx="90" cy="120" r="3.5" fill="#BADA55" className="animate-node-pulse" style={{ animationDelay: '1s' }} />
        <circle cx="55" cy="100" r="2.5" fill="#BADA55" className="animate-node-pulse" style={{ animationDelay: '1.5s' }} />
        <circle cx="145" cy="110" r="3" fill="#BADA55" className="animate-node-pulse" style={{ animationDelay: '0.7s' }} />
        <circle cx="110" cy="60" r="2.5" fill="#BADA55" className="animate-node-pulse" style={{ animationDelay: '1.2s' }} />
        <circle cx="70" cy="140" r="3" fill="#BADA55" className="animate-node-pulse" style={{ animationDelay: '0.3s' }} />
        <circle cx="120" cy="135" r="2" fill="#BADA55" className="animate-node-pulse" style={{ animationDelay: '0.9s' }} />

        {/* Connection lines */}
        <line x1="75" y1="70" x2="130" y2="85" stroke="#BADA55" strokeWidth="0.5" opacity="0.4" />
        <line x1="130" y1="85" x2="145" y2="110" stroke="#BADA55" strokeWidth="0.5" opacity="0.3" />
        <line x1="75" y1="70" x2="55" y2="100" stroke="#BADA55" strokeWidth="0.5" opacity="0.4" />
        <line x1="90" y1="120" x2="70" y2="140" stroke="#BADA55" strokeWidth="0.5" opacity="0.3" />
        <line x1="110" y1="60" x2="130" y2="85" stroke="#BADA55" strokeWidth="0.5" opacity="0.4" />
        <line x1="90" y1="120" x2="120" y2="135" stroke="#BADA55" strokeWidth="0.5" opacity="0.3" />
        <line x1="55" y1="100" x2="90" y2="120" stroke="#BADA55" strokeWidth="0.5" opacity="0.4" />
        <line x1="145" y1="110" x2="120" y2="135" stroke="#BADA55" strokeWidth="0.5" opacity="0.3" />

        {/* Outer glow ring */}
        <circle cx="100" cy="100" r="85" fill="none" stroke="#BADA55" strokeWidth="0.5" opacity="0.15" />
        <circle cx="100" cy="100" r="90" fill="none" stroke="#BADA55" strokeWidth="0.3" opacity="0.08" />
      </svg>

      {/* Central glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-20 h-20 rounded-full bg-eg-lime/10 blur-xl" />
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// COMPONENT: Animated Counter
// ═══════════════════════════════════════════════════════════════
function AnimatedStat({ value, label, suffix = '' }: { value: string; label: string; suffix?: string }) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.3 })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.6 }}
      className="text-center"
    >
      <p className="text-3xl sm:text-4xl font-bold text-eg-lime">{value}{suffix}</p>
      <p className="text-sm text-slate-400 mt-1">{label}</p>
    </motion.div>
  )
}

// ═══════════════════════════════════════════════════════════════
// MAIN PAGE COMPONENT
// ═══════════════════════════════════════════════════════════════
export default function HomePage() {
  const [heroRef, heroInView] = useInView({ triggerOnce: true, threshold: 0.1 })
  const [problemRef, problemInView] = useInView({ triggerOnce: true, threshold: 0.1 })
  const [solutionRef, solutionInView] = useInView({ triggerOnce: true, threshold: 0.1 })
  const [pricingRef, pricingInView] = useInView({ triggerOnce: true, threshold: 0.05 })
  const [smartRef, smartInView] = useInView({ triggerOnce: true, threshold: 0.1 })

  const morphRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: morphRef, offset: ['start end', 'end start'] })
  const morphScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1, 1.05])
  const morphOpacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.5, 1, 1, 0.5])

  return (
    <div className="flex flex-col">
      {/* ═══════════════════════════════════════════════════════ */}
      {/* HERO: "Black Start" Cinematic Section                  */}
      {/* ═══════════════════════════════════════════════════════ */}
      <section
        ref={heroRef}
        className="relative min-h-[90vh] flex items-center justify-center overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #0a0a0a 0%, #0d1f0d 30%, #1A5D1A 60%, #0a0a0a 100%)',
        }}
      >
        {/* Animated grid background */}
        <div className="absolute inset-0 z-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `
                linear-gradient(rgba(186, 218, 85, 0.3) 1px, transparent 1px),
                linear-gradient(90deg, rgba(186, 218, 85, 0.3) 1px, transparent 1px)
              `,
              backgroundSize: '60px 60px',
            }}
          />
        </div>

        {/* Radial glow */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-eg-forest/20 blur-[120px]" />
          <div className="absolute top-1/4 right-1/4 w-[300px] h-[300px] rounded-full bg-eg-lime/5 blur-[80px]" />
        </div>

        <div className="relative z-10 w-full mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="w-full"
          >
            {/* Black Start Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={heroInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-eg-lime/10 border border-eg-lime/30 rounded-full px-6 py-2.5 mb-8 animate-pulse-glow"
            >
              <Power className="h-4 w-4 text-eg-lime" />
              <span className="text-sm font-semibold text-eg-lime uppercase tracking-wider">True Black Start Technology</span>
            </motion.div>

            {/* Primary Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.1]">
              When Everything Else
              <br className="hidden sm:block" />
              Is Offline,{' '}
              <span className="eg-gradient-text">
                EnerGenius
              </span>
              <br />
              <span className="text-eg-lime">Comes Online First</span>
            </h1>

            <p className="mt-6 sm:mt-8 text-lg sm:text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              The only off-grid power system that starts itself from zero.
              <br className="hidden sm:block" />
              No grid. No solar. No external input required.
            </p>

            <p className="mt-4 text-base sm:text-lg text-slate-400 max-w-2xl mx-auto">
              <span className="text-eg-gold font-semibold">This isn&apos;t a backup system.</span>{' '}
              It&apos;s a self-starting power plant for businesses that need certainty.
            </p>

            {/* Primary CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mt-10 sm:mt-12 flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link href="/quote">
                <Button
                  size="lg"
                  className="bg-eg-lime hover:bg-eg-lime-dark text-eg-forest-dark text-base sm:text-lg px-10 py-7 rounded-xl shadow-lg shadow-eg-lime/20 font-bold transition-all hover:shadow-eg-lime/40 hover:scale-[1.02]"
                >
                  <Calendar className="mr-2 h-5 w-5" />
                  Book Free Power Assessment
                </Button>
              </Link>
              <Link href="/products">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-eg-lime/40 text-eg-lime hover:bg-eg-lime/10 text-base px-8 py-7 rounded-xl"
                >
                  Explore All Systems
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </motion.div>

            {/* Trust indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={heroInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="mt-10 flex flex-wrap justify-center gap-8 text-slate-300 text-sm"
            >
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-eg-lime" />
                <span>5-Year Warranty</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-eg-lime" />
                <span>30% Federal Tax Credit</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-eg-lime" />
                <span>Professional Installation</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-eg-lime" />
                <span>SmartConnect&trade; Monitoring</span>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/60 to-transparent z-10" />
      </section>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* STATS BAR                                              */}
      {/* ═══════════════════════════════════════════════════════ */}
      <section className="py-10 bg-gradient-to-r from-eg-forest-dark via-eg-forest to-eg-forest-dark border-y border-eg-lime/20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <AnimatedStat value="8,000" suffix="+" label="Battery Life Cycles" />
            <AnimatedStat value="30" suffix="%" label="Federal Tax Credit" />
            <AnimatedStat value="0" label="Emissions & Noise" />
            <AnimatedStat value="24/7" label="SmartConnect Monitoring" />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* NOMAD 20K: Featured Product — "Black Start" Showcase   */}
      {/* ═══════════════════════════════════════════════════════ */}
      <section ref={solutionRef} className="py-20 sm:py-28 bg-gradient-to-br from-[#0a0a0a] via-[#0d1f0d] to-[#0a0a0a] text-white overflow-hidden">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={solutionInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 bg-eg-lime/10 border border-eg-lime/20 rounded-full px-4 py-1.5 mb-6">
                <Star className="h-4 w-4 text-eg-lime" />
                <span className="text-sm font-medium text-eg-lime">Our Most Popular Commercial System</span>
              </div>

              <h2 className="text-4xl sm:text-5xl font-bold mb-2">
                EnerGenius{' '}
                <span className="text-eg-lime">Nomad 20K</span>
              </h2>
              <p className="text-eg-gold font-medium mb-6">True Black Start Solar Generator</p>

              <p className="text-lg text-slate-300 mb-10 leading-relaxed">
                The reference standard for commercial backup power. 20,000 watts of clean, silent power
                that runs for days — not hours. No fuel, no fumes, no noise complaints.
              </p>

              {/* Key Specs Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-10">
                {nomadSpecs.map((spec) => (
                  <div key={spec.label} className="eg-glass-dark rounded-xl p-4 hover:border-eg-lime/40 transition-colors">
                    <spec.icon className="h-5 w-5 text-eg-lime mb-2" />
                    <p className="text-xl font-bold text-white">{spec.value}</p>
                    <p className="text-xs text-slate-400 mt-1">{spec.label}</p>
                  </div>
                ))}
              </div>

              {/* Benefits */}
              <div className="space-y-3 mb-10">
                {[
                  'True black start — self-initiates from zero power',
                  'Silent, zero-emission operation — no noise or fumes',
                  'Zero fuel storage, delivery, or maintenance',
                  'SmartConnect\u2122 cloud monitoring included',
                  'Qualifies for 30% Federal Tax Credit',
                  'Professional installation with Turnkey package',
                ].map((benefit) => (
                  <div key={benefit} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-eg-lime mt-0.5 flex-shrink-0" />
                    <span className="text-slate-200">{benefit}</span>
                  </div>
                ))}
              </div>

              {/* SmartConnect Badge */}
              <div className="eg-glass-dark rounded-xl p-5 mb-10">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-eg-lime/10 flex items-center justify-center flex-shrink-0">
                    <Wifi className="h-6 w-6 text-eg-lime" />
                  </div>
                  <div>
                    <p className="font-bold text-white">SmartConnect&trade; Included</p>
                    <p className="text-sm text-slate-300">Remote monitoring, load prioritization, and fleet management</p>
                    <p className="text-xs text-eg-gold mt-1 font-medium">3 months Pro tier FREE with purchase</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/quote">
                  <Button size="lg" className="w-full sm:w-auto bg-eg-lime hover:bg-eg-lime-dark text-eg-forest-dark px-8 font-bold">
                    Get Your Assessment
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/products">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto border-eg-lime/30 text-eg-lime hover:bg-eg-lime/10">
                    See All Systems
                  </Button>
                </Link>
              </div>
            </motion.div>

            {/* Product Image + Price Badge */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={solutionInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative aspect-square rounded-3xl overflow-hidden shadow-2xl shadow-eg-forest/30 border border-eg-lime/10">
                <Image
                  src="https://powerxgenerators.com/wp-content/uploads/2021/09/Hnet.com-image-500x375.jpg"
                  alt="EnerGenius Nomad 20K Commercial Solar Generator"
                  fill
                  className="object-cover"
                />
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                {/* Product label overlay */}
                <div className="absolute bottom-6 left-6 right-6">
                  <p className="text-eg-lime font-bold text-lg">EnerGenius Nomad 20K</p>
                  <p className="text-slate-300 text-sm">True Black Start Solar Generator</p>
                </div>
              </div>

              {/* Price badge */}
              <div className="absolute -bottom-6 -right-4 bg-white rounded-2xl shadow-2xl p-5 border border-slate-100">
                <p className="text-xs text-slate-500 uppercase tracking-wide font-medium">Starting at</p>
                <p className="text-3xl font-bold text-eg-forest">$18,750</p>
                <p className="text-sm text-eg-lime-dark font-semibold">$13,125 after tax credit*</p>
              </div>

              {/* Floating specs */}
              <motion.div
                className="absolute -top-4 -left-4 bg-eg-forest rounded-xl p-3 shadow-lg animate-float"
                style={{ animationDelay: '0s' }}
              >
                <p className="text-eg-lime text-xs font-bold">20,000W</p>
                <p className="text-white/70 text-[10px]">Continuous</p>
              </motion.div>

              <motion.div
                className="absolute top-1/3 -right-4 bg-eg-forest rounded-xl p-3 shadow-lg animate-float"
                style={{ animationDelay: '2s' }}
              >
                <p className="text-eg-lime text-xs font-bold">8,000</p>
                <p className="text-white/70 text-[10px]">Life Cycles</p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* PROMO BANNER: SmartConnect + Bundle                    */}
      {/* ═══════════════════════════════════════════════════════ */}
      <section className="py-6 sm:py-8" style={{ background: 'linear-gradient(90deg, #F5B932, #F9C841, #BADA55)' }}>
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex h-12 w-12 items-center justify-center rounded-full bg-white/30 backdrop-blur">
                <Gift className="h-6 w-6 text-eg-forest-dark" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="bg-eg-forest-dark text-white text-xs font-bold px-2.5 py-0.5 rounded uppercase tracking-wide">Limited Time</span>
                  <h3 className="text-lg font-bold text-eg-forest-dark">3 Months SmartConnect Pro FREE</h3>
                </div>
                <p className="text-eg-forest text-sm mt-0.5">
                  With any <span className="font-semibold">Nomad Series</span> purchase (5kW+) + Premium Installation
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link href="/commercial">
                <Button className="bg-eg-forest-dark hover:bg-eg-forest text-white text-sm font-semibold">
                  <Star className="mr-2 h-4 w-4" />
                  Nomad Series
                </Button>
              </Link>
              <Link href="/subscription">
                <Button variant="outline" className="border-eg-forest-dark text-eg-forest-dark hover:bg-eg-forest-dark hover:text-white text-sm font-semibold">
                  <Wifi className="mr-2 h-4 w-4" />
                  SmartConnect Plans
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* GENERATOR MORPH: Nomad Series 20K → 40K → 80K          */}
      {/* ═══════════════════════════════════════════════════════ */}
      <section
        ref={pricingRef}
        className="py-20 sm:py-28 bg-gradient-to-b from-[#0a0a0a] to-[#0d1f0d]"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={pricingInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 bg-eg-lime/10 border border-eg-lime/20 rounded-full px-5 py-2 mb-6">
              <Sparkles className="h-4 w-4 text-eg-lime" />
              <span className="text-sm font-semibold text-eg-lime uppercase tracking-wider">Ideal Application Comparison</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              The <span className="text-eg-lime">Nomad Series</span>
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Commercial-grade off-grid power systems with true black start technology.
              Choose the capacity that matches your facility.
            </p>
          </motion.div>

          {/* Pricing Cards */}
          <div ref={morphRef} className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {nomadModels.map((model, index) => (
              <motion.div
                key={model.name}
                initial={{ opacity: 0, y: 40 }}
                animate={pricingInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
              >
                <div
                  className={`relative rounded-2xl overflow-hidden h-full ${
                    model.featured
                      ? 'border-2 border-eg-lime shadow-xl shadow-eg-lime/10'
                      : 'border border-slate-700/50'
                  }`}
                  style={{ background: model.featured ? 'linear-gradient(180deg, rgba(186, 218, 85, 0.08) 0%, rgba(10, 10, 10, 0.9) 100%)' : 'rgba(15, 15, 15, 0.8)' }}
                >
                  {/* Featured badge */}
                  {model.featured && (
                    <div className="absolute top-0 left-0 right-0 bg-eg-lime text-eg-forest-dark text-center py-1.5 text-xs font-bold uppercase tracking-wider">
                      Most Popular — Best Value
                    </div>
                  )}

                  <div className={`p-8 ${model.featured ? 'pt-12' : ''}`}>
                    {/* Badge */}
                    <span className={`inline-block text-xs font-bold px-3 py-1 rounded-full mb-4 ${model.badgeColor}`}>
                      {model.badge}
                    </span>

                    {/* Model name */}
                    <h3 className="text-2xl font-bold text-white mb-1">{model.name}</h3>
                    <p className="text-sm text-slate-400 mb-6">{model.continuous} continuous / {model.peak} peak</p>

                    {/* Price */}
                    <div className="mb-8">
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-bold text-white">{model.price}</span>
                      </div>
                      <p className="text-eg-lime text-sm font-medium mt-1">
                        {model.afterCredit} after 30% tax credit*
                      </p>
                    </div>

                    {/* Specs */}
                    <div className="space-y-3 mb-8">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Battery</span>
                        <span className="text-white font-medium">{model.battery}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Life Cycles</span>
                        <span className="text-white font-medium">{model.cycles}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Voltage</span>
                        <span className="text-white font-medium">{model.voltage}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Weight</span>
                        <span className="text-white font-medium">{model.weight}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Solar Controller</span>
                        <span className="text-white font-medium">{model.solarController}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Ports</span>
                        <span className="text-white font-medium">{model.outlets}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Warranty</span>
                        <span className="text-eg-lime font-medium">{model.warranty}</span>
                      </div>
                    </div>

                    {/* Ideal For */}
                    <div className="mb-8">
                      <p className="text-xs text-slate-500 uppercase tracking-wide mb-2 font-medium">Ideal For</p>
                      <div className="flex flex-wrap gap-2">
                        {model.idealFor.map((use) => (
                          <span key={use} className="text-xs bg-eg-forest/30 text-eg-lime/80 px-2.5 py-1 rounded-full border border-eg-forest/40">
                            {use}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* CTA */}
                    <Link href="/quote" className="block">
                      <Button
                        size="lg"
                        className={`w-full font-bold ${
                          model.featured
                            ? 'bg-eg-lime hover:bg-eg-lime-dark text-eg-forest-dark'
                            : 'bg-eg-forest hover:bg-eg-forest-light text-white'
                        }`}
                      >
                        Get Custom Quote
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>

                    {/* Included items */}
                    <div className="mt-4 pt-4 border-t border-slate-700/50">
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <CheckCircle className="h-3.5 w-3.5 text-eg-lime" />
                        <span>Solar panels included</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                        <CheckCircle className="h-3.5 w-3.5 text-eg-lime" />
                        <span>SmartConnect&trade; monitoring</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                        <CheckCircle className="h-3.5 w-3.5 text-eg-lime" />
                        <span>Pure sine wave inverter</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Bundle Savings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={pricingInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-10 eg-glass-dark rounded-2xl p-8 border border-eg-lime/20"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="flex items-center gap-5">
                <div className="h-14 w-14 rounded-full bg-eg-lime/10 flex items-center justify-center flex-shrink-0">
                  <Gift className="h-7 w-7 text-eg-lime" />
                </div>
                <div>
                  <p className="text-xl font-bold text-white">Bundle & Save Up to $7,000</p>
                  <p className="text-slate-400">Installation + SmartConnect Pro 3 months free with any Nomad system (5kW+)</p>
                </div>
              </div>
              <Link href="/quote">
                <Button size="lg" className="bg-eg-lime hover:bg-eg-lime-dark text-eg-forest-dark font-bold whitespace-nowrap">
                  Get Custom Quote
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Tax Credit Disclaimer */}
          <p className="text-center text-xs text-slate-500 mt-6">
            *The 30% Federal Investment Tax Credit (ITC) applies to qualifying solar energy storage systems under Section 48 of the Internal Revenue Code.
            Consult a qualified tax advisor to determine eligibility. EnerGenius does not provide tax advice.
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* BLACK START DIFFERENTIATOR                              */}
      {/* ═══════════════════════════════════════════════════════ */}
      <section className="py-20 sm:py-24 bg-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-eg-gold/10 border border-eg-gold/30 rounded-full px-5 py-2 mb-6">
              <Zap className="h-4 w-4 text-eg-gold" />
              <span className="text-sm font-semibold text-eg-gold uppercase tracking-wider">Key Differentiator</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              What Is <span className="text-eg-forest">Black Start</span> Capability?
            </h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Traditional battery backups require grid voltage or solar input to restart after depletion.
              EnerGenius systems feature true black start architecture — they initiate power independently,
              bringing your facility online even when everything else has failed.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {blackStartFeatures.map((feature, index) => (
              <Card key={feature.title} className="border border-slate-200 hover:border-eg-forest/40 hover:shadow-lg hover:shadow-eg-forest/5 transition-all bg-white group">
                <CardContent className="p-7">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-eg-forest/10 mb-5 group-hover:bg-eg-forest/15 transition-colors">
                    <feature.icon className="h-7 w-7 text-eg-forest" />
                  </div>
                  <h3 className="font-bold text-slate-900 mb-2 text-lg">{feature.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-14 text-center">
            <p className="text-2xl font-bold eg-gradient-text italic">
              &ldquo;Batteries store energy. EnerGenius creates it.&rdquo;
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* PROBLEM FRAMING                                        */}
      {/* ═══════════════════════════════════════════════════════ */}
      <section ref={problemRef} className="py-20 sm:py-24 bg-slate-50">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Why Traditional Backup Power <span className="text-red-600">Falls Short</span>
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              The average business loses $5,600 per minute of downtime. Most backup solutions can&apos;t keep up.
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
                  <CardContent className="p-7">
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

      {/* ═══════════════════════════════════════════════════════ */}
      {/* WHO IT'S FOR                                           */}
      {/* ═══════════════════════════════════════════════════════ */}
      <section className="py-20 sm:py-24 bg-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-eg-forest font-semibold text-sm uppercase tracking-wider mb-3">
              Stay Online, Stay Productive. No Fuel. No Noise. No Downtime.
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
              Built For Organizations That Can&apos;t Afford Downtime
            </h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {audiences.map((audience) => (
              <div key={audience.title} className="text-center p-8 rounded-2xl bg-slate-50 hover:bg-eg-forest/5 transition-colors border border-transparent hover:border-eg-forest/20">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-eg-forest/10 mb-5">
                  <audience.icon className="h-8 w-8 text-eg-forest" />
                </div>
                <h3 className="font-bold text-slate-900 mb-1">{audience.title}</h3>
                <p className="text-sm text-slate-500">{audience.examples}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* SMARTCONNECT: Globe + Monitoring Section                */}
      {/* ═══════════════════════════════════════════════════════ */}
      <section
        ref={smartRef}
        className="py-20 sm:py-28 relative overflow-hidden"
        style={{ background: 'linear-gradient(180deg, #050505 0%, #0d1f0d 50%, #050505 100%)' }}
      >
        {/* Background grid */}
        <div className="absolute inset-0 opacity-5">
          <div
            style={{
              backgroundImage: `radial-gradient(circle, #BADA55 1px, transparent 1px)`,
              backgroundSize: '40px 40px',
            }}
            className="absolute inset-0"
          />
        </div>

        <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Globe Visualization */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={smartInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
              transition={{ duration: 1 }}
              className="order-2 lg:order-1"
            >
              <SmartConnectGlobe />
              <p className="text-center text-xs text-slate-500 mt-4">Real-time SmartConnect&trade; network visualization</p>
            </motion.div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={smartInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
              transition={{ duration: 0.8 }}
              className="order-1 lg:order-2"
            >
              <div className="inline-flex items-center gap-2 bg-eg-teal-light/10 border border-eg-teal-light/30 rounded-full px-5 py-2 mb-6">
                <Wifi className="h-4 w-4 text-eg-teal-light" />
                <span className="text-sm font-semibold text-eg-teal-light uppercase tracking-wider">SmartConnect&trade;</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Monitor & Control
                <br />
                <span className="text-eg-lime">From Anywhere</span>
              </h2>

              <p className="text-lg text-slate-300 mb-10 leading-relaxed">
                SmartConnect&trade; puts your entire power infrastructure at your fingertips.
                Real-time monitoring, proactive alerts, and remote diagnostics —
                all from a single, intuitive dashboard.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                {smartConnectFeatures.map((feature) => (
                  <div key={feature.title} className="eg-glass-dark rounded-xl p-5 hover:border-eg-teal-light/40 transition-colors">
                    <feature.icon className="h-6 w-6 text-eg-teal-light mb-3" />
                    <h4 className="font-bold text-white text-sm mb-1">{feature.title}</h4>
                    <p className="text-xs text-slate-400">{feature.description}</p>
                  </div>
                ))}
              </div>

              {/* Free trial callout */}
              <div className="eg-glass-dark rounded-xl p-5 border-eg-gold/30 mb-8">
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-full bg-eg-gold/10 flex items-center justify-center flex-shrink-0">
                    <Gift className="h-5 w-5 text-eg-gold" />
                  </div>
                  <div>
                    <p className="font-bold text-white">3 Months Pro Tier FREE</p>
                    <p className="text-sm text-slate-400">
                      With any Nomad Series (5kW+) purchase. Includes fleet management,
                      advanced analytics, and priority support. Limited-time offer.*
                    </p>
                  </div>
                </div>
              </div>

              <Link href="/subscription">
                <Button size="lg" className="bg-eg-teal-light hover:bg-eg-teal text-white font-bold">
                  Explore SmartConnect Plans
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* INSTALLATION OPTIONS                                   */}
      {/* ═══════════════════════════════════════════════════════ */}
      <section className="py-20 sm:py-24 bg-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Two Ways to Get Started
            </h2>
            <p className="text-lg text-slate-600">
              From DIY setup to complete turnkey installation
            </p>
          </div>

          {/* Bundle Savings Banner */}
          <div className="bg-eg-lime/10 border border-eg-lime/30 rounded-xl p-4 mb-10 max-w-4xl mx-auto">
            <p className="text-center text-eg-forest font-medium">
              <span className="font-bold">Bundle & Save!</span> Get discounted installation when you purchase a 5,000W+ generator
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Quick Start */}
            <Card className="border-2 border-slate-200 hover:border-eg-forest/30 transition-all hover:shadow-lg">
              <CardContent className="p-8">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-slate-100 mb-6">
                  <Plug className="h-7 w-7 text-slate-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Quick Start Install</h3>
                <div className="mb-4">
                  <span className="text-slate-400 line-through text-lg">$3,499</span>
                  <span className="text-eg-forest font-bold text-2xl ml-2">$399</span>
                  <span className="text-xs text-slate-500 block mt-1">with 5kW+ generator purchase</span>
                </div>
                <p className="text-slate-600 mb-6">
                  Perfect if you have a licensed electrician. We deliver, you handle installation.
                </p>
                <ul className="space-y-2 text-sm text-slate-600">
                  {['System delivery & setup guidance', 'Remote technical support', 'Installation documentation'].map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-eg-forest" />
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <p className="text-xs text-eg-forest font-semibold">Save $3,100 with bundle!</p>
                </div>
              </CardContent>
            </Card>

            {/* Turnkey */}
            <Card className="border-2 border-eg-forest bg-eg-forest/5 relative hover:shadow-xl transition-all">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-eg-forest text-white text-sm font-semibold px-5 py-1.5 rounded-full shadow-lg">
                  Most Popular
                </span>
              </div>
              <CardContent className="p-8">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-eg-forest/10 mb-6">
                  <ShieldCheck className="h-7 w-7 text-eg-forest" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Turnkey Installation</h3>
                <div className="mb-4">
                  <span className="text-slate-400 line-through text-lg">$5,999</span>
                  <span className="text-eg-forest font-bold text-2xl ml-2">$2,499</span>
                  <span className="text-xs text-slate-500 block mt-1">with 5kW+ generator purchase</span>
                </div>
                <p className="text-slate-600 mb-6">
                  We handle everything. Site audit, permits, professional installation, and commissioning.
                </p>
                <ul className="space-y-2 text-sm text-slate-600">
                  {['Complete site assessment', 'Professional installation', 'Permit coordination', 'System commissioning & training'].map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-eg-forest" />
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="mt-4 pt-4 border-t border-eg-forest/20">
                  <p className="text-xs text-eg-forest font-semibold">Save $3,500 with bundle!</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* SOCIAL PROOF                                           */}
      {/* ═══════════════════════════════════════════════════════ */}
      <section className="py-20 sm:py-24 bg-slate-50">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Real Businesses. Real Results.
            </h2>
            <p className="text-slate-600">Trusted by facilities across the United States</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {useCases.map((useCase, index) => (
              <Card key={index} className="border-0 shadow-lg bg-white hover:shadow-xl transition-shadow">
                <CardContent className="p-8">
                  <div className="flex items-center gap-1 mb-4">
                    {Array.from({ length: useCase.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-eg-gold text-eg-gold" />
                    ))}
                  </div>
                  <div className="mb-6">
                    <span className="inline-block bg-eg-forest/10 text-eg-forest text-xs font-semibold px-3 py-1 rounded-full">
                      {useCase.type}
                    </span>
                  </div>
                  <p className="text-slate-700 italic mb-6 leading-relaxed">&ldquo;{useCase.quote}&rdquo;</p>
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

      {/* ═══════════════════════════════════════════════════════ */}
      {/* TAX CREDIT SECTION                                     */}
      {/* ═══════════════════════════════════════════════════════ */}
      <section className="py-16 sm:py-20 bg-eg-forest">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-eg-lime/10 rounded-full px-4 py-1.5 mb-6">
                <Award className="h-4 w-4 text-eg-lime" />
                <span className="text-sm font-medium text-eg-lime">Federal Incentive</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Save 30% with the
                <br />
                <span className="text-eg-lime">Federal Tax Credit</span>
              </h2>
              <p className="text-lg text-slate-200 leading-relaxed">
                All EnerGenius solar generator systems qualify for the 30% Federal Investment Tax Credit (ITC)
                under Section 48 of the Internal Revenue Code, potentially saving you thousands.
              </p>
            </div>
            <div className="space-y-4">
              <div className="bg-white/10 rounded-xl p-5 backdrop-blur">
                <p className="text-slate-300 text-sm mb-1">Nomad 20K System</p>
                <div className="flex items-baseline gap-3">
                  <span className="text-white/50 line-through text-lg">$18,750</span>
                  <span className="text-2xl font-bold text-eg-lime">$13,125</span>
                </div>
                <p className="text-eg-lime/70 text-sm mt-1">Save $5,625</p>
              </div>
              <div className="bg-white/10 rounded-xl p-5 backdrop-blur">
                <p className="text-slate-300 text-sm mb-1">Nomad 40K System</p>
                <div className="flex items-baseline gap-3">
                  <span className="text-white/50 line-through text-lg">$34,500</span>
                  <span className="text-2xl font-bold text-eg-lime">$24,150</span>
                </div>
                <p className="text-eg-lime/70 text-sm mt-1">Save $10,350</p>
              </div>
              <div className="bg-white/10 rounded-xl p-5 backdrop-blur">
                <p className="text-slate-300 text-sm mb-1">Nomad 80K System</p>
                <div className="flex items-baseline gap-3">
                  <span className="text-white/50 line-through text-lg">$67,500</span>
                  <span className="text-2xl font-bold text-eg-lime">$47,250</span>
                </div>
                <p className="text-eg-lime/70 text-sm mt-1">Save $20,250</p>
              </div>
            </div>
          </div>
          <p className="text-xs text-slate-300/60 mt-8 text-center max-w-3xl mx-auto">
            Tax credit eligibility depends on individual circumstances. The 30% ITC applies to qualifying solar energy storage systems
            installed before December 31, 2032 under the Inflation Reduction Act. Consult a qualified tax professional for guidance.
            EnerGenius and Renewable Resource Group LLC do not provide tax, legal, or accounting advice.
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* FINAL CTA                                              */}
      {/* ═══════════════════════════════════════════════════════ */}
      <section
        className="py-24 sm:py-32 text-white relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #0a0a0a 0%, #1A5D1A 50%, #0a0a0a 100%)',
        }}
      >
        {/* Background glow */}
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-eg-lime/5 blur-[120px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">
            Don&apos;t Wait for the Next Outage
          </h2>
          <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
            A 15-minute assessment will tell you exactly what size system your building needs
            and what it will cost — no pressure, no obligation.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/quote">
              <Button
                size="lg"
                className="bg-eg-lime hover:bg-eg-lime-dark text-eg-forest-dark px-12 py-7 text-lg font-bold rounded-xl shadow-lg shadow-eg-lime/20 hover:shadow-eg-lime/40 transition-all hover:scale-[1.02]"
              >
                <Calendar className="mr-2 h-5 w-5" />
                Get a 15-Minute Energy Assessment
              </Button>
            </Link>
          </div>

          <p className="mt-8 text-slate-400 text-sm">
            Or call us directly: <a href="tel:+18005551234" className="text-eg-lime underline font-semibold hover:text-eg-lime-light">1-800-ENERGENIUS</a>
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-6 text-xs text-slate-500">
            <span>5-Year Warranty</span>
            <span>|</span>
            <span>30% Federal Tax Credit</span>
            <span>|</span>
            <span>Free Shipping $2,000+</span>
            <span>|</span>
            <span>SmartConnect&trade; Monitoring</span>
          </div>
        </div>
      </section>
    </div>
  )
}
