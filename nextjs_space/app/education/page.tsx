'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { BookOpen, Lightbulb, Settings, Battery, Calculator, Power, RefreshCw, Globe, Layers, Gauge, Zap, Sun, Shield, Plug, ArrowRight, CheckCircle } from 'lucide-react'
import Link from 'next/link'

const topics = [
  {
    icon: Lightbulb,
    title: 'How Solar Generators Work',
    description: 'Understanding the technology behind clean, reliable power',
  },
  {
    icon: Battery,
    title: 'Battery Technology',
    description: 'Learn about lithium batteries and cycle life',
  },
  {
    icon: Settings,
    title: 'Choosing the Right Size',
    description: 'Calculate your power needs and select the perfect system',
  },
  {
    icon: BookOpen,
    title: 'Maintenance & Care',
    description: 'Keep your system running optimally for decades',
  },
]

const powerCapabilities = [
  {
    icon: Gauge,
    title: 'Continuous Power Architecture',
    description: 'Built for sustained operation rather than short-term emergency runtime. EnerGenius systems are designed to provide ongoing power as long as energy is being generated and managed.',
  },
  {
    icon: RefreshCw,
    title: 'Black Start Capability',
    description: 'Restarts independently from zero power without reliance on the utility grid. Your system can bring itself back online after a complete discharge or outage.',
  },
  {
    icon: Globe,
    title: 'Off-Grid Ready Design',
    description: 'Operates independently when paired with renewable inputs and balance-of-system components. Perfect for remote locations or complete energy independence.',
  },
  {
    icon: Layers,
    title: 'Expandable Energy Ecosystem',
    description: 'Supports additional generation, storage, and system scaling as your energy demands increase. Start small and grow your system over time.',
  },
  {
    icon: Zap,
    title: 'Load-Driven Runtime',
    description: 'Power availability is governed by energy generation and consumption, not fixed-hour limits. Runtime depends on your actual usage patterns and energy inputs.',
  },
]

const faqs = [
  {
    question: 'Is this system limited to 48–72 hours of power?',
    answer:
      'No. EnerGenius systems are not designed around fixed runtime windows. Operating duration depends on system configuration, connected energy sources, storage capacity, and load management. With proper design, these systems support extended or continuous operation in off-grid or grid-independent environments.',
  },
  {
    question: 'How long will a solar generator last?',
    answer:
      'EnerGenius generators feature 8,000 cycle lifespan, providing up to 30 years of daily use. Our lithium batteries maintain 80% capacity even after thousands of charge cycles.',
  },
  {
    question: 'What can I power with a solar generator?',
    answer:
      'Depending on the size, you can power anything from phones and laptops (400W models) to entire homes including HVAC systems (20K-30K models). Our experts can help you calculate your specific needs.',
  },
  {
    question: 'Do solar panels work on cloudy days?',
    answer:
      'Yes! Solar panels still generate power on cloudy days, typically at 10-25% of full capacity. Your battery stores excess power from sunny days to use when needed.',
  },
  {
    question: 'What about the 30% tax credit?',
    answer:
      'All EnerGenius products qualify for the 30% Federal Solar Tax Credit through 2032. This credit applies to the entire system cost including installation, significantly reducing your investment.',
  },
  {
    question: 'How much maintenance do they require?',
    answer:
      'Minimal! Clean solar panels quarterly, check connections annually. Lithium batteries require no maintenance. Our systems are designed for set-it-and-forget-it reliability.',
  },
]

