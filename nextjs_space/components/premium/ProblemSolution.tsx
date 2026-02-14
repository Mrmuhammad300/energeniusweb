'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import {
  AlertTriangle, Fuel, Volume2, Timer,
  Building2, Church, Home, Factory,
  Calendar, ArrowRight
} from 'lucide-react'

const problems = [
  {
    icon: AlertTriangle,
    title: 'Grid Dependence',
    description: 'Traditional battery backups wait for grid voltage. When the grid is down, they\'re down too.',
    color: 'text-red-400',
    bgColor: 'bg-red-400/10',
  },
  {
    icon: Fuel,
    title: 'Diesel Headaches',
    description: 'Fuel storage, maintenance costs, and diesel generators that fail when you need them most.',
    color: 'text-orange-400',
    bgColor: 'bg-orange-400/10',
  },
  {
    icon: Volume2,
    title: 'Noise & Fumes',
    description: 'Traditional generators disrupt your business, annoy neighbors, and require ventilation.',
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-400/10',
  },
  {
    icon: Timer,
    title: 'Downtime Losses',
    description: 'Every minute without power means lost revenue, spoiled inventory, or critical system failures.',
    color: 'text-purple-400',
    bgColor: 'bg-purple-400/10',
  },
]

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

export default function ProblemSolution() {
  const [problemRef, problemInView] = useInView({ triggerOnce: true, threshold: 0.1 })
  const [audienceRef, audienceInView] = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <>
      {/* Problem Section */}
      <section
        ref={problemRef}
        className="relative py-24 sm:py-32 bg-gradient-to-b from-[#0a1a0a] to-[#0d1510] overflow-hidden"
      >
        <div className="absolute inset-0 grid-pattern opacity-20" />
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-red-500/3 rounded-full blur-[100px]" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={problemInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              Why Traditional Backup Power{' '}
              <span className="text-red-400">Falls Short</span>
            </h2>
            <p className="text-lg text-white/50 max-w-2xl mx-auto">
              The average business loses $5,600 per minute of downtime.
              Most backup solutions can&apos;t keep up.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {problems.map((problem, i) => (
              <motion.div
                key={problem.title}
                initial={{ opacity: 0, y: 30 }}
                animate={problemInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.2 + i * 0.1, duration: 0.5 }}
                className="glass-card rounded-2xl p-6 hover-lift"
              >
                <div className={`h-12 w-12 rounded-xl ${problem.bgColor} flex items-center justify-center mb-5`}>
                  <problem.icon className={`h-6 w-6 ${problem.color}`} />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{problem.title}</h3>
                <p className="text-sm text-white/50 leading-relaxed">{problem.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Audience Section */}
      <section
        ref={audienceRef}
        className="relative py-24 sm:py-32 bg-gradient-to-b from-[#0d1510] to-[#0a1a0a] overflow-hidden"
      >
        <div className="absolute inset-0 grid-pattern opacity-20" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={audienceInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <p className="text-energenius-lime font-semibold text-sm uppercase tracking-widest mb-4">
              Stay Online. Stay Productive. No Fuel. No Noise. No Downtime.
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
              Built For Organizations That{' '}
              <span className="text-gradient-energenius">Can&apos;t Afford Downtime</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {audiences.map((audience, i) => (
              <motion.div
                key={audience.title}
                initial={{ opacity: 0, y: 20 }}
                animate={audienceInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.2 + i * 0.1, duration: 0.5 }}
                className="text-center glass-card rounded-2xl p-6 hover:border-energenius-lime/20 transition-all"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-energenius-lime/10 mb-4">
                  <audience.icon className="h-8 w-8 text-energenius-lime" />
                </div>
                <h3 className="font-bold text-white mb-1">{audience.title}</h3>
                <p className="text-xs text-white/40">{audience.examples}</p>
              </motion.div>
            ))}
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={audienceInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="text-center"
          >
            <Link href="/quote">
              <Button
                size="lg"
                className="bg-energenius-lime hover:bg-energenius-lime-light text-energenius-forest-dark text-lg px-10 py-7 rounded-xl font-bold shadow-lg shadow-energenius-lime/20"
              >
                <Calendar className="mr-2 h-5 w-5" />
                Find the Right System for Your Building
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  )
}
