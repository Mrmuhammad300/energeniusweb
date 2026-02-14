'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Calendar, Phone, ArrowRight } from 'lucide-react'

export default function FinalCTA() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 })

  return (
    <section ref={ref} className="relative py-24 sm:py-32 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-energenius-forest via-energenius-forest-dark to-[#050a05]" />

      {/* Decorative elements */}
      <div className="absolute inset-0 grid-pattern opacity-10" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-energenius-lime/10 rounded-full blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Don&apos;t Wait for the{' '}
            <span className="text-energenius-lime">Next Outage</span>
          </h2>

          <p className="text-xl text-white/60 mb-10 max-w-2xl mx-auto leading-relaxed">
            A 15-minute assessment will tell you exactly what size system your building needs
            and what it will cost — no pressure, no obligation.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-10">
            <Link href="/quote">
              <Button
                size="lg"
                className="bg-energenius-lime hover:bg-energenius-lime-light text-energenius-forest-dark text-lg px-10 py-7 rounded-xl font-bold shadow-lg shadow-energenius-lime/20 hover:shadow-energenius-lime/40 transition-all hover:scale-105"
              >
                <Calendar className="mr-2 h-5 w-5" />
                Get a Free Energy Assessment
              </Button>
            </Link>
          </div>

          <div className="flex flex-wrap justify-center gap-8 text-white/40 text-sm">
            <span>Free assessment</span>
            <span>No obligation</span>
            <span>Custom sizing</span>
            <span>Tax credit guidance</span>
          </div>

          <div className="mt-10 pt-8 border-t border-white/10">
            <p className="text-white/30 text-sm">
              Or call us directly:{' '}
              <a href="tel:+18005551234" className="text-energenius-lime hover:text-energenius-lime-light font-semibold">
                1-800-ENERGENIUS
              </a>
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
