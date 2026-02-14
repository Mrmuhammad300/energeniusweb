'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Power, Cpu, Zap, ShieldCheck, Battery, Radio } from 'lucide-react'

const features = [
  {
    icon: Power,
    title: 'True Black Start',
    description: 'Self-initiates from zero power state. No grid, no solar, no external input required.',
    step: '01',
  },
  {
    icon: Cpu,
    title: 'Autonomous Boot',
    description: 'Internal DC bus + inverter boot logic enables fully independent system recovery.',
    step: '02',
  },
  {
    icon: Zap,
    title: 'Instant Partial Load',
    description: 'Supports immediate partial load upon startup — critical power when you need it.',
    step: '03',
  },
  {
    icon: ShieldCheck,
    title: 'Auto-Restart Recovery',
    description: 'Automatically restores power after full system depletion without intervention.',
    step: '04',
  },
]

const comparisonData = [
  { feature: 'Self-Start from Zero', energenius: true, diesel: false, battery: false },
  { feature: 'No Fuel Required', energenius: true, diesel: false, battery: true },
  { feature: 'Silent Operation', energenius: true, diesel: false, battery: true },
  { feature: 'Zero Emissions', energenius: true, diesel: false, battery: true },
  { feature: 'Auto-Restart After Depletion', energenius: true, diesel: false, battery: false },
  { feature: 'Remote Monitoring', energenius: true, diesel: false, battery: false },
  { feature: 'No Maintenance', energenius: true, diesel: false, battery: true },
  { feature: '30% Federal Tax Credit', energenius: true, diesel: false, battery: true },
]

export default function BlackStartDiagram() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })
  const [tableRef, tableInView] = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <section className="relative py-24 sm:py-32 bg-gradient-to-b from-[#0d2010] via-[#0a1a0a] to-[#050a05] overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 grid-pattern opacity-30" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-energenius-teal/5 rounded-full blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-20" ref={ref}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 glass-card rounded-full px-5 py-2 mb-6">
              <Battery className="h-4 w-4 text-energenius-gold" />
              <span className="text-sm font-medium text-energenius-gold uppercase tracking-wider">
                Key Differentiator
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
              What Is{' '}
              <span className="text-gradient-gold">Black Start</span>{' '}
              Capability?
            </h2>
            <p className="text-lg text-white/50 max-w-3xl mx-auto leading-relaxed">
              Traditional battery backups require grid voltage or solar input to restart after depletion.
              EnerGenius systems feature true black start architecture — they initiate power independently,
              bringing your facility online even when everything else has failed.
            </p>
          </motion.div>
        </div>

        {/* Feature Steps - Architecture Diagram Style */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 + i * 0.15, duration: 0.6 }}
              className="relative group"
            >
              {/* Connector line */}
              {i < features.length - 1 && (
                <div className="hidden lg:block absolute top-12 right-0 w-6 h-[2px] bg-gradient-to-r from-energenius-lime/40 to-transparent translate-x-full z-10" />
              )}

              <div className="glass-card rounded-2xl p-6 h-full hover:border-energenius-lime/30 transition-all duration-300 hover-lift">
                {/* Step number */}
                <span className="text-6xl font-black text-white/5 absolute top-4 right-4">
                  {feature.step}
                </span>

                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-energenius-lime/10 mb-5 group-hover:bg-energenius-lime/20 transition-colors">
                  <feature.icon className="h-7 w-7 text-energenius-lime" />
                </div>
                <h3 className="text-lg font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-sm text-white/50 leading-relaxed">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Quote */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 1, duration: 0.8 }}
          className="text-center mb-24"
        >
          <div className="glass-card rounded-2xl p-8 max-w-3xl mx-auto border-energenius-lime/10">
            <p className="text-2xl sm:text-3xl font-semibold text-white italic leading-relaxed">
              &ldquo;Batteries store energy.{' '}
              <span className="text-energenius-lime">EnerGenius creates it.</span>&rdquo;
            </p>
          </div>
        </motion.div>

        {/* Comparison Table */}
        <div ref={tableRef}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={tableInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <h3 className="text-2xl sm:text-3xl font-bold text-white text-center mb-10">
              How EnerGenius <span className="text-energenius-lime">Compares</span>
            </h3>

            <div className="glass-card rounded-2xl overflow-hidden max-w-4xl mx-auto">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left text-sm font-medium text-white/40 py-4 px-6">Feature</th>
                      <th className="text-center text-sm font-bold text-energenius-lime py-4 px-4">EnerGenius</th>
                      <th className="text-center text-sm font-medium text-white/40 py-4 px-4">Diesel Gen</th>
                      <th className="text-center text-sm font-medium text-white/40 py-4 px-4">Battery Only</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonData.map((row, i) => (
                      <motion.tr
                        key={row.feature}
                        initial={{ opacity: 0, x: -20 }}
                        animate={tableInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ delay: 0.1 + i * 0.06, duration: 0.4 }}
                        className="border-b border-white/5 hover:bg-white/5 transition-colors"
                      >
                        <td className="text-sm text-white/70 py-3.5 px-6">{row.feature}</td>
                        <td className="text-center py-3.5 px-4">
                          <span className="text-energenius-lime text-lg">&#10003;</span>
                        </td>
                        <td className="text-center py-3.5 px-4">
                          {row.diesel ? (
                            <span className="text-energenius-lime text-lg">&#10003;</span>
                          ) : (
                            <span className="text-red-400/60 text-lg">&#10005;</span>
                          )}
                        </td>
                        <td className="text-center py-3.5 px-4">
                          {row.battery ? (
                            <span className="text-energenius-lime text-lg">&#10003;</span>
                          ) : (
                            <span className="text-red-400/60 text-lg">&#10005;</span>
                          )}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
