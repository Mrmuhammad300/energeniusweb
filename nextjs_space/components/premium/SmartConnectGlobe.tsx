'use client'

import { useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Wifi, Globe, Activity, Shield, ArrowRight, Smartphone } from 'lucide-react'

function GlobeCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const animate = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    const size = Math.min(canvas.offsetWidth, canvas.offsetHeight)
    canvas.width = size * dpr
    canvas.height = size * dpr
    ctx.scale(dpr, dpr)

    const cx = size / 2
    const cy = size / 2
    const radius = size * 0.38
    let rotation = 0

    // Globe nodes - lat/lng positions
    const nodes = [
      { lat: 40.7, lng: -74.0 },    // New York
      { lat: 34.0, lng: -118.2 },   // LA
      { lat: 41.9, lng: -87.6 },    // Chicago
      { lat: 29.8, lng: -95.4 },    // Houston
      { lat: 33.4, lng: -112.0 },   // Phoenix
      { lat: 47.6, lng: -122.3 },   // Seattle
      { lat: 25.8, lng: -80.2 },    // Miami
      { lat: 39.7, lng: -104.9 },   // Denver
      { lat: 42.4, lng: -71.1 },    // Boston
      { lat: 36.2, lng: -115.1 },   // Vegas
      { lat: 32.7, lng: -96.8 },    // Dallas
      { lat: 37.8, lng: -122.4 },   // SF
    ]

    function latLngToXY(lat: number, lng: number, rot: number) {
      const phi = (90 - lat) * (Math.PI / 180)
      const theta = (lng + rot) * (Math.PI / 180)
      const x = radius * Math.sin(phi) * Math.cos(theta)
      const y = radius * Math.cos(phi)
      const z = radius * Math.sin(phi) * Math.sin(theta)
      return { x: cx + x, y: cy - y, z }
    }

    let animFrame: number

    function draw() {
      if (!ctx) return
      ctx.clearRect(0, 0, size, size)

      rotation += 0.15

      // Draw globe outline
      ctx.beginPath()
      ctx.arc(cx, cy, radius, 0, Math.PI * 2)
      ctx.strokeStyle = 'rgba(186, 218, 85, 0.15)'
      ctx.lineWidth = 1
      ctx.stroke()

      // Draw latitude lines
      for (let lat = -60; lat <= 60; lat += 30) {
        ctx.beginPath()
        const latRadius = radius * Math.cos(lat * (Math.PI / 180))
        const latY = cy - radius * Math.sin(lat * (Math.PI / 180))
        ctx.ellipse(cx, latY, latRadius, latRadius * 0.3, 0, 0, Math.PI * 2)
        ctx.strokeStyle = 'rgba(186, 218, 85, 0.05)'
        ctx.lineWidth = 0.5
        ctx.stroke()
      }

      // Draw longitude lines
      for (let lng = 0; lng < 360; lng += 30) {
        ctx.beginPath()
        const points: Array<{ x: number; y: number; z: number }> = []
        for (let lat = -90; lat <= 90; lat += 5) {
          points.push(latLngToXY(lat, lng, rotation))
        }
        ctx.moveTo(points[0].x, points[0].y)
        points.forEach((p) => {
          if (p.z > 0) {
            ctx.lineTo(p.x, p.y)
          } else {
            ctx.moveTo(p.x, p.y)
          }
        })
        ctx.strokeStyle = 'rgba(186, 218, 85, 0.05)'
        ctx.lineWidth = 0.5
        ctx.stroke()
      }

      // Draw nodes and connections
      const visibleNodes = nodes.map((n) => ({
        ...latLngToXY(n.lat, n.lng, rotation),
        visible: latLngToXY(n.lat, n.lng, rotation).z > 0,
      }))

      // Draw connections between visible nodes
      visibleNodes.forEach((nodeA, i) => {
        if (!nodeA.visible) return
        visibleNodes.forEach((nodeB, j) => {
          if (i >= j || !nodeB.visible) return
          const dx = nodeA.x - nodeB.x
          const dy = nodeA.y - nodeB.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < radius) {
            ctx.beginPath()
            ctx.moveTo(nodeA.x, nodeA.y)
            ctx.lineTo(nodeB.x, nodeB.y)
            ctx.strokeStyle = `rgba(186, 218, 85, ${0.1 * (1 - dist / radius)})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        })
      })

      // Draw nodes
      visibleNodes.forEach((node) => {
        if (!node.visible) return

        // Outer glow
        const gradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, 8)
        gradient.addColorStop(0, 'rgba(186, 218, 85, 0.6)')
        gradient.addColorStop(1, 'rgba(186, 218, 85, 0)')
        ctx.beginPath()
        ctx.arc(node.x, node.y, 8, 0, Math.PI * 2)
        ctx.fillStyle = gradient
        ctx.fill()

        // Core dot
        ctx.beginPath()
        ctx.arc(node.x, node.y, 2.5, 0, Math.PI * 2)
        ctx.fillStyle = '#BADA55'
        ctx.fill()
      })

      animFrame = requestAnimationFrame(draw)
    }

    draw()
    return () => cancelAnimationFrame(animFrame)
  }, [])

  useEffect(() => {
    const cleanup = animate()
    return () => { cleanup?.() }
  }, [animate])

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full globe-glow"
      style={{ maxWidth: '500px', maxHeight: '500px' }}
    />
  )
}

const features = [
  {
    icon: Activity,
    title: 'Real-Time Monitoring',
    description: 'Live system status, power output, battery levels, and performance metrics.',
  },
  {
    icon: Smartphone,
    title: 'Mobile App Control',
    description: 'Monitor and manage your system from anywhere via iOS or Android.',
  },
  {
    icon: Shield,
    title: 'Predictive Maintenance',
    description: 'AI-powered diagnostics detect issues before they cause downtime.',
  },
  {
    icon: Globe,
    title: 'Fleet Management',
    description: 'Manage multiple units across locations from a single dashboard.',
  },
]

export default function SmartConnectGlobe() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <section ref={ref} className="relative py-24 sm:py-32 bg-gradient-to-b from-[#050a05] to-[#0a1a0a] overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-20" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-energenius-teal/5 rounded-full blur-[100px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 glass-card rounded-full px-5 py-2 mb-6">
            <Wifi className="h-4 w-4 text-energenius-teal-light" />
            <span className="text-sm font-medium text-energenius-teal-light uppercase tracking-wider">
              SmartConnect Platform
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Remote Monitoring.{' '}
            <span className="text-gradient-energenius">Total Control.</span>
          </h2>
          <p className="text-lg text-white/50 max-w-2xl mx-auto">
            Every EnerGenius system includes SmartConnect — our cloud monitoring platform
            that keeps you connected to your power infrastructure 24/7.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Globe Side */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 1, delay: 0.3 }}
            className="flex justify-center items-center"
          >
            <div className="relative w-full max-w-[500px] aspect-square">
              <GlobeCanvas />

              {/* Floating badges around globe */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute top-8 right-4 glass-card rounded-lg px-3 py-2"
              >
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-energenius-lime rounded-full animate-pulse" />
                  <span className="text-xs text-white/70">12 Units Online</span>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 4, repeat: Infinity, delay: 1 }}
                className="absolute bottom-12 left-4 glass-card rounded-lg px-3 py-2"
              >
                <div className="flex items-center gap-2">
                  <Activity className="w-3 h-3 text-energenius-lime" />
                  <span className="text-xs text-white/70">99.9% Uptime</span>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Features Side */}
          <div className="space-y-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, x: 30 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.4 + i * 0.15, duration: 0.5 }}
                className="glass-card rounded-2xl p-6 hover:border-energenius-teal-light/30 transition-all hover-lift"
              >
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-xl bg-energenius-teal-light/10 flex items-center justify-center flex-shrink-0">
                    <feature.icon className="h-6 w-6 text-energenius-teal-light" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white mb-1">{feature.title}</h4>
                    <p className="text-sm text-white/50">{feature.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Promo */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 1, duration: 0.5 }}
              className="glass-card rounded-2xl p-6 border-energenius-gold/20 bg-energenius-gold/5"
            >
              <div className="flex items-center gap-4">
                <span className="bg-energenius-gold text-energenius-forest-dark text-xs font-bold px-3 py-1 rounded-full">
                  LIMITED TIME
                </span>
                <p className="text-white font-semibold text-sm">
                  3 Months SmartConnect Pro FREE with any Nomad system
                </p>
              </div>
            </motion.div>

            <Link href="/subscription">
              <Button
                size="lg"
                className="w-full bg-energenius-teal-light hover:bg-energenius-teal text-white font-bold rounded-xl"
              >
                Explore SmartConnect Plans
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
