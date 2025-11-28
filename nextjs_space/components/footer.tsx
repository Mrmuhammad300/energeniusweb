'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'

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
    <footer className="bg-gray-900 text-gray-300">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-sky-400 bg-clip-text text-transparent mb-2">
              EnerGenius
            </h3>
            <p className="text-xs text-gray-500 mb-3">
              by Renewable Resource Group LLC
            </p>
            <p className="text-sm text-gray-400 mb-4">
              Professional-grade solar generators with fast shipping and exceptional support. Your energy independence partner.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/products" className="hover:text-emerald-400 transition-colors">All Products</Link></li>
              <li><Link href="/residential" className="hover:text-emerald-400 transition-colors">Residential Solutions</Link></li>
              <li><Link href="/commercial" className="hover:text-emerald-400 transition-colors">Commercial Solutions</Link></li>
              <li><Link href="/education" className="hover:text-emerald-400 transition-colors">Learning Center</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="hover:text-emerald-400 transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-emerald-400 transition-colors">Contact</Link></li>
              <li><Link href="/quote" className="hover:text-emerald-400 transition-colors">Request Quote</Link></li>
            </ul>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-emerald-400" />
                <span>1-800-ENERGENIUS</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-emerald-400" />
                <span>support@energenius.com</span>
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Stay Updated</h4>
            <p className="text-sm text-gray-400 mb-4">
              Get the latest news and exclusive offers delivered to your inbox.
            </p>
            <form onSubmit={handleNewsletterSignup} className="space-y-2">
              <Input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
              />
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-emerald-600 to-sky-600 text-white hover:from-emerald-700 hover:to-sky-700"
              >
                {loading ? 'Subscribing...' : 'Subscribe'}
              </Button>
            </form>
          </div>
        </div>

        {/* Service Areas */}
        <div className="mt-8 pt-8 border-t border-gray-800">
          <div className="flex items-center justify-center gap-2 text-sm text-gray-400 mb-4">
            <MapPin className="h-4 w-4 text-emerald-400" />
            <span className="font-semibold">Service Areas:</span>
            <span>Ohio | Texas | Arizona | New Mexico | Midwest Region</span>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} EnerGenius. All rights reserved.</p>
          <p className="mt-2">5-Year Warranty | 30% Federal Tax Credit Eligible | Free Shipping on Orders $2,000+</p>
        </div>
      </div>
    </footer>
  )
}
