'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { Calendar, Clock, CheckCircle, Phone, Building2, Home, Zap, ShieldCheck } from 'lucide-react'

const usStates = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
]

export default function QuotePage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    projectType: '',
    powerNeeds: '',
    timeline: '',
    message: '',
  })
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setSubmitted(true)
        toast({
          title: 'Assessment Request Received!',
          description: 'A specialist will contact you within 24 hours.',
        })
      } else {
        throw new Error('Failed to submit')
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to submit. Please try again or call us directly.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  // Success State
  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50 py-16">
        <div className="mx-auto max-w-xl px-4 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-100 mb-6">
            <CheckCircle className="h-10 w-10 text-emerald-600" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-4">
            Assessment Request Received!
          </h1>
          <p className="text-lg text-slate-600 mb-8">
            Thank you, <span className="font-semibold">{formData.name}</span>. One of our energy 
            specialists will contact you within 24 hours to discuss your backup power needs.
          </p>
          <Card className="bg-white">
            <CardContent className="p-6">
              <h3 className="font-semibold text-slate-900 mb-4">What Happens Next?</h3>
              <div className="space-y-3 text-left">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-semibold text-emerald-700">1</span>
                  </div>
                  <p className="text-slate-600">We'll review your power requirements and location</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-semibold text-emerald-700">2</span>
                  </div>
                  <p className="text-slate-600">A specialist will call to discuss your specific situation</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-semibold text-emerald-700">3</span>
                  </div>
                  <p className="text-slate-600">You'll receive a personalized system recommendation and quote</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <p className="mt-8 text-slate-500">
            Need immediate assistance? Call <a href="tel:+18005551234" className="text-emerald-600 font-semibold">1-800-555-1234</a>
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 to-emerald-900 text-white py-12">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 rounded-full px-4 py-1.5 mb-4">
            <Calendar className="h-4 w-4 text-emerald-400" />
            <span className="text-sm font-medium text-emerald-300">Free • 15 Minutes • No Obligation</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">
            Get Your Energy Resilience Assessment
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            Tell us about your backup power needs and we'll recommend the right system 
            for your situation—plus an accurate quote.
          </p>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-12">
        <div className="mx-auto max-w-4xl px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Benefits Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              <Card className="bg-white">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-slate-900 mb-4">What You'll Learn</h3>
                  <div className="space-y-4">
                    {[
                      { icon: Zap, text: 'Exact system size you need' },
                      { icon: Building2, text: 'Installation requirements' },
                      { icon: ShieldCheck, text: 'Available tax credits' },
                      { icon: Clock, text: 'Estimated timeline' },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <item.icon className="h-5 w-5 text-emerald-600" />
                        <span className="text-slate-600">{item.text}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-emerald-50 border-emerald-200">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-emerald-900 mb-2">Prefer to Talk Now?</h3>
                  <p className="text-sm text-emerald-700 mb-4">
                    Call us directly for immediate assistance.
                  </p>
                  <a href="tel:+18005551234" className="flex items-center gap-2 text-emerald-700 font-semibold">
                    <Phone className="h-5 w-5" />
                    1-800-555-1234
                  </a>
                </CardContent>
              </Card>
            </div>
            
            {/* Form */}
            <div className="lg:col-span-2">
              <Card className="bg-white">
                <CardContent className="p-6 sm:p-8">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Project Type */}
                    <div>
                      <Label className="text-base font-semibold">This is for a... *</Label>
                      <div className="grid grid-cols-2 gap-3 mt-2">
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, projectType: 'Residential' })}
                          className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-colors ${
                            formData.projectType === 'Residential'
                              ? 'border-emerald-500 bg-emerald-50'
                              : 'border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <Home className={`h-6 w-6 ${formData.projectType === 'Residential' ? 'text-emerald-600' : 'text-slate-400'}`} />
                          <span className={formData.projectType === 'Residential' ? 'font-semibold text-emerald-700' : 'text-slate-600'}>
                            Home / Residential
                          </span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, projectType: 'Commercial' })}
                          className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-colors ${
                            formData.projectType === 'Commercial'
                              ? 'border-emerald-500 bg-emerald-50'
                              : 'border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <Building2 className={`h-6 w-6 ${formData.projectType === 'Commercial' ? 'text-emerald-600' : 'text-slate-400'}`} />
                          <span className={formData.projectType === 'Commercial' ? 'font-semibold text-emerald-700' : 'text-slate-600'}>
                            Business / Commercial
                          </span>
                        </button>
                      </div>
                    </div>
                    
                    {/* Power Needs */}
                    <div>
                      <Label htmlFor="powerNeeds" className="text-base font-semibold">What must stay powered during an outage? *</Label>
                      <p className="text-sm text-slate-500 mb-2">Examples: refrigeration, HVAC, medical equipment, computers, lights</p>
                      <Textarea
                        id="powerNeeds"
                        value={formData.powerNeeds}
                        onChange={(e) => setFormData({ ...formData, powerNeeds: e.target.value })}
                        placeholder="Tell us what's critical to keep running..."
                        required
                        className="min-h-[100px]"
                      />
                    </div>
                    
                    {/* Timeline */}
                    <div>
                      <Label htmlFor="timeline" className="text-base font-semibold">Outage duration concern *</Label>
                      <Select
                        value={formData.timeline}
                        onValueChange={(value) => setFormData({ ...formData, timeline: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="How long do outages typically last?" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="few-hours">A few hours</SelectItem>
                          <SelectItem value="full-day">Up to a full day</SelectItem>
                          <SelectItem value="multiple-days">Multiple days</SelectItem>
                          <SelectItem value="off-grid">We need continuous off-grid power</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {/* Location */}
                    <div>
                      <Label htmlFor="location" className="text-base font-semibold">Location (State) *</Label>
                      <Select
                        value={formData.location}
                        onValueChange={(value) => setFormData({ ...formData, location: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select your state" />
                        </SelectTrigger>
                        <SelectContent className="max-h-[300px]">
                          {usStates.map((state) => (
                            <SelectItem key={state} value={state}>{state}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {/* Contact Info */}
                    <div className="pt-4 border-t">
                      <h3 className="text-base font-semibold text-slate-900 mb-4">Your Contact Information</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="name">Name *</Label>
                          <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Your full name"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">Email *</Label>
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder="you@example.com"
                            required
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <Label htmlFor="phone">Phone *</Label>
                          <Input
                            id="phone"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            placeholder="(555) 123-4567"
                            required
                          />
                        </div>
                      </div>
                    </div>
                    
                    {/* Additional Notes */}
                    <div>
                      <Label htmlFor="message">Anything else we should know? (Optional)</Label>
                      <Textarea
                        id="message"
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Budget constraints, specific concerns, questions..."
                      />
                    </div>
                    
                    {/* Submit */}
                    <Button
                      type="submit"
                      disabled={loading || !formData.projectType || !formData.powerNeeds || !formData.timeline || !formData.location}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-6 text-lg font-semibold"
                    >
                      {loading ? 'Submitting...' : 'Get My Free Assessment'}
                    </Button>
                    
                    <p className="text-center text-sm text-slate-500">
                      We'll respond within 24 hours. No spam, ever.
                    </p>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
