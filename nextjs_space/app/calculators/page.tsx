'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Calculator, Home, Zap, DollarSign, TrendingUp, Battery, AlertCircle, Mail, Phone } from 'lucide-react';
import Link from 'next/link';

interface Product {
  id: string;
  name: string;
  sku: string;
  priceNumeric: number;
  wattage: number;
  batteryCapacity?: number;
}

export default function CalculatorsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  
  // Sizing Calculator States
  const [houseSize, setHouseSize] = useState<string>('');
  const [acres, setAcres] = useState<string>('');
  const [usageType, setUsageType] = useState<string>('essential');
  const [recommendedWattage, setRecommendedWattage] = useState<number>(0);
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([]);
  
  // Power Calculator States
  const [powerKw, setPowerKw] = useState<string>('');
  const [voltage, setVoltage] = useState<string>('120');
  const [hoursPerDay, setHoursPerDay] = useState<string>('8');
  const [ratePerKwh, setRatePerKwh] = useState<string>('0.13');
  const [amperage, setAmperage] = useState<number>(0);
  const [dailyCost, setDailyCost] = useState<number>(0);
  const [monthlyCost, setMonthlyCost] = useState<number>(0);
  const [yearlyCost, setYearlyCost] = useState<number>(0);
  const [dailyKwh, setDailyKwh] = useState<number>(0);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        setProducts(data.filter((p: Product) => p.wattage && p.wattage > 0));
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchProducts();
  }, []);

  // Sizing Calculator Logic
  const calculateSizing = () => {
    let targetWattage = 0;
    
    if (houseSize) {
      const sqft = parseFloat(houseSize);
      // Base calculation: average home uses 30 kWh/day = 1250W continuous
      // Scale by square footage (typical home is 2000 sqft)
      const baseWatts = (sqft / 2000) * 1250;
      
      switch (usageType) {
        case 'essential':
          // Essential only: 30-40% of total (refrigerator, lights, phones)
          targetWattage = baseWatts * 0.35;
          break;
        case 'partial':
          // Partial: 50-70% (essentials + some appliances)
          targetWattage = baseWatts * 0.60;
          break;
        case 'whole':
          // Whole home: 100% + surge capacity
          targetWattage = baseWatts * 1.25;
          break;
        default:
          targetWattage = baseWatts * 0.35;
      }
    } else if (acres) {
      const acreage = parseFloat(acres);
      // Commercial/agricultural: 500-1000W per acre for basic operations
      // Scale up for full operations
      const baseWatts = acreage * 750;
      
      switch (usageType) {
        case 'essential':
          targetWattage = baseWatts * 0.5;
          break;
        case 'partial':
          targetWattage = baseWatts * 0.75;
          break;
        case 'whole':
          targetWattage = baseWatts * 1.5;
          break;
        default:
          targetWattage = baseWatts * 0.5;
      }
    }
    
    setRecommendedWattage(Math.round(targetWattage));
    
    // Find suitable products (within 80%-150% of target)
    const suitable = products.filter(
      p => p.wattage >= targetWattage * 0.8 && p.wattage <= targetWattage * 1.5
    ).sort((a, b) => Math.abs(a.wattage - targetWattage) - Math.abs(b.wattage - targetWattage)).slice(0, 3);
    
    // If no suitable products found, get the top 3 highest wattage products
    if (suitable.length === 0 && products.length > 0) {
      const highestProducts = [...products]
        .sort((a, b) => b.wattage - a.wattage)
        .slice(0, 3);
      setRecommendedProducts(highestProducts);
    } else {
      setRecommendedProducts(suitable);
    }
  };

  // Power Calculator Logic
  const calculatePower = () => {
    const kw = parseFloat(powerKw) || 0;
    const v = parseFloat(voltage) || 120;
    const hours = parseFloat(hoursPerDay) || 0;
    const rate = parseFloat(ratePerKwh) || 0.13;
    
    // Calculate amperage: I = P / V (where P is in watts)
    const watts = kw * 1000;
    const amps = watts / v;
    setAmperage(amps);
    
    // Calculate daily kWh usage
    const dailyKwhUsage = kw * hours;
    setDailyKwh(dailyKwhUsage);
    
    // Calculate costs
    const daily = dailyKwhUsage * rate;
    setDailyCost(daily);
    setMonthlyCost(daily * 30);
    setYearlyCost(daily * 365);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <section className="relative py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <Calculator className="h-16 w-16 text-emerald-600" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
              Solar Generator Calculators
            </h1>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Calculate your power needs and find the perfect EnerGenius solar generator for your home or business
            </p>
          </div>
        </div>
      </section>

      {/* Calculators */}
      <section className="pb-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <Tabs defaultValue="sizing" className="w-full">
            <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto mb-8">
              <TabsTrigger value="sizing" className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                Sizing Calculator
              </TabsTrigger>
              <TabsTrigger value="power" className="flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Power & Cost
              </TabsTrigger>
            </TabsList>

            {/* SIZING CALCULATOR */}
            <TabsContent value="sizing">
              <Card className="max-w-4xl mx-auto">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Home className="h-5 w-5 text-emerald-600" />
                    Generator Sizing Calculator
                  </CardTitle>
                  <CardDescription>
                    Enter your property details to calculate the ideal generator size for your needs
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Input Method Selection */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="houseSize">House Size (Square Feet)</Label>
                      <Input
                        id="houseSize"
                        type="number"
                        placeholder="e.g., 2000"
                        value={houseSize}
                        onChange={(e) => {
                          setHouseSize(e.target.value);
                          setAcres('');
                        }}
                      />
                      <p className="text-xs text-gray-500">For residential properties</p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="acres">Plot Size (Acres)</Label>
                      <Input
                        id="acres"
                        type="number"
                        placeholder="e.g., 5"
                        value={acres}
                        onChange={(e) => {
                          setAcres(e.target.value);
                          setHouseSize('');
                        }}
                      />
                      <p className="text-xs text-gray-500">For commercial/agricultural properties</p>
                    </div>
                  </div>

                  <Separator />

                  {/* Usage Type Selection */}
                  <div className="space-y-2">
                    <Label htmlFor="usageType">Power Coverage Level</Label>
                    <Select value={usageType} onValueChange={setUsageType}>
                      <SelectTrigger id="usageType">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="essential">
                          Essential Only (Lights, Refrigerator, Phones)
                        </SelectItem>
                        <SelectItem value="partial">
                          Partial Home (Essentials + Some Appliances)
                        </SelectItem>
                        <SelectItem value="whole">
                          Whole Home/Business (All Systems)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Calculate Button */}
                  <Button 
                    onClick={calculateSizing} 
                    className="w-full"
                    disabled={!houseSize && !acres}
                  >
                    Calculate Recommended Size
                  </Button>

                  {/* Results */}
                  {recommendedWattage > 0 && (
                    <div className="space-y-6 pt-6 border-t">
                      <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Recommended Wattage</p>
                            <p className="text-3xl font-bold text-emerald-600">{recommendedWattage.toLocaleString()}W</p>
                          </div>
                          <Battery className="h-12 w-12 text-emerald-600" />
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">
                          Based on your {houseSize ? `${houseSize} sqft property` : `${acres} acre property`} with {usageType} coverage
                        </p>
                      </div>

                      {/* Check if capacity exceeds 80% of largest product */}
                      {(() => {
                        const maxProduct = products.length > 0 ? Math.max(...products.map(p => p.wattage)) : 0;
                        const exceedsCapacity = recommendedWattage > maxProduct * 0.8;

                        return exceedsCapacity ? (
                          // Custom Solution Message
                          <Card className="border-2 border-amber-500 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20">
                            <CardHeader>
                              <div className="flex items-start gap-4">
                                <AlertCircle className="h-8 w-8 text-amber-600 shrink-0" />
                                <div>
                                  <CardTitle className="text-xl text-amber-900 dark:text-amber-100">
                                    Custom Solution Recommended
                                  </CardTitle>
                                  <CardDescription className="text-amber-800 dark:text-amber-200 mt-2">
                                    Your power requirements are approaching or exceeding our standard product capacity. We recommend a custom solution tailored to your specific needs.
                                  </CardDescription>
                                </div>
                              </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 space-y-3">
                                <h4 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                  <Battery className="h-5 w-5 text-emerald-600" />
                                  What You'll Get:
                                </h4>
                                <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                                  <li className="flex items-start gap-2">
                                    <span className="text-emerald-600 mt-0.5">✓</span>
                                    <span><strong>Custom System Design</strong> - Engineered specifically for your {recommendedWattage.toLocaleString()}W+ requirements</span>
                                  </li>
                                  <li className="flex items-start gap-2">
                                    <span className="text-emerald-600 mt-0.5">✓</span>
                                    <span><strong>FREE Energy Audit</strong> - Professional assessment of your power needs and usage patterns</span>
                                  </li>
                                  <li className="flex items-start gap-2">
                                    <span className="text-emerald-600 mt-0.5">✓</span>
                                    <span><strong>Detailed Quote</strong> - Transparent pricing with no hidden costs</span>
                                  </li>
                                  <li className="flex items-start gap-2">
                                    <span className="text-emerald-600 mt-0.5">✓</span>
                                    <span><strong>Installation Planning</strong> - Complete setup guidance and support</span>
                                  </li>
                                  <li className="flex items-start gap-2">
                                    <span className="text-emerald-600 mt-0.5">✓</span>
                                    <span><strong>5-Year Warranty</strong> - Same industry-leading coverage on custom builds</span>
                                  </li>
                                </ul>
                              </div>

                              <div className="bg-emerald-600 text-white rounded-lg p-4">
                                <p className="font-semibold mb-3 flex items-center gap-2">
                                  <Phone className="h-5 w-5" />
                                  Contact Our Custom Solutions Team:
                                </p>
                                <div className="space-y-2 text-sm">
                                  <p className="flex items-center gap-2">
                                    <Phone className="h-4 w-4" />
                                    <span>Call: <a href="tel:1-800-ENERGEN" className="underline hover:text-emerald-100">(800) 363-7436</a></span>
                                  </p>
                                  <p className="flex items-center gap-2">
                                    <Mail className="h-4 w-4" />
                                    <span>Email: <a href="mailto:custom@energenius.com" className="underline hover:text-emerald-100">custom@energenius.com</a></span>
                                  </p>
                                </div>
                              </div>

                              <div className="flex flex-col sm:flex-row gap-3">
                                <Link href="/quote" className="flex-1">
                                  <Button size="lg" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
                                    Request Custom Quote
                                  </Button>
                                </Link>
                                <Link href="/contact" className="flex-1">
                                  <Button size="lg" variant="outline" className="w-full border-emerald-600 text-emerald-600 hover:bg-emerald-50">
                                    Schedule Energy Audit
                                  </Button>
                                </Link>
                              </div>

                              <p className="text-xs text-center text-gray-600 dark:text-gray-400">
                                Our team typically responds within 4 business hours
                              </p>
                            </CardContent>
                          </Card>
                        ) : null;
                      })()}

                      {/* Standard Product Recommendations */}
                      {recommendedProducts.length > 0 && (() => {
                        const maxProduct = products.length > 0 ? Math.max(...products.map(p => p.wattage)) : 0;
                        const exceedsCapacity = recommendedWattage > maxProduct * 0.8;
                        
                        return (
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <h3 className="text-lg font-semibold">
                                {exceedsCapacity ? 'Our Largest Available Units' : 'Top 3 Recommended Products'}
                              </h3>
                              {exceedsCapacity && (
                                <Badge variant="secondary" className="bg-amber-100 text-amber-700">
                                  Below Your Needs
                                </Badge>
                              )}
                            </div>
                            
                            {exceedsCapacity && (
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                Your {recommendedWattage.toLocaleString()}W requirement is at or near the capacity limit of standard units. We recommend exploring custom solutions for optimal performance and reliability.
                              </p>
                            )}

                            <div className="grid md:grid-cols-3 gap-4">
                              {recommendedProducts.map((product) => (
                                <Card key={product.id} className="hover:shadow-lg transition-shadow">
                                  <CardHeader>
                                    <Badge className="w-fit mb-2">{product.wattage.toLocaleString()}W</Badge>
                                    <CardTitle className="text-base">{product.name}</CardTitle>
                                    <CardDescription className="text-2xl font-bold text-emerald-600">
                                      ${product.priceNumeric.toLocaleString()}
                                    </CardDescription>
                                  </CardHeader>
                                  <CardContent>
                                    <Link href={`/products?sku=${product.sku}`}>
                                      <Button variant="outline" className="w-full">
                                        View Details
                                      </Button>
                                    </Link>
                                  </CardContent>
                                </Card>
                              ))}
                            </div>
                            
                            {!exceedsCapacity && (
                              <div className="text-center">
                                <Link href="/quote">
                                  <Button size="lg">Request Custom Quote</Button>
                                </Link>
                              </div>
                            )}
                          </div>
                        );
                      })()}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Sizing Guide */}
              <Card className="max-w-4xl mx-auto mt-8">
                <CardHeader>
                  <CardTitle>Sizing Guide</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-6 text-sm">
                    <div>
                      <h4 className="font-semibold text-emerald-600 mb-2">Essential Coverage</h4>
                      <ul className="space-y-1 text-gray-600 dark:text-gray-400">
                        <li>• Refrigerator</li>
                        <li>• LED lighting</li>
                        <li>• Phone charging</li>
                        <li>• Internet router</li>
                        <li>• Medical devices</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-emerald-600 mb-2">Partial Coverage</h4>
                      <ul className="space-y-1 text-gray-600 dark:text-gray-400">
                        <li>• All essentials</li>
                        <li>• TV & entertainment</li>
                        <li>• Microwave</li>
                        <li>• Laptop computers</li>
                        <li>• Fans/small AC</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-emerald-600 mb-2">Whole Coverage</h4>
                      <ul className="space-y-1 text-gray-600 dark:text-gray-400">
                        <li>• All partial items</li>
                        <li>• HVAC system</li>
                        <li>• Well pump</li>
                        <li>• Electric range</li>
                        <li>• All appliances</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* POWER & COST CALCULATOR */}
            <TabsContent value="power">
              <Card className="max-w-4xl mx-auto">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-emerald-600" />
                    Power Usage & Cost Calculator
                  </CardTitle>
                  <CardDescription>
                    Convert between watts, kilowatts, and voltage to calculate your energy costs
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Input Fields */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="powerKw">Power (Kilowatts)</Label>
                      <Input
                        id="powerKw"
                        type="number"
                        step="0.1"
                        placeholder="e.g., 1.5"
                        value={powerKw}
                        onChange={(e) => setPowerKw(e.target.value)}
                      />
                      <p className="text-xs text-gray-500">1 kW = 1000 Watts</p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="voltage">Voltage (Volts)</Label>
                      <Select value={voltage} onValueChange={setVoltage}>
                        <SelectTrigger id="voltage">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="120">120V (Standard US Outlet)</SelectItem>
                          <SelectItem value="240">240V (Large Appliances)</SelectItem>
                          <SelectItem value="12">12V (DC Systems)</SelectItem>
                          <SelectItem value="24">24V (DC Systems)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="hoursPerDay">Hours Per Day</Label>
                      <Input
                        id="hoursPerDay"
                        type="number"
                        step="0.5"
                        placeholder="e.g., 8"
                        value={hoursPerDay}
                        onChange={(e) => setHoursPerDay(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="ratePerKwh">Electric Rate ($ per kWh)</Label>
                      <Input
                        id="ratePerKwh"
                        type="number"
                        step="0.01"
                        placeholder="e.g., 0.13"
                        value={ratePerKwh}
                        onChange={(e) => setRatePerKwh(e.target.value)}
                      />
                      <p className="text-xs text-gray-500">US average: $0.13/kWh</p>
                    </div>
                  </div>

                  {/* Calculate Button */}
                  <Button 
                    onClick={calculatePower} 
                    className="w-full"
                    disabled={!powerKw}
                  >
                    Calculate Usage & Costs
                  </Button>

                  {/* Results */}
                  {amperage > 0 && (
                    <div className="space-y-4 pt-6 border-t">
                      <div className="grid md:grid-cols-2 gap-4">
                        <Card className="bg-blue-50 dark:bg-blue-900/20">
                          <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                              <Zap className="h-5 w-5 text-blue-600" />
                              Amperage
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-3xl font-bold text-blue-600">{amperage.toFixed(2)} A</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                              Current draw at {voltage}V
                            </p>
                          </CardContent>
                        </Card>

                        <Card className="bg-emerald-50 dark:bg-emerald-900/20">
                          <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                              <Battery className="h-5 w-5 text-emerald-600" />
                              Daily Energy
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-3xl font-bold text-emerald-600">{dailyKwh.toFixed(2)} kWh</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                              Energy used per day
                            </p>
                          </CardContent>
                        </Card>
                      </div>

                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <DollarSign className="h-5 w-5 text-gray-600" />
                            Cost Analysis
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-3 gap-4 text-center">
                            <div>
                              <p className="text-sm text-gray-600 dark:text-gray-400">Daily</p>
                              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                ${dailyCost.toFixed(2)}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600 dark:text-gray-400">Monthly</p>
                              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                ${monthlyCost.toFixed(2)}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600 dark:text-gray-400">Yearly</p>
                              <p className="text-2xl font-bold text-emerald-600">
                                ${yearlyCost.toFixed(2)}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20">
                        <CardHeader>
                          <CardTitle className="text-lg flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-emerald-600" />
                            Savings Potential with Solar
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
                            By switching to an EnerGenius solar generator, you could save up to <span className="font-bold text-emerald-600">${(yearlyCost * 0.8).toFixed(2)}/year</span> on this load.
                          </p>
                          <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                            <li>• Eliminate grid dependency</li>
                            <li>• Reduce carbon footprint</li>
                            <li>• Qualify for 30% Federal Tax Credit</li>
                            <li>• 8,000+ cycle lifespan (20+ years)</li>
                          </ul>
                          <Link href="/products">
                            <Button className="w-full mt-4">
                              Explore Solar Generators
                            </Button>
                          </Link>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Quick Reference Guide */}
              <Card className="max-w-4xl mx-auto mt-8">
                <CardHeader>
                  <CardTitle>Common Appliance Power Usage</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                    <div>
                      <h4 className="font-semibold mb-2">Kitchen</h4>
                      <ul className="space-y-1 text-gray-600 dark:text-gray-400">
                        <li>• Refrigerator: 150-400W</li>
                        <li>• Microwave: 600-1200W</li>
                        <li>• Coffee maker: 800-1200W</li>
                        <li>• Toaster: 800-1500W</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Climate Control</h4>
                      <ul className="space-y-1 text-gray-600 dark:text-gray-400">
                        <li>• Window AC: 500-1500W</li>
                        <li>• Central AC: 3000-5000W</li>
                        <li>• Space heater: 750-1500W</li>
                        <li>• Ceiling fan: 50-100W</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Electronics</h4>
                      <ul className="space-y-1 text-gray-600 dark:text-gray-400">
                        <li>• LED TV: 50-150W</li>
                        <li>• Laptop: 50-100W</li>
                        <li>• Desktop PC: 200-500W</li>
                        <li>• Phone charger: 5-10W</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Laundry</h4>
                      <ul className="space-y-1 text-gray-600 dark:text-gray-400">
                        <li>• Washer: 500-1200W</li>
                        <li>• Dryer: 2000-5000W</li>
                        <li>• Iron: 1000-1800W</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Outdoor/Tools</h4>
                      <ul className="space-y-1 text-gray-600 dark:text-gray-400">
                        <li>• Well pump: 1000-2000W</li>
                        <li>• Power tools: 500-2000W</li>
                        <li>• Garage door: 350-600W</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Lighting</h4>
                      <ul className="space-y-1 text-gray-600 dark:text-gray-400">
                        <li>• LED bulb: 8-20W</li>
                        <li>• CFL bulb: 13-30W</li>
                        <li>• Incandescent: 40-100W</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-emerald-600 py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Find Your Perfect Generator?
          </h2>
          <p className="text-emerald-100 mb-8 max-w-2xl mx-auto">
            Browse our complete product line or request a custom quote based on your specific needs
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/products">
              <Button size="lg" variant="secondary">
                View All Products
              </Button>
            </Link>
            <Link href="/quote">
              <Button size="lg" variant="outline" className="bg-white text-emerald-600 hover:bg-emerald-50">
                Request Quote
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
