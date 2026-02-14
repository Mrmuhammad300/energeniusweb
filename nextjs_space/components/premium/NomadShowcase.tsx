'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import {
  Zap, CheckCircle, ArrowRight, Wifi, Shield, BatteryCharging,
  Thermometer, Volume2
} from 'lucide-react'

const nomadSpecs = [
  { label: 'Continuous', value: '20,000W', icon: Zap },
  { label: 'Peak Power', value: '40,000W', icon: BatteryCharging },
  { label: 'Battery', value: '400 Ah', icon: Shield },
  { label: 'Life Cycles', value: '8,000', icon: Thermometer },
  { label: 'Output', value: '120/240V', icon: Zap },
  { label: 'Warranty', value: '5 Years', icon: Shield },
]

const benefits = [
  'True black start — self-initiates from zero power',
  'Silent, zero-emission operation — no noise or fumes',
  'Zero fuel storage, delivery, or maintenance',
  'SmartConnect cloud monitoring included',
  'Qualifies for 30% Federal Tax Credit',
  'Professional installation with Turnkey package',
]

export default function NomadShowcase() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.15 })

  return (
    <section ref={ref} className="relative py-24 sm:py-32 overflow-hidden bg-gradient-to-br from-[#050a05] via-[#0a1a0a] to-[#0d2010]">
      {/* Subtle grid */}
      <div className="absolute inset-0 grid-pattern opacity-50" />

      {/* Accent glow */}
      <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-energenius-lime/5 rounded-full blur-[100px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content Side */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 glass-card rounded-full px-5 py-2 mb-8">
              <Zap className="h-4 w-4 text-energenius-lime" />
              <span className="text-sm font-medium text-energenius-lime uppercase tracking-wider">
                Flagship System
              </span>
            </div>

            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              EnerGenius{' '}
              <span className="text-gradient-energenius">Nomad 20K</span>
            </h2>

            <p className="text-lg text-white/60 mb-10 leading-relaxed max-w-xl">
              The reference standard for commercial backup power. 20,000 watts of
              clean, silent power that runs for days — not hours. No fuel, no fumes,
              no noise complaints.
            </p>

            {/* Specs Grid */}
            <div className="grid grid-cols-3 gap-3 mb-10">
              {nomadSpecs.map((spec, i) => (
                <motion.div
                  key={spec.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.2 + i * 0.1, duration: 0.5 }}
                  className="glass-card rounded-xl p-4 text-center"
                >
                  <p className="text-2xl font-bold text-energenius-lime">{spec.value}</p>
                  <p className="text-xs text-white/40 mt-1 uppercase tracking-wide">{spec.label}</p>
                </motion.div>
              ))}
            </div>

            {/* Benefits */}
            <div className="space-y-3 mb-10">
              {benefits.map((benefit, i) => (
                <motion.div
                  key={benefit}
                  initial={{ opacity: 0, x: -20 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.5 + i * 0.08, duration: 0.4 }}
                  className="flex items-start gap-3"
                >
                  <CheckCircle className="h-5 w-5 text-energenius-lime mt-0.5 flex-shrink-0" />
                  <span className="text-white/70 text-sm">{benefit}</span>
                </motion.div>
              ))}
            </div>

            {/* SmartConnect Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 1, duration: 0.5 }}
              className="glass-card rounded-xl p-5 mb-10 border-energenius-lime/20"
            >
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-energenius-lime/10 flex items-center justify-center flex-shrink-0">
                  <Wifi className="h-6 w-6 text-energenius-lime" />
                </div>
                <div>
                  <p className="font-bold text-white">SmartConnect Included</p>
                  <p className="text-sm text-white/50">Remote monitoring, load prioritization, fleet management</p>
                </div>
                <span className="ml-auto bg-energenius-gold text-energenius-forest-dark text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">
                  3 MO FREE
                </span>
              </div>
            </motion.div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/quote">
                <Button
                  size="lg"
                  className="bg-energenius-lime hover:bg-energenius-lime-light text-energenius-forest-dark px-8 font-bold rounded-xl"
                >
                  Get Your Assessment
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/products">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10 px-8 rounded-xl"
                >
                  See All Systems
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Image Side */}
          <motion.div
            initial={{ opacity: 0, x: 40, scale: 0.95 }}
            animate={inView ? { opacity: 1, x: 0, scale: 1 } : {}}
            transition={{ duration: 1, delay: 0.3 }}
            className="relative"
          >
            {/* Glow behind image */}
            <div className="absolute inset-0 bg-energenius-forest/30 rounded-3xl blur-[60px] scale-75" />

            {/* Main image container */}
            <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl shadow-energenius-forest/20">
              <div className="aspect-square relative bg-gradient-to-br from-energenius-forest-dark to-[#050a05]">
                <Image
                  src="https://powerxgenerators.com/wp-content/uploads/2021/09/Hnet.com-image-500x375.jpg"
                  alt="EnerGenius Nomad 20K Commercial Solar Generator"
                  fill
                  className="object-cover opacity-90"
                />
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#050a05]/60 via-transparent to-transparent" />
              </div>

              {/* Floating specs overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="glass-card rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-bold text-lg">Nomad 20K</p>
                      <p className="text-white/50 text-sm">Commercial Off-Grid Power</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-white/40">Starting at</p>
                      <p className="text-2xl font-bold text-energenius-lime">$18,750</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating badges */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -top-4 -right-4 glass-card rounded-xl px-4 py-2 border-energenius-lime/30"
            >
              <div className="flex items-center gap-2">
                <Volume2 className="h-4 w-4 text-energenius-lime" />
                <span className="text-white text-xs font-medium">Zero Noise</span>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              className="absolute -bottom-4 -left-4 glass-card rounded-xl px-4 py-2 border-energenius-gold/30"
            >
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-energenius-gold" />
                <span className="text-white text-xs font-medium">30% Tax Credit</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
