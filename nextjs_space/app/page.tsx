'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Battery, Shield, Award, HeadphonesIcon, Zap, Users, ArrowRight, CheckCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

const features = [
  {
    icon: Battery,
    title: '8,000 Cycle Lifespan',
    description: '30 years of daily use - 3x longer than competitors',
  },
  {
    icon: Shield,
    title: '5-Year Warranty',
    description: 'Industry-leading coverage, double the standard',
  },
  {
    icon: Award,
    title: 'All-Inclusive Pricing',
    description: 'Solar panels included, no hidden costs',
  },
  {
    icon: HeadphonesIcon,
    title: 'U.S.-Based Support',
    description: '24-hour response guarantee, real experts',
  },
]

const products = [
  {
    name: 'Scout Series',
    range: '400W - 2000W',
    image: 'https://cdn11.bigcommerce.com/s-4qrfjy9oz3/images/stencil/1280x1280/products/178/4202/RevoPower_Scout__70203.1723676273.png?c=1',
    description: 'Perfect for camping, tailgating, and emergency backup',
    tier: 'Portable',
  },
  {
    name: 'Guardian Series',
    range: '3000W - 8000W',
    image: 'https://naturesgenerator.com/cdn/shop/files/natures-generator-powerhouse-gold-system-262674_1200x1200_crop_center.jpg',
    description: 'Whole-home backup power for peace of mind',
    tier: 'Home',
  },
  {
    name: 'Titan Series',
    range: '10KW - 15KW',
    image: 'https://www.solarelectricsupply.com/media/product-images/remote-industrial-solar/RD-Series/skid-mounted-emergency-portable-solar-system-x.jpg',
    description: 'Professional-grade power for businesses',
    tier: 'Professional',
  },
  {
    name: 'Apex Series',
    range: '20KW - 30KW',
    image: 'https://temaroofingservices.com/wp-content/uploads/2023/02/Solar-panel-on-a-commercial-rooftop.jpg',
    description: 'Maximum capacity for commercial applications',
    tier: 'Commercial',
  },
]

const testimonials = [
  {
    quote: 'After the ice storm knocked out our power for 5 days, our EnerGenius Guardian kept our family comfortable and safe. Worth every penny.',
    author: 'Sarah M.',
    location: 'Columbus, OH',
  },
  {
    quote: 'We power our entire food truck with the Titan 15K. No more noisy generators scaring away customers. Game changer for our business.',
    author: 'Carlos R.',
    location: 'Austin, TX',
  },
  {
    quote: 'Living off-grid in New Mexico, reliability is everything. Our Apex 20K has run flawlessly for 2 years. Their support team is amazing.',
    author: 'Michael T.',
    location: 'Santa Fe, NM',
  },
]

