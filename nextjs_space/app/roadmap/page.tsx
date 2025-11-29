'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { useToast } from '@/hooks/use-toast'
import {
  Sparkles,
  Activity,
  Bell,
  BarChart,
  Zap,
  Calendar,
  Users,
  Cloud,
  Smartphone,
  TrendingUp,
  Shield,
  Database,
  Cpu,
  FileText,
  MessageSquare,
  CheckCircle,
  Clock,
  Target
} from 'lucide-react'

type Phase = 'current' | 'q1-2025' | 'q2-2025' | 'q3-2025' | 'future'

const roadmapPhases = [
  {
    id: 'current',
    title: 'Current - Demo & Foundation',
    timeframe: 'Available Now',
    status: 'live',
    features: [
      {
        name: 'Demo Dashboard',
        description: 'Interactive preview of monitoring capabilities with sample data',
        icon: Activity,
        status: 'live'
      },
      {
        name: 'Subscription Plans',
        description: 'Three-tier pricing (Basic, Pro, Business) with clear feature comparison',
        icon: Target,
        status: 'live'
      },
      {
        name: 'Product Integration',
        description: 'Smart Connect upsell integrated across product catalog and quote flows',
        icon: Zap,
        status: 'live'
      }
    ]
  },
  {
    id: 'q1-2025',
    title: 'Phase 1 - Core Monitoring',
    timeframe: 'Q1 2025 (Jan-Mar)',
    status: 'planned',
    features: [
      {
        name: 'Real-Time Data Integration',
        description: 'Connect generators to cloud platform via IoT modules for live telemetry',
        icon: Cloud,
        status: 'planned',
        impact: 'high'
      },
      {
        name: 'Mobile App (iOS & Android)',
        description: 'Native apps for monitoring system status, battery health, and power output on-the-go',
        icon: Smartphone,
        status: 'planned',
        impact: 'high'
      },
      {
        name: 'Push Notifications',
        description: 'Instant alerts for low battery, maintenance needs, and system anomalies',
        icon: Bell,
        status: 'planned',
        impact: 'medium'
      },
      {
        name: 'Basic Analytics Dashboard',
        description: 'Historical charts showing usage patterns, charge cycles, and efficiency trends',
        icon: BarChart,
        status: 'planned',
        impact: 'medium'
      }
    ]
  },
  {
    id: 'q2-2025',
    title: 'Phase 2 - AI & Optimization',
    timeframe: 'Q2 2025 (Apr-Jun)',
    status: 'planned',
    features: [
      {
        name: 'Predictive Maintenance AI',
        description: 'Machine learning models detect patterns indicating potential failures before they occur',
        icon: Cpu,
        status: 'planned',
        impact: 'high',
        details: 'Analyzes temperature, voltage, charge cycles, and performance degradation to predict maintenance needs 30-60 days in advance'
      },
      {
        name: 'Cost Optimization Engine',
        description: 'Smart recommendations for optimal charging times based on weather and utility rates',
        icon: TrendingUp,
        status: 'planned',
        impact: 'high',
        details: 'Integrates local utility pricing and weather forecasts to suggest best times for solar charging and grid backup usage'
      },
      {
        name: 'Anomaly Detection',
        description: 'Automated alerts when system metrics deviate from normal operating parameters',
        icon: Shield,
        status: 'planned',
        impact: 'medium',
        details: 'Identifies unusual power draw, temperature spikes, or efficiency drops that may indicate issues'
      },
      {
        name: 'Energy Usage Reports',
        description: 'Detailed monthly reports with savings calculations and performance benchmarks',
        icon: FileText,
        status: 'planned',
        impact: 'low'
      }
    ]
  },
  {
    id: 'q3-2025',
    title: 'Phase 3 - Enterprise & Advanced',
    timeframe: 'Q3 2025 (Jul-Sep)',
    status: 'planned',
    features: [
      {
        name: 'Fleet Management Dashboard',
        description: 'Centralized monitoring for businesses with multiple generator units across locations',
        icon: Users,
        status: 'planned',
        impact: 'high',
        details: 'Multi-site view, bulk alerts, comparative analytics, and consolidated reporting for commercial operations'
      },
      {
        name: 'API Access',
        description: 'RESTful API for custom integrations with existing business systems',
        icon: Database,
        status: 'planned',
        impact: 'medium',
        details: 'Enables integration with ERP, facility management, and IoT platforms for enterprise customers'
      },
      {
        name: 'Warranty & Service Tracking',
        description: 'Automated warranty registration, service history logging, and claim management',
        icon: Calendar,
        status: 'planned',
        impact: 'medium'
      },
      {
        name: 'Custom Reporting',
        description: 'Build custom reports and dashboards tailored to specific business needs',
        icon: BarChart,
        status: 'planned',
        impact: 'low'
      }
    ]
  },
  {
    id: 'future',
    title: 'Future Innovations',
    timeframe: 'Q4 2025 & Beyond',
    status: 'research',
    features: [
      {
        name: 'AI-Powered Customer Support',
        description: 'RAG-based chatbot with access to manuals, FAQs, and user-specific system data',
        icon: MessageSquare,
        status: 'research',
        impact: 'high',
        details: 'Context-aware support assistant that can answer questions like "Why is my battery health at 90%?" using both documentation and live system data'
      },
      {
        name: 'Time-to-Failure Prediction',
        description: 'Advanced ML models predict remaining useful life (RUL) of critical components',
        icon: Clock,
        status: 'research',
        impact: 'high',
        details: 'Helps customers plan replacements and RRG optimize inventory for proactive service'
      },
      {
        name: 'Financial Forecasting',
        description: 'Predict aggregate solar production and net metering impacts for financed/leased units',
        icon: TrendingUp,
        status: 'research',
        impact: 'medium',
        details: 'Helps RRG forecast collective energy credits and liabilities across financed fleet'
      },
      {
        name: 'Smart Grid Integration',
        description: 'Seamless coordination with utility smart meters and demand response programs',
        icon: Zap,
        status: 'research',
        impact: 'medium'
      }
    ]
  }
]

