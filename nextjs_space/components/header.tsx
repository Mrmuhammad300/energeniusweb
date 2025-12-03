'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

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
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700 hover:bg-gray-100 transition-colors"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            <span className="sr-only">Open main menu</span>
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        
        <div className="hidden lg:flex lg:gap-x-3 xl:gap-x-6">
          <Link href="/products" className="text-xs xl:text-sm font-semibold leading-6 text-gray-900 hover:text-emerald-600 transition-colors whitespace-nowrap">
            Products
          </Link>
          <Link href="/residential" className="text-xs xl:text-sm font-semibold leading-6 text-gray-900 hover:text-emerald-600 transition-colors whitespace-nowrap">
            Residential
          </Link>
          <Link href="/commercial" className="text-xs xl:text-sm font-semibold leading-6 text-gray-900 hover:text-emerald-600 transition-colors whitespace-nowrap">
            Commercial
          </Link>
          <Link href="/subscription" className="text-xs xl:text-sm font-semibold leading-6 text-emerald-600 hover:text-emerald-700 transition-colors whitespace-nowrap">
            Smart Connect
          </Link>
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
      
      {mobileMenuOpen && (
        <div className="lg:hidden">
          <div className="fixed inset-0 z-50" />
          <div className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm">
            <div className="flex items-center justify-between">
              <Link href="/" className="-m-1.5 p-1.5 flex items-center space-x-3">
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
                className="-m-2.5 rounded-md p-2.5 text-gray-700 hover:bg-gray-100 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close navigation menu"
              >
                <span className="sr-only">Close menu</span>
                <X className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <div className="mt-6 flow-root">
              <div className="space-y-2 py-6">
                <Link href="/products" className="block rounded-lg px-3 py-2 text-base font-semibold text-gray-900 hover:bg-emerald-50" onClick={() => setMobileMenuOpen(false)}>
                  Products
                </Link>
                <Link href="/residential" className="block rounded-lg px-3 py-2 text-base font-semibold text-gray-900 hover:bg-emerald-50" onClick={() => setMobileMenuOpen(false)}>
                  Residential
                </Link>
                <Link href="/commercial" className="block rounded-lg px-3 py-2 text-base font-semibold text-gray-900 hover:bg-emerald-50" onClick={() => setMobileMenuOpen(false)}>
                  Commercial
                </Link>
                <Link href="/subscription" className="block rounded-lg px-3 py-2 text-base font-semibold text-emerald-600 hover:bg-emerald-50" onClick={() => setMobileMenuOpen(false)}>
                  Smart Connect
                </Link>
                <Link href="/dashboard" className="block rounded-lg px-3 py-2 text-base font-semibold text-gray-900 hover:bg-emerald-50" onClick={() => setMobileMenuOpen(false)}>
                  Dashboard
                </Link>
                <Link href="/calculators" className="block rounded-lg px-3 py-2 text-base font-semibold text-gray-900 hover:bg-emerald-50" onClick={() => setMobileMenuOpen(false)}>
                  Calculators
                </Link>
                <Link href="/education" className="block rounded-lg px-3 py-2 text-base font-semibold text-gray-900 hover:bg-emerald-50" onClick={() => setMobileMenuOpen(false)}>
                  Education
                </Link>
                <Link href="/about" className="block rounded-lg px-3 py-2 text-base font-semibold text-gray-900 hover:bg-emerald-50" onClick={() => setMobileMenuOpen(false)}>
                  About
                </Link>
                <Link href="/contact" className="block rounded-lg px-3 py-2 text-base font-semibold text-gray-900 hover:bg-emerald-50" onClick={() => setMobileMenuOpen(false)}>
                  Contact
                </Link>
                <div className="pt-4">
                  <Link href="/quote" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full bg-gradient-to-r from-emerald-600 to-sky-600 text-white">
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
