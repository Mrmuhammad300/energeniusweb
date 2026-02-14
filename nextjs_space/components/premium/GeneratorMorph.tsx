'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import {
  ArrowRight, Zap, Building2, Church, Factory,
  Server, Truck, Hospital, Sparkles
} from 'lucide-react'

const generators = [
  {
    id: 'nomad-20k',
    name: 'Nomad 20K',
    tagline: 'Commercial Standard',
    power: '20,000W',
    peak: '40,000W',
    battery: '400 Ah',
    price: '$18,750',
    priceAfterCredit: '$13,125',
    weight: '425 lbs',
    dimensions: '48" x 24" x 28"',
    badge: 'Most Popular',
    badgeColor: 'bg-energenius-lime text-energenius-forest-dark',
    gradient: 'from-energenius-forest to-energenius-teal',
    idealFor: [
      { icon: Building2, label: 'Offices & Retail' },
      { icon: Church, label: 'Churches' },
      { icon: Hospital, label: 'Medical Clinics' },
    ],
    description: 'Perfect for small-to-mid commercial buildings. Powers HVAC, lighting, refrigeration, and essential systems.',
  },
  {
    id: 'nomad-40k',
    name: 'Nomad 40K',
    tagline: 'High Capacity',
    power: '40,000W',
    peak: '80,000W',
    battery: '800 Ah',
    price: '$34,500',
    priceAfterCredit: '$24,150',
    weight: '850 lbs',
    dimensions: '72" x 37" x 30"',
    badge: 'High Capacity',
    badgeColor: 'bg-energenius-teal-light text-white',
    gradient: 'from-energenius-teal to-blue-600',
    idealFor: [
      { icon: Factory, label: 'Warehouses' },
      { icon: Server, label: 'Data Centers' },
      { icon: Building2, label: 'Multi-Tenant' },
    ],
    description: 'Designed for large commercial facilities. Handles full building loads including industrial equipment.',
  },
  {
    id: 'nomad-80k',
    name: 'Nomad 80K',
    tagline: 'Enterprise Grade',
    power: '80,000W',
    peak: '160,000W',
    battery: '1,600 Ah',
    price: '$67,500',
    priceAfterCredit: '$47,250',
    weight: '1,700 lbs',
    dimensions: '96" x 48" x 36"',
    badge: 'Enterprise',
    badgeColor: 'bg-purple-500 text-white',
    gradient: 'from-purple-600 to-energenius-forest',
    idealFor: [
      { icon: Factory, label: 'Large Facilities' },
      { icon: Truck, label: 'EV Charging' },
      { icon: Hospital, label: 'Emergency Services' },
    ],
    description: 'Enterprise-scale power plant for the largest deployments. Multiple unit stacking for unlimited capacity.',
  },
]

export default function GeneratorMorph() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })
  const active = generators[activeIndex]

  return (
    <section ref={ref} className="relative py-24 sm:py-32 bg-gradient-to-b from-[#050a05] to-[#0a1a0a] overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-20" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 glass-card rounded-full px-5 py-2 mb-6">
            <Sparkles className="h-4 w-4 text-energenius-lime" />
            <span className="text-sm font-medium text-energenius-lime uppercase tracking-wider">
              The Nomad Series
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Choose Your <span className="text-gradient-energenius">Power Level</span>
          </h2>
          <p className="text-lg text-white/50 max-w-2xl mx-auto">
            From offices to enterprise facilities. Self-starting power plants for businesses that can&apos;t afford downtime.
          </p>
        </motion.div>

        {/* Tab Selector */}
        <div className="flex justify-center mb-16">
          <div className="glass-card rounded-2xl p-2 inline-flex gap-2">
            {generators.map((gen, i) => (
              <button
                key={gen.id}
                onClick={() => setActiveIndex(i)}
                className={`px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${
                  activeIndex === i
                    ? 'bg-energenius-lime text-energenius-forest-dark shadow-lg shadow-energenius-lime/20'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                {gen.name}
              </button>
            ))}
          </div>
        </div>

        {/* Active Generator Display */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active.id}
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.98 }}
            transition={{ duration: 0.5 }}
            className="glass-card rounded-3xl overflow-hidden border-white/10"
          >
            <div className="grid lg:grid-cols-2">
              {/* Visual Side */}
              <div className={`relative p-8 lg:p-12 bg-gradient-to-br ${active.gradient} min-h-[400px] flex flex-col justify-between`}>
                <div>
                  <span className={`inline-block ${active.badgeColor} text-xs font-bold px-3 py-1 rounded-full mb-4`}>
                    {active.badge}
                  </span>
                  <h3 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white/10">
                    {active.name}
                  </h3>
                </div>

                {/* Animated power visualization */}
                <div className="flex items-end gap-4 mt-8">
                  {[...Array(Math.ceil(parseInt(active.power.replace(/,/g, '')) / 20000))].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ height: 0 }}
                      animate={{ height: 40 + i * 30 }}
                      transition={{ delay: i * 0.2, duration: 0.6 }}
                      className="w-8 bg-white/20 rounded-t-lg"
                    />
                  ))}
                  <div className="ml-4">
                    <p className="text-4xl font-black text-white">{active.power}</p>
                    <p className="text-sm text-white/60">Continuous Power</p>
                  </div>
                </div>

                {/* Glow effect */}
                <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-white/10 rounded-full blur-[80px]" />
              </div>

              {/* Info Side */}
              <div className="p-8 lg:p-12">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h4 className="text-2xl font-bold text-white">{active.name}</h4>
                    <p className="text-white/50">{active.tagline}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-energenius-lime">{active.price}</p>
                    <p className="text-xs text-energenius-gold">
                      {active.priceAfterCredit} after 30% tax credit
                    </p>
                  </div>
                </div>

                <p className="text-white/60 mb-8 leading-relaxed">{active.description}</p>

                {/* Specs */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="glass-card rounded-xl p-4">
                    <p className="text-xs text-white/40 uppercase mb-1">Peak Power</p>
                    <p className="text-xl font-bold text-white">{active.peak}</p>
                  </div>
                  <div className="glass-card rounded-xl p-4">
                    <p className="text-xs text-white/40 uppercase mb-1">Battery</p>
                    <p className="text-xl font-bold text-white">{active.battery}</p>
                  </div>
                  <div className="glass-card rounded-xl p-4">
                    <p className="text-xs text-white/40 uppercase mb-1">Weight</p>
                    <p className="text-xl font-bold text-white">{active.weight}</p>
                  </div>
                  <div className="glass-card rounded-xl p-4">
                    <p className="text-xs text-white/40 uppercase mb-1">Dimensions</p>
                    <p className="text-lg font-bold text-white">{active.dimensions}</p>
                  </div>
                </div>

                {/* Ideal For */}
                <div className="mb-8">
                  <p className="text-xs text-white/40 uppercase tracking-wider mb-3">Ideal For</p>
                  <div className="flex gap-4">
                    {active.idealFor.map((use) => (
                      <div key={use.label} className="flex items-center gap-2 glass-card rounded-lg px-3 py-2">
                        <use.icon className="h-4 w-4 text-energenius-lime" />
                        <span className="text-xs text-white/70">{use.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Link href="/quote">
                  <Button
                    size="lg"
                    className="w-full bg-energenius-lime hover:bg-energenius-lime-light text-energenius-forest-dark font-bold rounded-xl"
                  >
                    Get Custom Quote for {active.name}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}
