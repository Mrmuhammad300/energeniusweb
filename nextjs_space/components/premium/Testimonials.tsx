'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Star, Quote } from 'lucide-react'

const testimonials = [
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

export default function Testimonials() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <section ref={ref} className="relative py-24 sm:py-32 bg-gradient-to-b from-[#0d2010] to-[#050a05] overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-20" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Real Businesses.{' '}
            <span className="text-gradient-energenius">Real Results.</span>
          </h2>
          <p className="text-lg text-white/50 max-w-2xl mx-auto">
            See how organizations across the country trust EnerGenius to keep them powered.
          </p>
        </motion.div>

        {/* Testimonial Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 + i * 0.15, duration: 0.6 }}
              className="glass-card rounded-2xl p-8 hover-lift"
            >
              {/* Quote icon */}
              <div className="mb-6">
                <Quote className="h-8 w-8 text-energenius-lime/30" />
              </div>

              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, j) => (
                  <Star key={j} className="h-4 w-4 text-energenius-gold fill-energenius-gold" />
                ))}
              </div>

              {/* Quote text */}
              <p className="text-white/70 leading-relaxed mb-8 text-sm">
                &ldquo;{testimonial.quote}&rdquo;
              </p>

              {/* Author */}
              <div className="border-t border-white/10 pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-white">{testimonial.author}</p>
                    <p className="text-xs text-white/40">{testimonial.location}</p>
                  </div>
                  <span className="text-xs font-medium text-energenius-lime bg-energenius-lime/10 px-3 py-1 rounded-full">
                    {testimonial.type}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