const statusColors = {
  live: 'bg-emerald-500',
  planned: 'bg-blue-500',
  research: 'bg-purple-500'
}

const statusLabels = {
  live: 'Available Now',
  planned: 'In Development',
  research: 'Research Phase'
}

const impactColors = {
  high: 'border-emerald-500 bg-emerald-50',
  medium: 'border-blue-500 bg-blue-50',
  low: 'border-gray-400 bg-gray-50'
}

const impactBadges = {
  high: 'bg-emerald-100 text-emerald-700',
  medium: 'bg-blue-100 text-blue-700',
  low: 'bg-gray-100 text-gray-700'
}

export default function RoadmapPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleNotifySignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'roadmap_notifications' }),
      })

      if (response.ok) {
        toast({
          title: 'Success!',
          description: "We'll notify you when new features launch!",
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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-teal-50 to-blue-50 opacity-60"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto mb-12">
            <Badge className="mb-4 bg-emerald-500 hover:bg-emerald-600 text-white">
              <Sparkles className="h-3 w-3 mr-1 inline" />
              Product Roadmap
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              The Future of Smart Energy Management
            </h1>
            <p className="text-xl text-gray-700 leading-relaxed">
              See what's coming next for EnerGenius Smart Connect. From AI-powered optimization to enterprise fleet management, we're building the most advanced solar generator monitoring platform.
            </p>
          </div>

          {/* Timeline Navigation */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {roadmapPhases.map((phase) => (
              <a
                key={phase.id}
                href={`#${phase.id}`}
                className="px-4 py-2 bg-white rounded-full shadow-sm border border-gray-200 hover:border-emerald-500 hover:shadow-md transition-all text-sm font-medium text-gray-700 hover:text-emerald-600"
              >
                {phase.title.split(' - ')[0]}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Roadmap Phases */}
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="space-y-16">
            {roadmapPhases.map((phase, phaseIdx) => (
              <div key={phase.id} id={phase.id} className="scroll-mt-20">
                {/* Phase Header */}
                <div className="flex items-center gap-6 mb-8">
                  <div className="relative">
                    <div className={`w-16 h-16 rounded-full ${statusColors[phase.status as keyof typeof statusColors]} flex items-center justify-center shadow-lg`}>
                      <span className="text-2xl font-bold text-white">{phaseIdx + 1}</span>
                    </div>
                    {phaseIdx < roadmapPhases.length - 1 && (
                      <div className="absolute top-16 left-1/2 -translate-x-1/2 w-1 h-20 bg-gradient-to-b from-gray-300 to-transparent"></div>
                    )}
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-3xl font-bold text-gray-900">{phase.title}</h2>
                      <Badge className={statusColors[phase.status as keyof typeof statusColors]}>
                        {statusLabels[phase.status as keyof typeof statusLabels]}
                      </Badge>
                    </div>
                    <p className="text-gray-600 text-lg">{phase.timeframe}</p>
                  </div>
                </div>

                {/* Features Grid */}
                <div className="grid md:grid-cols-2 gap-6 ml-22">
                  {phase.features.map((feature: any, featureIdx: number) => {
                    const Icon = feature.icon
                    return (
                      <Card
                        key={featureIdx}
                        className={`hover:shadow-lg transition-all ${
                          feature.impact ? `border-l-4 ${impactColors[feature.impact as keyof typeof impactColors]}` : ''
                        }`}
                      >
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                                <Icon className="h-6 w-6 text-white" />
                              </div>
                              <div>
                                <CardTitle className="text-lg">{feature.name}</CardTitle>
                              </div>
                            </div>
                            {feature.impact && (
                              <Badge className={impactBadges[feature.impact as keyof typeof impactBadges]}>
                                {feature.impact} impact
                              </Badge>
                            )}
                          </div>
                        </CardHeader>
                        <CardContent>
                          <CardDescription className="text-gray-600 mb-2">
                            {feature.description}
                          </CardDescription>
                          {feature.details && (
                            <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                              <p className="text-sm text-gray-700">{feature.details}</p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Built on Cutting-Edge Technology</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our Smart Connect platform leverages the latest in cloud computing, AI/ML, and IoT to deliver unparalleled monitoring and optimization
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                <Cloud className="h-6 w-6 text-emerald-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Cloud Infrastructure</h3>
              <p className="text-sm text-gray-600">Scalable, secure cloud platform with 99.9% uptime guarantee</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Cpu className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">AI/ML Models</h3>
              <p className="text-sm text-gray-600">Advanced machine learning for predictive analytics and optimization</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Database className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Time-Series Database</h3>
              <p className="text-sm text-gray-600">Optimized data storage for high-frequency sensor telemetry</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-amber-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Enterprise Security</h3>
              <p className="text-sm text-gray-600">Bank-level encryption and SOC 2 Type II compliance</p>
            </div>
          </div>
        </div>
      </section>

      {/* Notify Me Section */}
      <section className="py-16 bg-gradient-to-br from-emerald-600 to-teal-600 text-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-8">
            <Bell className="h-16 w-16 mx-auto mb-4 text-white" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Get Notified When Features Launch
            </h2>
            <p className="text-xl text-emerald-50 max-w-2xl mx-auto">
              Be the first to know when new Smart Connect features become available. We'll send you updates as we roll out each phase.
            </p>
          </div>

          <Card className="bg-white/10 backdrop-blur border-white/20">
            <CardContent className="p-8">
              <form onSubmit={handleNotifySignup} className="max-w-md mx-auto">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-grow">
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="bg-white text-gray-900 border-0 h-12"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={loading}
                    size="lg"
                    className="bg-emerald-500 hover:bg-emerald-600 text-white h-12 px-8"
                  >
                    {loading ? 'Subscribing...' : 'Notify Me'}
                  </Button>
                </div>
                <p className="text-emerald-50 text-sm text-center mt-4">
                  No spam, ever. Unsubscribe anytime.
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center max-w-4xl">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Don't wait for future features - activate Smart Connect today and start monitoring your generator. Current features include real-time status, alerts, and basic analytics.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/subscription">
              <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white">
                View Pricing Plans
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="lg" variant="outline" className="border-emerald-600 text-emerald-600 hover:bg-emerald-50">
                Try Demo Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
