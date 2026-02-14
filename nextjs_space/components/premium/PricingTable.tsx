'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import {
  CheckCircle, ArrowRight, Plug, ShieldCheck, Gift,
  Star, Zap
} from 'lucide-react'

const installOptions = [
  {
    name: 'Quick Start Install',
    icon: Plug,
    originalPrice: '$3,499',
    bundlePrice: '$399',
    savings: '$3,100',
    description: 'Perfect if you have a licensed electrician. We deliver, you handle installation.',
    features: [
      'System delivery & setup guidance',
      'Remote technical support',
      'Installation documentation',
      'System commissioning checklist',
    ],
    popular: false,
  },
  {
    name: 'Turnkey Installation',
    icon: ShieldCheck,
    originalPrice: '$5,999',
    bundlePrice: '$2,499',
    savings: '$3,500',
    description: 'We handle everything. Site audit, permits, professional installation, and commissioning.',
    features: [
      'Complete site assessment',
      'Professional installation',
      'Permit coordination',
      'System commissioning & training',
      'SmartConnect Pro setup',
      '30-day post-install support',
    ],
    popular: true,
  },
]

export default function PricingTable() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <section ref={ref} className="relative py-24 sm:py-32 bg-gradient-to-b from-[#0a1a0a] to-[#0d2010] overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-20" />

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 glass-card rounded-full px-5 py-2 mb-6">
            <Star className="h-4 w-4 text-energenius-gold" />
            <span className="text-sm font-medium text-energenius-gold uppercase tracking-wider">
              Installation Options
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Two Ways to <span className="text-gradient-energenius">Get Started</span>
          </h2>
          <p className="text-lg text-white/50 max-w-2xl mx-auto">
            From DIY setup to complete turnkey installation — both options include massive bundle savings.
          </p>
        </motion.div>

        {/* Bundle Promo Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="glass-card rounded-2xl p-6 mb-12 border-energenius-gold/20 max-w-3xl mx-auto"
        >
          <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
            <div className="h-14 w-14 rounded-full bg-energenius-gold/10 flex items-center justify-center flex-shrink-0">
              <Gift className="h-7 w-7 text-energenius-gold" />
            </div>
            <div>
              <p className="text-white font-bold text-lg">Bundle & Save Up to $7,000</p>
              <p className="text-white/50 text-sm">
                Discounted installation + 3 months SmartConnect Pro FREE with any 5kW+ Nomad system
              </p>
            </div>
          </div>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {installOptions.map((option, i) => (
            <motion.div
              key={option.name}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3 + i * 0.2, duration: 0.6 }}
              className="relative"
            >
              {option.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                  <span className="bg-energenius-lime text-energenius-forest-dark text-sm font-bold px-5 py-1.5 rounded-full shadow-lg shadow-energenius-lime/20">
                    Most Popular
                  </span>
                </div>
              )}

              <div
                className={`glass-card rounded-2xl p-8 h-full hover-lift ${
                  option.popular ? 'border-energenius-lime/30 bg-energenius-lime/5' : ''
                }`}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${
                    option.popular ? 'bg-energenius-lime/20' : 'bg-white/10'
                  }`}>
                    <option.icon className={`h-6 w-6 ${option.popular ? 'text-energenius-lime' : 'text-white/60'}`} />
                  </div>
                  <h3 className="text-xl font-bold text-white">{option.name}</h3>
                </div>

                {/* Price */}
                <div className="mb-6">
                  <div className="flex items-baseline gap-3">
                    <span className="text-white/30 line-through text-lg">{option.originalPrice}</span>
                    <span className="text-3xl font-black text-energenius-lime">{option.bundlePrice}</span>
                  </div>
                  <p className="text-xs text-energenius-gold mt-1">
                    Save {option.savings} with 5kW+ generator purchase
                  </p>
                </div>

                <p className="text-white/50 text-sm mb-8 leading-relaxed">{option.description}</p>

                {/* Features */}
                <ul className="space-y-3 mb-8">
                  {option.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <CheckCircle className={`h-4 w-4 mt-0.5 flex-shrink-0 ${
                        option.popular ? 'text-energenius-lime' : 'text-energenius-teal-light'
                      }`} />
                      <span className="text-sm text-white/70">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link href="/quote">
                  <Button
                    size="lg"
                    className={`w-full rounded-xl font-bold ${
                      option.popular
                        ? 'bg-energenius-lime hover:bg-energenius-lime-light text-energenius-forest-dark'
                        : 'bg-white/10 hover:bg-white/20 text-white'
                    }`}
                  >
                    Select {option.name}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Tax Credit Callout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-16 text-center"
        >
          <div className="glass-card rounded-2xl p-8 max-w-3xl mx-auto border-energenius-lime/10">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="h-16 w-16 rounded-full bg-energenius-lime/10 flex items-center justify-center flex-shrink-0">
                <Zap className="h-8 w-8 text-energenius-lime" />
              </div>
              <div className="text-center sm:text-left">
                <h4 className="text-xl font-bold text-white mb-2">
                  30% Federal Tax Credit Eligible
                </h4>
                <p className="text-white/50 text-sm">
                  All EnerGenius Nomad Series systems qualify for the 30% Federal Investment Tax Credit
                  under the Inflation Reduction Act. Consult your tax advisor for eligibility details.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
