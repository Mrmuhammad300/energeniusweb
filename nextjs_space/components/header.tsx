'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { Menu, X, ChevronDown, ChevronRight, Calculator } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [desktopDropdownOpen, setDesktopDropdownOpen] = useState(false)
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false)

  // Handle touch events for mobile dropdown to prevent immediate closing
  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      const target = e.target as HTMLElement
      const dropdown = target.closest('.menu-item-has-children, .dropdown-toggle')
      
      if (dropdown && !dropdown.classList.contains('open')) {
        e.preventDefault()
        dropdown.classList.add('open', 'show')
        const submenu = dropdown.querySelector('.dropdown-menu')
        if (submenu) {
          submenu.classList.add('show')
        }
      }
    }

    // Add event listeners to dropdown toggles
    const dropdowns = document.querySelectorAll('.menu-item-has-children > a, .dropdown-toggle')
    dropdowns.forEach(link => {
      link.addEventListener('touchstart', handleTouchStart as EventListener, { passive: false })
    })

    // Cleanup
    return () => {
      dropdowns.forEach(link => {
        link.removeEventListener('touchstart', handleTouchStart as EventListener)
      })
    }
  }, [mobileMenuOpen, mobileDropdownOpen])

  const productLinks = [
    { href: '/products', label: 'All Products', description: 'Browse our full catalog' },
    { href: '/residential', label: 'Residential', description: 'Home backup solutions' },
    { href: '/commercial', label: 'Commercial', description: 'Business power systems' },
    { href: '/subscription', label: 'Smart Connect', description: 'Monitoring & maintenance' },
  ]

  return (
    <header className="mobile-header sticky top-0 z-[9999] w-full border-b bg-white shadow-sm">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-x-2 px-3 py-3 lg:gap-x-4 lg:px-8 lg:py-4">
        {/* Mobile Hamburger - Left Side */}
        <div className="flex items-center lg:hidden shrink-0">
          <button
            type="button"
            className="hamburger-menu inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:bg-gray-100 active:bg-gray-200 transition-colors touch-manipulation"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            <span className="sr-only">Open main menu</span>
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>

        {/* Logo - Center on Mobile, Left on Desktop */}
        <div className="flex flex-1 justify-center lg:justify-start lg:mr-6">
          <Link href="/" className="flex items-center space-x-2 shrink-0">
            <Image
              src="/energenius-badge.png"
              alt="EnerGenius Logo"
              width={36}
              height={36}
              className="object-contain w-9 h-9"
              priority
            />
            <span className="text-lg lg:text-2xl font-bold bg-gradient-to-r from-emerald-600 to-sky-600 bg-clip-text text-transparent whitespace-nowrap">
              EnerGenius
            </span>
          </Link>
        </div>
        
        {/* Mobile Action Buttons - Right Side */}
        <div className="mobile-actions flex items-center gap-1.5 lg:hidden shrink-0">
          {/* Calculator Button */}
          <Link href="/calculators" className="inline-flex">
            <Button 
              size="sm" 
              variant="outline"
              className="border-2 border-emerald-600 text-emerald-700 hover:bg-emerald-50 active:bg-emerald-100 transition-colors touch-manipulation px-2 py-2 h-9 w-9 min-w-[36px]"
              aria-label="Solar Calculator"
              title="Solar Calculator"
            >
              <Calculator className="h-4 w-4" />
            </Button>
          </Link>
          {/* Quote Button */}
          <Link href="/quote" className="inline-flex">
            <Button 
              size="sm" 
              className="bg-gradient-to-r from-emerald-600 to-sky-600 text-white hover:from-emerald-700 hover:to-sky-700 active:from-emerald-800 active:to-sky-800 transition-all touch-manipulation text-xs font-semibold px-2.5 py-2 h-9 whitespace-nowrap"
            >
              Quote
            </Button>
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        <div className="hidden lg:flex lg:gap-x-3 xl:gap-x-6 lg:items-center">
          {/* Products & Services Dropdown */}
          <div 
            className="relative menu-item-has-children"
            onMouseEnter={() => setDesktopDropdownOpen(true)}
            onMouseLeave={() => setDesktopDropdownOpen(false)}
          >
            <button
              className="dropdown-toggle flex items-center gap-1 text-xs xl:text-sm font-semibold leading-6 text-gray-900 hover:text-emerald-600 transition-colors whitespace-nowrap"
              aria-expanded={desktopDropdownOpen}
              aria-haspopup="true"
            >
              Products & Services
              <ChevronDown className={`h-4 w-4 transition-transform ${desktopDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {desktopDropdownOpen && (
              <div className="dropdown-menu absolute left-0 top-full mt-2 w-64 rounded-lg bg-white shadow-lg ring-1 ring-gray-900/5 z-50">
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
          <Link href="/pricing" className="text-xs xl:text-sm font-semibold leading-6 text-gray-900 hover:text-emerald-600 transition-colors whitespace-nowrap">
            Pricing
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
      
      {/* Mobile Menu - Slides from LEFT with Animation */}
      <div className={`mobile-nav-container lg:hidden fixed inset-0 z-[60] transition-opacity duration-300 ${mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        {/* Backdrop overlay */}
        <div 
          className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${mobileMenuOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => {
            setMobileMenuOpen(false)
            setMobileDropdownOpen(false)
          }}
          aria-hidden="true"
        />
        
        {/* Mobile menu panel - Slides FROM LEFT */}
        <div className={`absolute inset-y-0 left-0 w-full max-w-xs bg-white shadow-2xl overflow-y-auto transition-transform duration-300 ease-out ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="flex items-center justify-between px-5 py-5 border-b border-gray-200">
            <Link href="/" className="flex items-center space-x-2.5" onClick={() => {
              setMobileMenuOpen(false)
              setMobileDropdownOpen(false)
            }}>
              <Image
                src="/energenius-badge.png"
                alt="EnerGenius Logo"
                width={32}
                height={32}
                className="object-contain"
              />
              <span className="text-lg font-bold bg-gradient-to-r from-emerald-600 to-sky-600 bg-clip-text text-transparent">
                EnerGenius
              </span>
            </Link>
            <button
              type="button"
              className="rounded-md p-2 text-gray-700 hover:bg-gray-100 transition-colors touch-manipulation active:bg-gray-200"
              onClick={() => {
                setMobileMenuOpen(false)
                setMobileDropdownOpen(false)
              }}
              aria-label="Close navigation menu"
            >
              <span className="sr-only">Close menu</span>
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
            
            <div className="py-4 px-2">
              <div className="space-y-1">
                {/* Products & Services Section with Dropdown */}
                <div className="mb-2 menu-item-has-children">
                  <button
                    onClick={() => setMobileDropdownOpen(!mobileDropdownOpen)}
                    className="dropdown-toggle flex items-center justify-between w-full px-4 py-3.5 text-sm font-semibold text-gray-900 bg-white hover:bg-emerald-50 active:bg-emerald-100 touch-manipulation transition-all duration-200 rounded-lg border border-gray-200"
                    aria-expanded={mobileDropdownOpen}
                    aria-controls="mobile-products-dropdown"
                  >
                    <span className="flex items-center gap-2">
                      Products & Services
                    </span>
                    <ChevronDown 
                      className={`h-5 w-5 text-emerald-600 transition-transform duration-200 ${mobileDropdownOpen ? 'rotate-180' : ''}`} 
                      aria-hidden="true"
                    />
                  </button>
                  
                  {/* Dropdown Items - Animated */}
                  <div 
                    className={`dropdown-menu overflow-hidden transition-all duration-300 ease-in-out ${
                      mobileDropdownOpen ? 'max-h-96 opacity-100 mt-2' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <div className="ml-2 space-y-1 border-l-2 border-emerald-500 pl-3 py-1">
                      {productLinks.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          className="block px-4 py-3 hover:bg-emerald-50 active:bg-emerald-100 touch-manipulation transition-colors rounded-lg border border-transparent hover:border-emerald-200"
                          onClick={() => {
                            setMobileMenuOpen(false)
                            setMobileDropdownOpen(false)
                          }}
                        >
                          <div className="font-semibold text-sm text-gray-900">
                            {link.label}
                          </div>
                          <div className="text-xs text-gray-600 mt-0.5">
                            {link.description}
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Main Navigation Links */}
                <Link 
                  href="/dashboard" 
                  className="block px-4 py-3.5 text-sm font-semibold text-gray-900 bg-white hover:bg-emerald-50 active:bg-emerald-100 touch-manipulation transition-colors rounded-lg border border-gray-200" 
                  onClick={() => {
                    setMobileMenuOpen(false)
                    setMobileDropdownOpen(false)
                  }}
                >
                  Dashboard
                </Link>
                <Link 
                  href="/calculators" 
                  className="block px-4 py-3.5 text-sm font-semibold text-gray-900 bg-white hover:bg-emerald-50 active:bg-emerald-100 touch-manipulation transition-colors rounded-lg border border-gray-200" 
                  onClick={() => {
                    setMobileMenuOpen(false)
                    setMobileDropdownOpen(false)
                  }}
                >
                  Calculators
                </Link>
                <Link 
                  href="/pricing" 
                  className="block px-4 py-3.5 text-sm font-semibold text-gray-900 bg-white hover:bg-emerald-50 active:bg-emerald-100 touch-manipulation transition-colors rounded-lg border border-gray-200" 
                  onClick={() => {
                    setMobileMenuOpen(false)
                    setMobileDropdownOpen(false)
                  }}
                >
                  Pricing
                </Link>
                <Link 
                  href="/education" 
                  className="block px-4 py-3.5 text-sm font-semibold text-gray-900 bg-white hover:bg-emerald-50 active:bg-emerald-100 touch-manipulation transition-colors rounded-lg border border-gray-200" 
                  onClick={() => {
                    setMobileMenuOpen(false)
                    setMobileDropdownOpen(false)
                  }}
                >
                  Education
                </Link>
                <Link 
                  href="/about" 
                  className="block px-4 py-3.5 text-sm font-semibold text-gray-900 bg-white hover:bg-emerald-50 active:bg-emerald-100 touch-manipulation transition-colors rounded-lg border border-gray-200" 
                  onClick={() => {
                    setMobileMenuOpen(false)
                    setMobileDropdownOpen(false)
                  }}
                >
                  About
                </Link>
                <Link 
                  href="/contact" 
                  className="block px-4 py-3.5 text-sm font-semibold text-gray-900 bg-white hover:bg-emerald-50 active:bg-emerald-100 touch-manipulation transition-colors rounded-lg border border-gray-200" 
                  onClick={() => {
                    setMobileMenuOpen(false)
                    setMobileDropdownOpen(false)
                  }}
                >
                  Contact
                </Link>
                
                {/* Full Width Quote Button */}
                <div className="pt-6 px-4">
                  <Link href="/quote" onClick={() => {
                    setMobileMenuOpen(false)
                    setMobileDropdownOpen(false)
                  }}>
                    <Button className="w-full bg-gradient-to-r from-emerald-600 to-sky-600 text-white hover:from-emerald-700 hover:to-sky-700 active:from-emerald-800 active:to-sky-800 touch-manipulation py-3 text-sm font-semibold rounded-lg">
                      Request Full Quote
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
        </div>
      </div>
    </header>
  )
}