export default function HomePage() {
  const [heroRef, heroInView] = useInView({ triggerOnce: true, threshold: 0.1 })
  const [featuresRef, featuresInView] = useInView({ triggerOnce: true, threshold: 0.1 })
  const [productsRef, productsInView] = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative h-[90vh] min-h-[600px] flex items-center justify-center overflow-hidden"
      >
        <div className="absolute inset-0 z-0">
          <Image
            src="https://www.lgcypower.com/wp-content/uploads/2021/11/how-much-solar.webp"
            alt="Solar powered home"
            fill
            className="object-cover brightness-50"
            priority
          />
        </div>
        
        <div className="relative z-10 mx-auto max-w-7xl px-6 text-center lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8 }}
          >
            {/* Company Name */}
            <p className="text-xl sm:text-2xl font-semibold text-emerald-400 mb-4 tracking-wide">
              Renewable Resource Group
            </p>
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl">
              Power That Thinks Ahead
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-200 sm:text-xl max-w-2xl mx-auto">
              Professional-grade solar generators from 400W to 30,000W. Honest pricing, superior support, and industry-leading warranty.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link href="/products">
                <Button size="lg" className="bg-gradient-to-r from-emerald-600 to-sky-600 text-white hover:from-emerald-700 hover:to-sky-700 text-lg px-8 py-6">
                  Explore Products
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/quote">
                <Button size="lg" className="bg-white text-emerald-600 hover:bg-gray-100 text-lg px-8 py-6">
                  Request Quote
                </Button>
              </Link>
            </div>
            <div className="mt-8 flex justify-center gap-8 text-white text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-emerald-400" />
                <span>5-Year Warranty</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-emerald-400" />
                <span>30% Tax Credit</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-emerald-400" />
                <span>Free Shipping</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Why Choose EnerGenius?
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              We eliminate the frustrations you experience with other solar generator brands
            </p>
          </div>

          <div
            ref={featuresRef}
            className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={featuresInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full border-2 hover:border-emerald-500 hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-emerald-100 to-sky-100">
                      <feature.icon className="h-8 w-8 text-emerald-600" />
                    </div>
                    <h3 className="mb-2 text-xl font-bold text-gray-900">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Showcase */}
      <section ref={productsRef} className="py-24 bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              From Camping to Commercial
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              The widest range in the industry - find your perfect power solution
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product, index) => (
              <motion.div
                key={product.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={productsInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link href={`/products?tier=${product.tier}`}>
                  <Card className="h-full overflow-hidden hover:shadow-2xl transition-all duration-300 group cursor-pointer">
                    <div className="relative aspect-square">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-1">{product.name}</h3>
                      <p className="text-emerald-600 font-semibold mb-2">{product.range}</p>
                      <p className="text-gray-600 text-sm">{product.description}</p>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link href="/products">
              <Button size="lg" className="bg-gradient-to-r from-emerald-600 to-sky-600 text-white hover:from-emerald-700 hover:to-sky-700">
                View All Products
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Divisions CTA */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Residential */}
            <div className="relative overflow-hidden rounded-2xl shadow-xl">
              <div className="relative h-96">
                <Image
                  src="https://us.images.westend61.de/0001906127pw/happy-family-standing-in-front-their-family-house-with-solar-panels-on-the-roof-HAPF03484.jpg"
                  alt="Residential solar"
                  fill
                  className="object-cover brightness-75"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute bottom-0 left-0 p-8 text-white">
                  <Zap className="h-12 w-12 mb-4 text-emerald-400" />
                  <h3 className="text-3xl font-bold mb-2">Residential Solutions</h3>
                  <p className="text-gray-200 mb-4">
                    Keep your family safe and comfortable during any outage
                  </p>
                  <Link href="/residential">
                    <Button className="bg-white text-emerald-600 hover:bg-gray-100">
                      Learn More
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Commercial */}
            <div className="relative overflow-hidden rounded-2xl shadow-xl">
              <div className="relative h-96">
                <Image
                  src="https://www.energy.gov/sites/default/files/2021-06/35502216484_c1b49186db_k.jpg"
                  alt="Commercial solar"
                  fill
                  className="object-cover brightness-75"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute bottom-0 left-0 p-8 text-white">
                  <Users className="h-12 w-12 mb-4 text-sky-400" />
                  <h3 className="text-3xl font-bold mb-2">Commercial Solutions</h3>
                  <p className="text-gray-200 mb-4">
                    Keep your business running, no matter what
                  </p>
                  <Link href="/commercial">
                    <Button className="bg-white text-emerald-600 hover:bg-gray-100">
                      Learn More
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Trusted by Customers Across America
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-2 hover:border-emerald-500 transition-colors">
                <CardContent className="p-6">
                  <p className="text-gray-700 italic mb-4">"{testimonial.quote}"</p>
                  <div className="border-t pt-4">
                    <p className="font-semibold text-gray-900">{testimonial.author}</p>
                    <p className="text-sm text-gray-600">{testimonial.location}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-gradient-to-r from-emerald-600 to-sky-600 text-white">
        <div className="mx-auto max-w-4xl px-6 text-center lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-6">
            Ready to Take Control of Your Power?
          </h2>
          <p className="text-xl text-emerald-50 mb-8">
            Join thousands of satisfied customers who chose EnerGenius for their energy independence
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/products">
              <Button size="lg" variant="outline" className="text-emerald-600 bg-white hover:bg-gray-100 border-0 px-8 py-6 text-lg">
                Browse Products
              </Button>
            </Link>
            <Link href="/quote">
              <Button size="lg" className="bg-white text-emerald-600 hover:bg-gray-100 px-8 py-6 text-lg">
                Get Free Quote
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
