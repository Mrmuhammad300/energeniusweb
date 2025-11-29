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
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-4 lg:px-8">
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5 flex items-center space-x-3">
            <Image
              src="/energenius-badge.png"
              alt="EnerGenius Logo"
              width={40}
              height={40}
              className="object-contain"
              priority
            />
            <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-sky-600 bg-clip-text text-transparent">
              EnerGenius
            </span>
          </Link>
        </div>
        
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <Menu className="h-6 w-6" />
          </button>
        </div>
        
        <div className="hidden lg:flex lg:gap-x-8">
          <Link href="/products" className="text-sm font-semibold leading-6 text-gray-900 hover:text-emerald-600 transition-colors">
            Products
          </Link>
          <Link href="/residential" className="text-sm font-semibold leading-6 text-gray-900 hover:text-emerald-600 transition-colors">
            Residential
          </Link>
          <Link href="/commercial" className="text-sm font-semibold leading-6 text-gray-900 hover:text-emerald-600 transition-colors">
            Commercial
          </Link>
          <Link href="/calculators" className="text-sm font-semibold leading-6 text-gray-900 hover:text-emerald-600 transition-colors">
            Calculators
          </Link>
          <Link href="/education" className="text-sm font-semibold leading-6 text-gray-900 hover:text-emerald-600 transition-colors">
            Education
          </Link>
          <Link href="/about" className="text-sm font-semibold leading-6 text-gray-900 hover:text-emerald-600 transition-colors">
            About
          </Link>
          <Link href="/contact" className="text-sm font-semibold leading-6 text-gray-900 hover:text-emerald-600 transition-colors">
            Contact
          </Link>
        </div>
        
        <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-x-4">
          <Link href="/quote">
            <Button className="bg-gradient-to-r from-emerald-600 to-sky-600 text-white hover:from-emerald-700 hover:to-sky-700">
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
                className="-m-2.5 rounded-md p-2.5 text-gray-700"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="sr-only">Close menu</span>
                <X className="h-6 w-6" />
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
