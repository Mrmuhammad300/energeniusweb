'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { BookOpen, Lightbulb, Settings, Battery, Calculator } from 'lucide-react'
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

const faqs = [
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
          <Card>
            <CardContent className="p-8">
              <h2 className="text-3xl font-bold mb-6">Understanding Solar Generators</h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  A solar generator is a portable power system that captures, stores, and distributes electricity
                  from sunlight. Unlike traditional gas generators, solar generators produce clean, renewable energy
                  without emissions, noise, or fuel costs.
                </p>
                <h3 className="text-xl font-semibold mt-6 mb-3">Four Essential Components:</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong>Solar Panels:</strong> Capture sunlight and convert it to electricity
                  </li>
                  <li>
                    <strong>Charge Controller:</strong> Regulates power flow to protect batteries
                  </li>
                  <li>
                    <strong>Battery Storage:</strong> Stores energy for use anytime, day or night
                  </li>
                  <li>
                    <strong>Inverter:</strong> Converts stored DC power to AC for standard appliances
                  </li>
                </ul>
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
