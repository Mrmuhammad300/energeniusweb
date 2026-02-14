'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { Menu, X, ChevronDown, Calculator, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [desktopDropdownOpen, setDesktopDropdownOpen] = useState(false)
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false)

  const mainLinks = [
    { href: '/products', label: 'Products' },
    { href: '/calculators', label: 'Calculator' },
    { href: '/subscription', label: 'SmartConnect' },
    { href: '/support', label: 'Support' },
  ]

  const moreLinks = [
    { href: '/residential', label: 'Residential Solutions', description: 'Home backup power' },
    { href: '/commercial', label: 'Commercial Solutions', description: 'Business & industrial' },
    { href: '/dashboard', label: 'Customer Dashboard', description: 'Manage your system' },
  ]

  return (
    <header className="sticky top-0 z-[9999] w-full border-b border-eg-lime/10 bg-white shadow-sm">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 lg:px-8">
        {/* Mobile Hamburger - Left Side */}
        <div className="flex items-center lg:hidden">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:bg-eg-forest/5 transition-colors"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open navigation menu"
          >
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>

        {/* Logo - Center on Mobile, Left on Desktop */}
        <div className="flex flex-1 justify-center lg:justify-start lg:flex-none">
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/energenius-badge.png"
              alt="EnerGenius Logo"
              width={36}
              height={36}
              className="object-contain"
              priority
            />
            <span className="text-lg lg:text-xl font-bold bg-gradient-to-r from-eg-forest to-eg-leaf-dark bg-clip-text text-transparent">
              EnerGenius
            </span>
          </Link>
        </div>

        {/* Mobile Action Buttons - Right Side */}
        <div className="flex items-center gap-2 lg:hidden">
          <Link href="/calculators">
            <Button
              size="sm"
              variant="outline"
              className="border-eg-forest text-eg-forest hover:bg-eg-forest/5 text-xs font-semibold px-2"
              aria-label="Calculator"
            >
              <Calculator className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/quote">
            <Button
              size="sm"
              className="bg-eg-forest hover:bg-eg-forest-dark text-white text-xs font-semibold px-3"
            >
              Assessment
            </Button>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex lg:items-center lg:gap-8 lg:ml-10">
          {mainLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-gray-700 hover:text-eg-forest transition-colors"
            >
              {link.label}
            </Link>
          ))}

          {/* More Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setDesktopDropdownOpen(true)}
            onMouseLeave={() => setDesktopDropdownOpen(false)}
          >
            <button
              className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-eg-forest transition-colors py-2"
              aria-expanded={desktopDropdownOpen}
              onClick={() => setDesktopDropdownOpen(!desktopDropdownOpen)}
            >
              More
              <ChevronDown className={`h-4 w-4 transition-transform ${desktopDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {desktopDropdownOpen && (
              <div className="absolute left-0 top-full pt-1 w-56 z-50">
                <div className="absolute -top-1 left-0 right-0 h-2 bg-transparent" />
                <div className="rounded-lg bg-white shadow-lg ring-1 ring-gray-900/5">
                  <div className="p-2">
                    {moreLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="block rounded-lg px-4 py-3 hover:bg-eg-forest/5 transition-colors"
                        onClick={() => setDesktopDropdownOpen(false)}
                      >
                        <div className="font-medium text-sm text-gray-900">{link.label}</div>
                        <div className="text-xs text-gray-500 mt-0.5">{link.description}</div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Desktop CTA */}
        <div className="hidden lg:flex lg:items-center lg:gap-3 lg:ml-auto">
          <Link href="/calculators">
            <Button variant="outline" className="border-eg-forest text-eg-forest hover:bg-eg-forest/5 font-semibold">
              <Calculator className="mr-2 h-4 w-4" />
              Calculator
            </Button>
          </Link>
          <Link href="/quote">
            <Button className="bg-eg-forest hover:bg-eg-forest-dark text-white font-semibold">
              <Calendar className="mr-2 h-4 w-4" />
              Get Assessment
            </Button>
          </Link>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`lg:hidden fixed inset-0 z-[60] transition-opacity duration-300 ${mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
        />

        {/* Menu Panel */}
        <div className={`absolute inset-y-0 left-0 w-full max-w-xs bg-white shadow-2xl overflow-y-auto transition-transform duration-300 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b">
            <Link href="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center space-x-2">
              <Image
                src="/energenius-badge.png"
                alt="EnerGenius Logo"
                width={32}
                height={32}
                className="object-contain"
              />
              <span className="text-lg font-bold bg-gradient-to-r from-eg-forest to-eg-leaf-dark bg-clip-text text-transparent">
                EnerGenius
              </span>
            </Link>
            <button
              className="rounded-md p-2 text-gray-700 hover:bg-gray-100"
              onClick={() => setMobileMenuOpen(false)}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Primary CTA */}
          <div className="p-4 bg-eg-forest/5 border-b">
            <Link href="/quote" onClick={() => setMobileMenuOpen(false)}>
              <Button className="w-full bg-eg-forest hover:bg-eg-forest-dark text-white font-semibold py-6">
                <Calendar className="mr-2 h-5 w-5" />
                Get Free Assessment
              </Button>
            </Link>
            <p className="text-xs text-center text-eg-forest mt-2">15 minutes &bull; No obligation</p>
          </div>

          {/* Navigation Links */}
          <div className="py-4 px-4 space-y-1">
            {mainLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 text-base font-medium text-gray-900 hover:bg-eg-forest/5 rounded-lg transition-colors"
              >
                {link.label}
              </Link>
            ))}

            {/* More Section */}
            <div className="pt-4 mt-4 border-t">
              <button
                onClick={() => setMobileDropdownOpen(!mobileDropdownOpen)}
                className="flex items-center justify-between w-full px-4 py-3 text-base font-medium text-gray-900 hover:bg-eg-forest/5 rounded-lg"
              >
                More Options
                <ChevronDown className={`h-5 w-5 transition-transform ${mobileDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {mobileDropdownOpen && (
                <div className="ml-4 mt-2 space-y-1 border-l-2 border-eg-forest/20 pl-4">
                  {moreLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block py-2.5 text-sm text-gray-600 hover:text-eg-forest"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Links */}
            <div className="pt-4 mt-4 border-t">
              <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">Quick Links</div>
              <Link
                href="/about"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-2.5 text-sm text-gray-600 hover:text-eg-forest"
              >
                About Us
              </Link>
              <Link
                href="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-2.5 text-sm text-gray-600 hover:text-eg-forest"
              >
                Contact
              </Link>
              <Link
                href="/education"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-2.5 text-sm text-gray-600 hover:text-eg-forest"
              >
                Learning Center
              </Link>
            </div>
          </div>

          {/* Footer */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gray-50 border-t">
            <p className="text-xs text-gray-500 text-center">
              Questions? Call <a href="tel:+18005551234" className="text-eg-forest font-medium">1-800-ENERGENIUS</a>
            </p>
          </div>
        </div>
      </div>
    </header>
  )
}
