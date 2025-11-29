'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { useToast } from '@/hooks/use-toast'
import {
  Activity,
  Battery,
  Zap,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  Droplet,
  Sun,
  Wind,
  Calendar,
  DollarSign,
  FileText,
  Bell,
  Settings,
  Download,
  Sparkles
} from 'lucide-react'

// Sample data for demonstration
const sampleData = {
  systemStatus: {
    health: 94,
    batteryCharge: 87,
    powerOutput: 2450,
    runtime: '12h 34m',
    temperature: 72,
    lastUpdate: 'Just now'
  },
  recentAlerts: [
    {
      id: 1,
      type: 'info',
      title: 'Optimal charging time detected',
      message: 'Weather forecast shows sunny conditions. Recommend charging between 10 AM - 2 PM.',
      time: '2 hours ago',
      icon: Sun
    },
    {
      id: 2,
      type: 'success',
      title: 'System health check complete',
      message: 'All systems operating normally. Battery health at 94%.',
      time: '1 day ago',
      icon: CheckCircle
    },
    {
      id: 3,
      type: 'warning',
      title: 'Maintenance reminder',
      message: 'Scheduled maintenance recommended in 30 days.',
      time: '3 days ago',
      icon: AlertTriangle
    }
  ],
  energyUsage: {
    today: 18.4,
    week: 127.8,
    month: 542.3,
    trend: 'down',
    savingsVsGrid: 47.32
  },
  costAnalysis: {
    dailyCost: 0.00,
    monthlySavings: 89.45,
    yearlySavings: 1073.40,
    gridComparison: {
      energenius: 0,
      grid: 127.30
    }
  },
  predictiveInsights: [
    {
      title: 'Battery Optimization',
      description: 'Your battery typically reaches full charge by 1 PM. Consider shifting heavy usage to afternoon hours for maximum efficiency.',
      impact: 'high',
      savings: '+$12/month'
    },
    {
      title: 'Maintenance Forecast',
      description: 'Based on current usage patterns, next maintenance check recommended in 30 days to maintain optimal performance.',
      impact: 'medium',
      savings: 'Prevents downtime'
    },
    {
      title: 'Weather-Based Planning',
      description: 'Cloudy conditions expected next week. Consider pre-charging to 100% before Monday.',
      impact: 'low',
      savings: 'Continuous power'
    }
  ],
  documents: [
    { name: 'User Manual - EnerGenius Guardian 5000', type: 'PDF', size: '2.4 MB' },
    { name: 'Warranty Certificate', type: 'PDF', size: '185 KB' },
    { name: 'Installation Guide', type: 'PDF', size: '1.8 MB' },
    { name: 'Maintenance Schedule', type: 'PDF', size: '245 KB' }
  ]
}

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('overview')
  const { toast } = useToast()
  const { systemStatus, recentAlerts, energyUsage, costAnalysis, predictiveInsights, documents } = sampleData

  const handleDemoFeatureClick = (featureName: string) => {
    toast({
      title: 'Demo Feature',
      description: `${featureName} is not yet implemented. This is a demo dashboard showing what the interface will look like.`,
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Demo Banner */}
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm font-medium flex items-center justify-center gap-2">
            <Sparkles className="h-4 w-4" />
            <span>This is a DEMO dashboard showing what Smart Connect will look like. Real-time data integration coming soon!</span>
            <Sparkles className="h-4 w-4" />
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">EnerGenius Smart Dashboard</h1>
              <p className="text-gray-600">Monitor and optimize your solar generator performance</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="gap-2" onClick={() => handleDemoFeatureClick('Alerts')}>
                <Bell className="h-4 w-4" />
                Alerts
                <Badge variant="secondary">3</Badge>
              </Button>
              <Button variant="outline" className="gap-2" onClick={() => handleDemoFeatureClick('Settings')}>
                <Settings className="h-4 w-4" />
                Settings
              </Button>
            </div>
          </div>
        </div>

        {/* System Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <Activity className="h-4 w-4 text-emerald-500" />
                System Health
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-end gap-2">
                  <span className="text-3xl font-bold text-gray-900">{systemStatus.health}%</span>
                  <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 mb-1">
                    Excellent
                  </Badge>
                </div>
                <Progress value={systemStatus.health} className="h-2" />
                <p className="text-xs text-gray-500">Last checked: {systemStatus.lastUpdate}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <Battery className="h-4 w-4 text-blue-500" />
                Battery Charge
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-end gap-2">
                  <span className="text-3xl font-bold text-gray-900">{systemStatus.batteryCharge}%</span>
                  <TrendingUp className="h-5 w-5 text-green-500 mb-1" />
                </div>
                <Progress value={systemStatus.batteryCharge} className="h-2" />
                <p className="text-xs text-gray-500">Estimated runtime: {systemStatus.runtime}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <Zap className="h-4 w-4 text-amber-500" />
                Power Output
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-end gap-2">
                  <span className="text-3xl font-bold text-gray-900">{systemStatus.powerOutput.toLocaleString()}</span>
                  <span className="text-gray-500 text-sm mb-1">W</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-amber-500 h-2 rounded-full" style={{ width: '49%' }}></div>
                  </div>
                  <span>49%</span>
                </div>
                <p className="text-xs text-gray-500">of 5000W capacity</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <Droplet className="h-4 w-4 text-teal-500" />
                System Temp
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-end gap-2">
                  <span className="text-3xl font-bold text-gray-900">{systemStatus.temperature}°F</span>
                  <Badge variant="secondary" className="bg-green-100 text-green-700 mb-1">
                    Normal
                  </Badge>
                </div>
                <Progress value={40} className="h-2" />
                <p className="text-xs text-gray-500">Optimal range: 60-85°F</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="insights">AI Insights</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Important Alerts */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5 text-emerald-600" />
                    Important Alerts
                  </CardTitle>
                  <CardDescription>Recent notifications and recommendations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentAlerts.map((alert) => {
                      const Icon = alert.icon
                      const bgColor = alert.type === 'warning' ? 'bg-amber-50' : alert.type === 'success' ? 'bg-emerald-50' : 'bg-blue-50'
                      const iconColor = alert.type === 'warning' ? 'text-amber-500' : alert.type === 'success' ? 'text-emerald-500' : 'text-blue-500'
                      
                      return (
                        <div key={alert.id} className={`p-4 rounded-lg ${bgColor} border border-gray-200`}>
                          <div className="flex gap-3">
                            <Icon className={`h-5 w-5 ${iconColor} shrink-0 mt-0.5`} />
                            <div className="flex-grow">
                              <p className="font-medium text-gray-900 mb-1">{alert.title}</p>
                              <p className="text-sm text-gray-600 mb-2">{alert.message}</p>
                              <p className="text-xs text-gray-500">{alert.time}</p>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Energy Usage Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-emerald-600" />
                    Energy Usage Summary
                  </CardTitle>
                  <CardDescription>Your consumption at a glance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Today</p>
                        <p className="text-2xl font-bold text-gray-900">{energyUsage.today}</p>
                        <p className="text-xs text-gray-500">kWh</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">This Week</p>
                        <p className="text-2xl font-bold text-gray-900">{energyUsage.week}</p>
                        <p className="text-xs text-gray-500">kWh</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">This Month</p>
                        <p className="text-2xl font-bold text-gray-900">{energyUsage.month}</p>
                        <p className="text-xs text-gray-500">kWh</p>
                      </div>
                    </div>

                    <Separator />

                    <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium text-gray-700">Savings vs. Grid Power</p>
                        <Badge className="bg-emerald-600">Active</Badge>
                      </div>
                      <p className="text-3xl font-bold text-emerald-600">${energyUsage.savingsVsGrid}</p>
                      <p className="text-xs text-gray-600 mt-1">saved this month</p>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      {energyUsage.trend === 'down' ? (
                        <TrendingDown className="h-4 w-4 text-green-500" />
                      ) : (
                        <TrendingUp className="h-4 w-4 text-red-500" />
                      )}
                      <span>
                        Usage is {energyUsage.trend === 'down' ? 'decreasing' : 'increasing'} compared to last month
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Cost Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-emerald-600" />
                  Cost Analysis & Savings
                </CardTitle>
                <CardDescription>Your financial impact with EnerGenius</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center p-6 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-2">Daily Cost</p>
                    <p className="text-4xl font-bold text-gray-900">${costAnalysis.dailyCost.toFixed(2)}</p>
                    <p className="text-xs text-emerald-600 mt-2 font-medium">100% Solar Powered</p>
                  </div>
                  <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-2">Monthly Savings</p>
                    <p className="text-4xl font-bold text-blue-600">${costAnalysis.monthlySavings}</p>
                    <p className="text-xs text-gray-600 mt-2">vs. grid electricity</p>
                  </div>
                  <div className="text-center p-6 bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-2">Projected Yearly</p>
                    <p className="text-4xl font-bold text-amber-600">${costAnalysis.yearlySavings.toLocaleString()}</p>
                    <p className="text-xs text-gray-600 mt-2">estimated savings</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Advanced Analytics</CardTitle>
                <CardDescription>Detailed performance metrics and trends</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {/* Placeholder for charts */}
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-12 border-2 border-dashed border-gray-300 text-center">
                    <Activity className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 font-medium mb-2">Interactive Charts Coming Soon</p>
                    <p className="text-sm text-gray-500 max-w-md mx-auto">
                      This section will feature detailed charts showing power generation, consumption patterns, battery cycles, and efficiency metrics over time.
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="p-6 bg-blue-50 rounded-lg">
                      <h3 className="font-semibold text-gray-900 mb-2">Charging Efficiency</h3>
                      <p className="text-3xl font-bold text-blue-600 mb-2">94.2%</p>
                      <p className="text-sm text-gray-600">Average solar-to-battery conversion rate this month</p>
                    </div>
                    <div className="p-6 bg-emerald-50 rounded-lg">
                      <h3 className="font-semibold text-gray-900 mb-2">Battery Cycles Used</h3>
                      <p className="text-3xl font-bold text-emerald-600 mb-2">127 / 8000</p>
                      <p className="text-sm text-gray-600">Remaining lifespan: 98.4%</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* AI Insights Tab */}
          <TabsContent value="insights" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-purple-600" />
                  AI-Powered Insights
                  <Badge variant="secondary" className="bg-purple-100 text-purple-700">Pro Feature</Badge>
                </CardTitle>
                <CardDescription>
                  Predictive recommendations to optimize your system performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {predictiveInsights.map((insight, idx) => {
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

                    return (
                      <div
                        key={idx}
                        className={`p-6 rounded-lg border-l-4 ${impactColors[insight.impact as keyof typeof impactColors]}`}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="font-semibold text-gray-900">{insight.title}</h3>
                          <div className="flex gap-2">
                            <Badge className={impactBadges[insight.impact as keyof typeof impactBadges]}>
                              {insight.impact} impact
                            </Badge>
                            <Badge variant="outline" className="border-emerald-500 text-emerald-700">
                              {insight.savings}
                            </Badge>
                          </div>
                        </div>
                        <p className="text-gray-600 text-sm">{insight.description}</p>
                      </div>
                    )
                  })}
                </div>

                <div className="mt-8 p-6 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg border border-purple-200">
                  <div className="flex items-start gap-4">
                    <Sparkles className="h-6 w-6 text-purple-600 shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Want More AI Insights?</h3>
                      <p className="text-sm text-gray-600 mb-4">
                        Upgrade to Pro or Business plan to unlock advanced predictive analytics, automated optimization, and personalized recommendations.
                      </p>
                      <Link href="/subscription">
                        <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                          Explore Plans
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Documents Tab */}
          <TabsContent value="documents" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-emerald-600" />
                  Documents & Resources
                </CardTitle>
                <CardDescription>
                  Access your product manuals, warranties, and maintenance guides
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {documents.map((doc, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-emerald-500 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-red-100 rounded flex items-center justify-center">
                          <FileText className="h-5 w-5 text-red-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{doc.name}</p>
                          <p className="text-xs text-gray-500">{doc.type} • {doc.size}</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="gap-2">
                        <Download className="h-4 w-4" />
                        Download
                      </Button>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-6 bg-blue-50 rounded-lg border border-blue-200">
                  <h3 className="font-semibold text-gray-900 mb-2">Need Help?</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Access our comprehensive knowledge base with installation guides, troubleshooting tips, and FAQs.
                  </p>
                  <Link href="/education">
                    <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-100">
                      Visit Knowledge Base
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-emerald-600" />
                  Dashboard Settings
                </CardTitle>
                <CardDescription>Configure your monitoring preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="bg-gray-50 rounded-lg p-8 text-center border-2 border-dashed border-gray-300">
                    <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 font-medium mb-2">Settings Panel Coming Soon</p>
                    <p className="text-sm text-gray-500 max-w-md mx-auto">
                      Customize alert preferences, notification settings, data refresh intervals, and more.
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-2">Current Plan</h4>
                      <Badge className="bg-emerald-600">Demo Mode</Badge>
                      <p className="text-sm text-gray-600 mt-2">Activate Smart Connect to unlock full features</p>
                    </div>
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-2">System Model</h4>
                      <p className="text-sm text-gray-700 font-medium">EnerGenius Guardian 5000</p>
                      <p className="text-sm text-gray-600 mt-1">Serial: EG-GRD-5000-2024-001</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Bottom CTA */}
        <Card className="mt-8 bg-gradient-to-br from-emerald-600 to-teal-600 text-white border-none">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-2">Love What You See?</h2>
            <p className="text-emerald-50 mb-6 max-w-2xl mx-auto">
              This demo shows just a glimpse of Smart Connect capabilities. Activate your subscription to get real-time data, AI insights, and 24/7 monitoring.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/subscription">
                <Button size="lg" className="bg-white text-emerald-600 hover:bg-gray-100">
                  View Pricing Plans
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="border-white text-white bg-transparent hover:bg-white hover:text-emerald-600">
                  Contact Sales
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
