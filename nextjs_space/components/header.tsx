'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { Menu, X, ChevronDown, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [desktopDropdownOpen, setDesktopDropdownOpen] = useState(false)
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false)

  const productLinks = [
    { href: '/products', label: 'All Products', description: 'Browse our full catalog' },
    { href: '/residential', label: 'Residential', description: 'Home backup solutions' },
    { href: '/commercial', label: 'Commercial', description: 'Business power systems' },
    { href: '/subscription', label: 'Smart Connect', description: 'Monitoring & maintenance' },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-x-4 p-4 lg:px-8">
        <div className="flex lg:flex-1 lg:mr-6">
          <Link href="/" className="-m-1.5 p-1.5 flex items-center space-x-2.5 shrink-0">
            <Image
              src="/energenius-badge.png"
              alt="EnerGenius Logo"
              width={40}
              height={40}
              className="object-contain"
              priority
            />
            <span className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-emerald-600 to-sky-600 bg-clip-text text-transparent whitespace-nowrap">
              EnerGenius
            </span>
          </Link>
        </div>
        
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700 hover:bg-gray-100 transition-colors touch-manipulation"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            <span className="sr-only">Open main menu</span>
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        
        {/* Desktop Navigation */}
        <div className="hidden lg:flex lg:gap-x-3 xl:gap-x-6 lg:items-center">
          {/* Products & Services Dropdown */}
          <div 
            className="relative"
            onMouseEnter={() => setDesktopDropdownOpen(true)}
            onMouseLeave={() => setDesktopDropdownOpen(false)}
          >
            <button
              className="flex items-center gap-1 text-xs xl:text-sm font-semibold leading-6 text-gray-900 hover:text-emerald-600 transition-colors whitespace-nowrap"
              aria-expanded={desktopDropdownOpen}
              aria-haspopup="true"
            >
              Products & Services
              <ChevronDown className={`h-4 w-4 transition-transform ${desktopDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {desktopDropdownOpen && (
              <div className="absolute left-0 top-full mt-2 w-64 rounded-lg bg-white shadow-lg ring-1 ring-gray-900/5 z-50">
                <div className="p-2">
                  {productLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="block rounded-lg px-4 py-3 hover:bg-emerald-50 transition-colors group"
                    >
                      <div className="font-semibold text-sm text-gray-900 group-hover:text-emerald-600">
                        {link.label}
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">
                        {link.description}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Link href="/dashboard" className="text-xs xl:text-sm font-semibold leading-6 text-gray-900 hover:text-emerald-600 transition-colors whitespace-nowrap">
            Dashboard
          </Link>
          <Link href="/calculators" className="text-xs xl:text-sm font-semibold leading-6 text-gray-900 hover:text-emerald-600 transition-colors whitespace-nowrap">
            Calculators
          </Link>
          <Link href="/education" className="text-xs xl:text-sm font-semibold leading-6 text-gray-900 hover:text-emerald-600 transition-colors whitespace-nowrap">
            Education
          </Link>
          <Link href="/about" className="text-xs xl:text-sm font-semibold leading-6 text-gray-900 hover:text-emerald-600 transition-colors whitespace-nowrap">
            About
          </Link>
          <Link href="/contact" className="text-xs xl:text-sm font-semibold leading-6 text-gray-900 hover:text-emerald-600 transition-colors whitespace-nowrap">
            Contact
          </Link>
        </div>
        
        <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-x-4 lg:ml-4">
          <Link href="/quote">
            <Button className="bg-gradient-to-r from-emerald-600 to-sky-600 text-white hover:from-emerald-700 hover:to-sky-700 whitespace-nowrap">
              Request Quote
            </Button>
          </Link>
        </div>
      </nav>
      
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden">
          {/* Backdrop overlay */}
          <div 
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm" 
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />
          {/* Mobile menu panel */}
          <div className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10 shadow-xl">
            <div className="flex items-center justify-between">
              <Link href="/" className="-m-1.5 p-1.5 flex items-center space-x-3" onClick={() => setMobileMenuOpen(false)}>
                <Image
                  src="/energenius-badge.png"
                  alt="EnerGenius Logo"
                  width={36}
                  height={36}
                  className="object-contain"
                />
                <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-sky-600 bg-clip-text text-transparent">
                  EnerGenius
                </span>
              </Link>
              <button
                type="button"
                className="-m-2.5 rounded-md p-2.5 text-gray-700 hover:bg-gray-100 transition-colors touch-manipulation active:bg-gray-200"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close navigation menu"
              >
                <span className="sr-only">Close menu</span>
                <X className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            
            <div className="mt-6 flow-root">
              <div className="space-y-1 py-6">
                {/* Mobile Products & Services Expandable Section */}
                <div>
                  <button
                    onClick={() => setMobileDropdownOpen(!mobileDropdownOpen)}
                    className="flex items-center justify-between w-full rounded-lg px-4 py-3 text-base font-semibold text-gray-900 hover:bg-emerald-50 active:bg-emerald-100 touch-manipulation transition-colors"
                    aria-expanded={mobileDropdownOpen}
                  >
                    <span>Products & Services</span>
                    <ChevronRight className={`h-5 w-5 transition-transform ${mobileDropdownOpen ? 'rotate-90' : ''}`} />
                  </button>
                  
                  {mobileDropdownOpen && (
                    <div className="mt-1 ml-4 space-y-1">
                      {productLinks.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          className="block rounded-lg px-4 py-3 text-sm hover:bg-emerald-50 active:bg-emerald-100 touch-manipulation transition-colors"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <div className="font-semibold text-gray-900">
                            {link.label}
                          </div>
                          <div className="text-xs text-gray-500 mt-0.5">
                            {link.description}
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                <Link 
                  href="/dashboard" 
                  className="block rounded-lg px-4 py-3 text-base font-semibold text-gray-900 hover:bg-emerald-50 active:bg-emerald-100 touch-manipulation transition-colors" 
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link 
                  href="/calculators" 
                  className="block rounded-lg px-4 py-3 text-base font-semibold text-gray-900 hover:bg-emerald-50 active:bg-emerald-100 touch-manipulation transition-colors" 
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Calculators
                </Link>
                <Link 
                  href="/education" 
                  className="block rounded-lg px-4 py-3 text-base font-semibold text-gray-900 hover:bg-emerald-50 active:bg-emerald-100 touch-manipulation transition-colors" 
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Education
                </Link>
                <Link 
                  href="/about" 
                  className="block rounded-lg px-4 py-3 text-base font-semibold text-gray-900 hover:bg-emerald-50 active:bg-emerald-100 touch-manipulation transition-colors" 
                  onClick={() => setMobileMenuOpen(false)}
                >
                  About
                </Link>
                <Link 
                  href="/contact" 
                  className="block rounded-lg px-4 py-3 text-base font-semibold text-gray-900 hover:bg-emerald-50 active:bg-emerald-100 touch-manipulation transition-colors" 
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Contact
                </Link>
                
                <div className="pt-4">
                  <Link href="/quote" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full bg-gradient-to-r from-emerald-600 to-sky-600 text-white hover:from-emerald-700 hover:to-sky-700 active:from-emerald-800 active:to-sky-800 touch-manipulation py-3 text-base">
                      Request Quote
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
