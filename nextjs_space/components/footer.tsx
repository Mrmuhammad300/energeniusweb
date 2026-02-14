'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin, Wifi, Globe } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'

function FooterGlobe() {
  return (
    <div className="relative w-32 h-32 mx-auto lg:mx-0">
      <svg viewBox="0 0 120 120" className="w-full h-full animate-globe-rotate" style={{ transformOrigin: 'center center' }}>
        <circle cx="60" cy="60" r="50" fill="none" stroke="#1A5D1A" strokeWidth="0.8" opacity="0.3" />
        <ellipse cx="60" cy="60" rx="50" ry="18" fill="none" stroke="#1A5D1A" strokeWidth="0.4" opacity="0.2" />
        <ellipse cx="60" cy="60" rx="18" ry="50" fill="none" stroke="#1A5D1A" strokeWidth="0.4" opacity="0.2" />
        <circle cx="45" cy="42" r="2.5" fill="#BADA55" className="animate-node-pulse" style={{ animationDelay: '0s' }} />
        <circle cx="78" cy="55" r="2" fill="#BADA55" className="animate-node-pulse" style={{ animationDelay: '0.6s' }} />
        <circle cx="55" cy="75" r="2" fill="#BADA55" className="animate-node-pulse" style={{ animationDelay: '1.2s' }} />
        <circle cx="35" cy="62" r="1.5" fill="#BADA55" className="animate-node-pulse" style={{ animationDelay: '0.3s' }} />
        <circle cx="70" cy="40" r="1.5" fill="#BADA55" className="animate-node-pulse" style={{ animationDelay: '0.9s' }} />
        <line x1="45" y1="42" x2="78" y2="55" stroke="#BADA55" strokeWidth="0.3" opacity="0.3" />
        <line x1="45" y1="42" x2="35" y2="62" stroke="#BADA55" strokeWidth="0.3" opacity="0.3" />
        <line x1="55" y1="75" x2="78" y2="55" stroke="#BADA55" strokeWidth="0.3" opacity="0.3" />
        <line x1="70" y1="40" x2="78" y2="55" stroke="#BADA55" strokeWidth="0.3" opacity="0.3" />
      </svg>
    </div>
  )
}

export default function Footer() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleNewsletterSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'footer' }),
      })

      if (response.ok) {
        toast({
          title: 'Success!',
          description: 'You\'ve been subscribed to our newsletter.',
        })
        setEmail('')
      } else {
        throw new Error('Failed to subscribe')
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to subscribe. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <footer className="bg-[#0a0a0a] text-gray-300">
      {/* SmartConnect Banner */}
      <div className="border-b border-eg-forest/20">
        <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-10">
            <FooterGlobe />
            <div className="flex-1 text-center lg:text-left">
              <div className="flex items-center gap-2 justify-center lg:justify-start mb-2">
                <Wifi className="h-4 w-4 text-eg-teal-light" />
                <span className="text-sm font-semibold text-eg-teal-light uppercase tracking-wider">SmartConnect&trade;</span>
              </div>
              <p className="text-white font-bold text-lg">Remote Monitoring &amp; Fleet Management</p>
              <p className="text-slate-400 text-sm mt-1">
                Monitor every EnerGenius unit from anywhere. Real-time dashboards, proactive alerts, and intelligent load management.
              </p>
            </div>
            <Link href="/subscription">
              <Button className="bg-eg-teal-light hover:bg-eg-teal text-white font-semibold whitespace-nowrap">
                Explore Plans
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="mb-4">
              <Image
                src="/energenius-badge.png"
                alt="EnerGenius Logo"
                width={60}
                height={60}
                className="object-contain mb-3"
              />
            </div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-eg-lime to-eg-teal-light bg-clip-text text-transparent mb-2">
              EnerGenius
            </h3>
            <p className="text-xs text-gray-500 mb-3">
              by Renewable Resource Group LLC
            </p>
            <p className="text-sm text-gray-400 mb-4">
              Professional-grade solar generators with true black start technology. Your energy independence partner.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-eg-lime transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-eg-lime transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-eg-lime transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-eg-lime transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Products</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/products" className="hover:text-eg-lime transition-colors">All Products</Link></li>
              <li><Link href="/commercial" className="hover:text-eg-lime transition-colors">Nomad Series (Commercial)</Link></li>
              <li><Link href="/residential" className="hover:text-eg-lime transition-colors">Guardian Series (Residential)</Link></li>
              <li><Link href="/subscription" className="hover:text-eg-lime transition-colors">SmartConnect Plans</Link></li>
              <li><Link href="/education" className="hover:text-eg-lime transition-colors">Learning Center</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="hover:text-eg-lime transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-eg-lime transition-colors">Contact</Link></li>
              <li><Link href="/quote" className="hover:text-eg-lime transition-colors">Request Quote</Link></li>
              <li><Link href="/support" className="hover:text-eg-lime transition-colors">Support Hub</Link></li>
            </ul>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-eg-lime" />
                <span>1-800-ENERGENIUS</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-eg-lime" />
                <span>support@energenius.com</span>
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Stay Updated</h4>
            <p className="text-sm text-gray-400 mb-4">
              Get the latest news, product launches, and exclusive offers.
            </p>
            <form onSubmit={handleNewsletterSignup} className="space-y-2">
              <Input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500 focus:border-eg-lime focus:ring-eg-lime/20"
              />
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-eg-forest hover:bg-eg-forest-light text-white"
              >
                {loading ? 'Subscribing...' : 'Subscribe'}
              </Button>
            </form>
          </div>
        </div>

        {/* Service Areas */}
        <div className="mt-8 pt-8 border-t border-gray-800">
          <div className="flex items-center justify-center gap-2 text-sm text-gray-400 mb-4">
            <MapPin className="h-4 w-4 text-eg-lime" />
            <span className="font-semibold">Nationwide Service:</span>
            <span>All 50 US States | Fast Shipping Everywhere</span>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} EnerGenius by Renewable Resource Group LLC. All rights reserved.</p>
          <p className="mt-2 text-gray-500">
            5-Year Warranty | 30% Federal Tax Credit Eligible | Free Shipping on Orders $2,000+ | SmartConnect&trade; Monitoring
          </p>
          <p className="mt-3 text-xs text-gray-600 max-w-3xl mx-auto">
            Tax credit eligibility depends on individual circumstances and is subject to IRS regulations.
            Consult a qualified tax professional. EnerGenius does not provide tax, legal, or accounting advice.
            SmartConnect 3-month free trial applies to qualifying Nomad Series purchases (5kW+) with installation.
            Offer subject to change.
          </p>
        </div>
      </div>
    </footer>
  )
}