export default function EducationPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl mb-4">
            Solar Generator Learning Center
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Everything you need to know about solar power technology
          </p>
        </div>

        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8">Key Topics</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {topics.map((topic) => (
              <Card key={topic.title} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
                    <topic.icon className="h-6 w-6 text-emerald-600" />
                  </div>
                  <h3 className="font-bold mb-2">{topic.title}</h3>
                  <p className="text-sm text-gray-600">{topic.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="mb-16">
          {/* Section Header */}
          <div className="flex items-center gap-3 mb-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100">
              <Sun className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <h2 className="text-3xl font-bold">Understanding Solar Generators</h2>
              <p className="text-gray-600">How clean, renewable power works for you</p>
            </div>
          </div>

          {/* Introduction Card */}
          <Card className="mb-8 bg-gradient-to-r from-amber-50 to-emerald-50 border-amber-200">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-500 flex-shrink-0">
                  <Lightbulb className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">What is a Solar Generator?</h3>
                  <p className="text-gray-700">
                    A solar generator is a portable power system that captures, stores, and distributes electricity
                    from sunlight. Unlike traditional gas generators, solar generators produce clean, renewable energy
                    without emissions, noise, or fuel costs. They're designed for sustained operation — not just emergency backup.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Four Essential Components */}
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Settings className="h-5 w-5 text-emerald-600" />
            Four Essential Components
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Solar Panels */}
            <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-amber-500">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 flex-shrink-0">
                    <Sun className="h-6 w-6 text-amber-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2">Solar Panels</h4>
                    <p className="text-sm text-gray-600 mb-3">Capture sunlight and convert it to electricity through photovoltaic cells.</p>
                    <div className="flex flex-wrap gap-2">
                      <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full">Energy Capture</span>
                      <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full">DC Output</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Charge Controller */}
            <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-blue-500">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 flex-shrink-0">
                    <Shield className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2">Charge Controller</h4>
                    <p className="text-sm text-gray-600 mb-3">Regulates power flow to protect batteries from overcharging and damage.</p>
                    <div className="flex flex-wrap gap-2">
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">MPPT Technology</span>
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">Battery Protection</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Battery Storage */}
            <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-emerald-500">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 flex-shrink-0">
                    <Battery className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2">Battery Storage</h4>
                    <p className="text-sm text-gray-600 mb-3">Stores energy for use anytime, day or night — the heart of your power system.</p>
                    <div className="flex flex-wrap gap-2">
                      <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">LiFePO4</span>
                      <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">8,000+ Cycles</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Inverter */}
            <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-purple-500">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 flex-shrink-0">
                    <Plug className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2">Inverter</h4>
                    <p className="text-sm text-gray-600 mb-3">Converts stored DC power to AC for standard appliances and equipment.</p>
                    <div className="flex flex-wrap gap-2">
                      <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">Pure Sine Wave</span>
                      <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">120V/240V</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* How It Works Flow */}
          <Card className="bg-gradient-to-br from-slate-50 to-emerald-50/30 border-emerald-100">
            <CardContent className="p-6 md:p-8">
              <h4 className="font-bold text-xl text-gray-900 mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100">
                  <ArrowRight className="h-5 w-5 text-emerald-600" />
                </div>
                How Energy Flows Through Your System
              </h4>
              
              {/* Desktop Flow - Horizontal */}
              <div className="hidden md:flex items-start justify-between gap-2">
                {/* Step 1: Sunlight */}
                <div className="flex flex-col items-center text-center flex-1">
                  <div className="relative">
                    <div className="absolute -top-2 -left-2 flex h-6 w-6 items-center justify-center rounded-full bg-amber-600 text-white text-xs font-bold">1</div>
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-500 text-white shadow-lg">
                      <Sun className="h-8 w-8" />
                    </div>
                  </div>
                  <h5 className="font-semibold text-gray-900 mt-3">Capture</h5>
                  <p className="text-xs text-gray-600 mt-1 max-w-[100px]">Solar panels absorb sunlight</p>
                </div>

                <ArrowRight className="h-6 w-6 text-amber-400 mt-5 flex-shrink-0" />

                {/* Step 2: Regulated */}
                <div className="flex flex-col items-center text-center flex-1">
                  <div className="relative">
                    <div className="absolute -top-2 -left-2 flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white text-xs font-bold">2</div>
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-500 text-white shadow-lg">
                      <Shield className="h-8 w-8" />
                    </div>
                  </div>
                  <h5 className="font-semibold text-gray-900 mt-3">Regulate</h5>
                  <p className="text-xs text-gray-600 mt-1 max-w-[100px]">MPPT optimizes power flow</p>
                </div>

                <ArrowRight className="h-6 w-6 text-blue-400 mt-5 flex-shrink-0" />

                {/* Step 3: Stored */}
                <div className="flex flex-col items-center text-center flex-1">
                  <div className="relative">
                    <div className="absolute -top-2 -left-2 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-white text-xs font-bold">3</div>
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg">
                      <Battery className="h-8 w-8" />
                    </div>
                  </div>
                  <h5 className="font-semibold text-gray-900 mt-3">Store</h5>
                  <p className="text-xs text-gray-600 mt-1 max-w-[100px]">LiFePO4 batteries bank energy</p>
                </div>

                <ArrowRight className="h-6 w-6 text-emerald-400 mt-5 flex-shrink-0" />

                {/* Step 4: Converted */}
                <div className="flex flex-col items-center text-center flex-1">
                  <div className="relative">
                    <div className="absolute -top-2 -left-2 flex h-6 w-6 items-center justify-center rounded-full bg-purple-600 text-white text-xs font-bold">4</div>
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-purple-500 text-white shadow-lg">
                      <Plug className="h-8 w-8" />
                    </div>
                  </div>
                  <h5 className="font-semibold text-gray-900 mt-3">Convert</h5>
                  <p className="text-xs text-gray-600 mt-1 max-w-[100px]">Inverter creates AC power</p>
                </div>

                <ArrowRight className="h-6 w-6 text-purple-400 mt-5 flex-shrink-0" />

                {/* Step 5: Your Power */}
                <div className="flex flex-col items-center text-center flex-1">
                  <div className="relative">
                    <div className="absolute -top-2 -left-2 flex h-6 w-6 items-center justify-center rounded-full bg-gray-700 text-white text-xs font-bold">5</div>
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-700 text-white shadow-lg">
                      <Zap className="h-8 w-8" />
                    </div>
                  </div>
                  <h5 className="font-semibold text-gray-900 mt-3">Power</h5>
                  <p className="text-xs text-gray-600 mt-1 max-w-[100px]">Ready for your devices</p>
                </div>
              </div>

              {/* Mobile Flow - Vertical Cards */}
              <div className="md:hidden space-y-4">
                {/* Step 1: Capture */}
                <div className="flex items-center gap-4 bg-white rounded-lg p-3 shadow-sm">
                  <div className="relative flex-shrink-0">
                    <div className="absolute -top-1 -left-1 flex h-5 w-5 items-center justify-center rounded-full bg-amber-600 text-white text-xs font-bold">1</div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-500 text-white shadow-md">
                      <Sun className="h-6 w-6" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h5 className="font-semibold text-gray-900">Capture</h5>
                    <p className="text-sm text-gray-600">Solar panels absorb sunlight and convert it to DC electricity</p>
                  </div>
                </div>
                
                <div className="flex justify-center"><ArrowRight className="h-5 w-5 text-amber-400 rotate-90" /></div>

                {/* Step 2: Regulate */}
                <div className="flex items-center gap-4 bg-white rounded-lg p-3 shadow-sm">
                  <div className="relative flex-shrink-0">
                    <div className="absolute -top-1 -left-1 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-white text-xs font-bold">2</div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500 text-white shadow-md">
                      <Shield className="h-6 w-6" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h5 className="font-semibold text-gray-900">Regulate</h5>
                    <p className="text-sm text-gray-600">MPPT charge controller optimizes power flow to batteries</p>
                  </div>
                </div>
                
                <div className="flex justify-center"><ArrowRight className="h-5 w-5 text-blue-400 rotate-90" /></div>

                {/* Step 3: Store */}
                <div className="flex items-center gap-4 bg-white rounded-lg p-3 shadow-sm">
                  <div className="relative flex-shrink-0">
                    <div className="absolute -top-1 -left-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-white text-xs font-bold">3</div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500 text-white shadow-md">
                      <Battery className="h-6 w-6" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h5 className="font-semibold text-gray-900">Store</h5>
                    <p className="text-sm text-gray-600">LiFePO4 batteries safely bank energy for anytime use</p>
                  </div>
                </div>
                
                <div className="flex justify-center"><ArrowRight className="h-5 w-5 text-emerald-400 rotate-90" /></div>

                {/* Step 4: Convert */}
                <div className="flex items-center gap-4 bg-white rounded-lg p-3 shadow-sm">
                  <div className="relative flex-shrink-0">
                    <div className="absolute -top-1 -left-1 flex h-5 w-5 items-center justify-center rounded-full bg-purple-600 text-white text-xs font-bold">4</div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-500 text-white shadow-md">
                      <Plug className="h-6 w-6" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h5 className="font-semibold text-gray-900">Convert</h5>
                    <p className="text-sm text-gray-600">Pure sine wave inverter creates standard AC power</p>
                  </div>
                </div>
                
                <div className="flex justify-center"><ArrowRight className="h-5 w-5 text-purple-400 rotate-90" /></div>

                {/* Step 5: Power */}
                <div className="flex items-center gap-4 bg-white rounded-lg p-3 shadow-sm">
                  <div className="relative flex-shrink-0">
                    <div className="absolute -top-1 -left-1 flex h-5 w-5 items-center justify-center rounded-full bg-gray-700 text-white text-xs font-bold">5</div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-700 text-white shadow-md">
                      <Zap className="h-6 w-6" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h5 className="font-semibold text-gray-900">Power</h5>
                    <p className="text-sm text-gray-600">Clean, reliable electricity ready for your devices</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Power System Capabilities Section */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
              <Power className="h-6 w-6 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-3xl font-bold">Power System Capabilities</h2>
              <p className="text-gray-600">What makes EnerGenius systems different from traditional backup power</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {powerCapabilities.map((capability) => (
              <Card key={capability.title} className="hover:shadow-lg transition-shadow border-l-4 border-l-emerald-500">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 flex-shrink-0">
                      <capability.icon className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-2">{capability.title}</h3>
                      <p className="text-sm text-gray-600">{capability.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Key Insight Card */}
          <Card className="bg-emerald-50 border-emerald-200">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-600 flex-shrink-0">
                  <Lightbulb className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-emerald-900 mb-2">Think Power Plant, Not Battery</h4>
                  <p className="text-emerald-800">
                    Think of EnerGenius less like a battery and more like a self-sustaining power plant. 
                    Power continues as long as energy is being generated and managed — not until a timer runs out.
                    Unlike conventional battery backups, runtime is determined by energy input, not a fixed discharge window.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="mb-16">
          <Card className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
            <CardContent className="p-8 text-center">
              <Calculator className="h-16 w-16 mx-auto mb-4" />
              <h2 className="text-3xl font-bold mb-4">Need Help Sizing Your System?</h2>
              <p className="text-emerald-50 mb-6 max-w-2xl mx-auto">
                Use our free calculators to determine the perfect generator size for your home or business.
                Calculate power needs, usage costs, and get personalized product recommendations.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/calculators">
                  <Button size="lg" variant="secondary" className="bg-white text-emerald-600 hover:bg-emerald-50">
                    Try Our Calculators
                  </Button>
                </Link>
                <Link href="/quote">
                  <Button size="lg" variant="outline" className="border-white bg-transparent text-white hover:bg-white hover:text-emerald-600">
                    Get Expert Quote
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </section>

        <section>
          <h2 className="text-3xl font-bold mb-8">Frequently Asked Questions</h2>
          <Card>
            <CardContent className="p-8">
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                    <AccordionContent className="text-gray-700">{faq.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  )
}
