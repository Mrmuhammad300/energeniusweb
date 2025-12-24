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
import { Calculator, Home, Zap, DollarSign, TrendingUp, Battery, AlertCircle, Mail, Phone, Plus, Minus } from 'lucide-react';
import Link from 'next/link';

interface Product {
  id: string;
  name: string;
  sku: string;
  priceNumeric: number;
  wattage: string;
  wattageNumeric: number;
  batteryCapacity?: number;
}

interface Device {
  name: string;
  watts: number;
  quantity: number;
}

// Calculator Configuration (matches specification)
const CALCULATOR_CONFIG = {
  precision: {
    rounding: 'ceil' as const,
    decimal_places: 2,
    safety_buffer_percentage: 20,
  },
  baseline_assumptions: {
    watts_per_sq_ft: 3.5,
    watts_per_acre: 152460, // 43,560 sqft × 3.5 W/sqft
    startup_surge_multiplier: 1.25,
  },
  device_library: {
    refrigerator: 800,
    freezer: 700,
    hvac_1_ton: 3500,
    well_pump: 1000,
    lighting_standard_room: 300,
    server_rack_small: 2000,
    security_system: 250,
    medical_equipment_basic: 1500,
  },
  thresholds: {
    minimum_watts: 750,
    maximum_standard_watts: 50000,
    complex_project_trigger: 50000,
  },
};

export default function CalculatorsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  
  // Sizing Calculator States - Updated for new specification
  const [calculationMethod, setCalculationMethod] = useState<'sqft' | 'acreage' | 'devices'>('sqft');
  const [squareFootage, setSquareFootage] = useState<string>('');
  const [acreage, setAcreage] = useState<string>('');
  const [devices, setDevices] = useState<Device[]>([]);
  const [customDeviceName, setCustomDeviceName] = useState<string>('');
  const [customDeviceWatts, setCustomDeviceWatts] = useState<string>('');
  const [recommendedWattage, setRecommendedWattage] = useState<number>(0);
  const [calculatedLoad, setCalculatedLoad] = useState<number>(0);
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([]);
  const [showCalculationBreakdown, setShowCalculationBreakdown] = useState<boolean>(false);
  
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
        setProducts(data.filter((p: Product) => p.wattageNumeric && p.wattageNumeric > 0));
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchProducts();
  }, []);

  // Device Management Functions
  const addDevice = (deviceType: keyof typeof CALCULATOR_CONFIG.device_library) => {
    const watts = CALCULATOR_CONFIG.device_library[deviceType];
    const existingDevice = devices.find(d => d.name === deviceType);
    
    if (existingDevice) {
      setDevices(devices.map(d => 
        d.name === deviceType ? { ...d, quantity: d.quantity + 1 } : d
      ));
    } else {
      setDevices([...devices, { name: deviceType, watts, quantity: 1 }]);
    }
  };

  const addCustomDevice = () => {
    if (!customDeviceName || !customDeviceWatts) return;
    
    const watts = parseFloat(customDeviceWatts);
    if (isNaN(watts) || watts <= 0) return;
    
    setDevices([...devices, { 
      name: customDeviceName, 
      watts, 
      quantity: 1 
    }]);
    
    setCustomDeviceName('');
    setCustomDeviceWatts('');
  };

  const updateDeviceQuantity = (index: number, change: number) => {
    const newDevices = [...devices];
    newDevices[index].quantity = Math.max(0, newDevices[index].quantity + change);
    
    if (newDevices[index].quantity === 0) {
      newDevices.splice(index, 1);
    }
    
    setDevices(newDevices);
  };

  const removeDevice = (index: number) => {
    const newDevices = devices.filter((_, i) => i !== index);
    setDevices(newDevices);
  };

  // Sizing Calculator Logic - Matches Specification
  const calculateSizing = () => {
    let baseLoad = 0;
    
    // Step 1: Calculate base load based on method
    switch (calculationMethod) {
      case 'sqft':
        if (squareFootage) {
          const sqft = parseFloat(squareFootage);
          if (sqft >= 100 && sqft <= 500000) {
            baseLoad = sqft * CALCULATOR_CONFIG.baseline_assumptions.watts_per_sq_ft;
          }
        }
        break;
        
      case 'acreage':
        if (acreage) {
          const acres = parseFloat(acreage);
          if (acres >= 0.01 && acres <= 1000) {
            // Convert acreage to square footage, then calculate
            const sqft = acres * 43560;
            baseLoad = sqft * CALCULATOR_CONFIG.baseline_assumptions.watts_per_sq_ft;
          }
        }
        break;
        
      case 'devices':
        // Sum up all device wattages × quantities
        baseLoad = devices.reduce((sum, device) => 
          sum + (device.watts * device.quantity), 0
        );
        break;
    }
    
    // Step 2: Apply startup surge multiplier
    const withSurge = baseLoad * CALCULATOR_CONFIG.baseline_assumptions.startup_surge_multiplier;
    
    // Step 3: Apply safety buffer
    const withBuffer = withSurge * (1 + (CALCULATOR_CONFIG.precision.safety_buffer_percentage / 100));
    
    // Step 4: Round up to nearest whole watt
    const finalWattage = Math.ceil(withBuffer);
    
    setCalculatedLoad(Math.ceil(baseLoad)); // Store base load for display
    setRecommendedWattage(finalWattage);
    
    // Step 5: Find matching generator (smallest that exceeds load)
    const validProducts = products.filter(p => 
      p.wattageNumeric >= CALCULATOR_CONFIG.thresholds.minimum_watts
    );
    
    // Find products that can handle the load
    const suitable = validProducts
      .filter(p => p.wattageNumeric >= finalWattage)
      .sort((a, b) => a.wattageNumeric - b.wattageNumeric) // Smallest first
      .slice(0, 3);
    
    // If no products can handle it, show the largest products
    if (suitable.length === 0 && validProducts.length > 0) {
      const largest = [...validProducts]
        .sort((a, b) => b.wattageNumeric - a.wattageNumeric)
        .slice(0, 3);
      setRecommendedProducts(largest);
    } else {
      setRecommendedProducts(suitable);
    }
    
    setShowCalculationBreakdown(true);
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
                  {/* Calculation Method Selection */}
                  <div className="space-y-3">
                    <Label>Choose Calculation Method</Label>
                    <div className="grid grid-cols-3 gap-3">
                      <Button
                        type="button"
                        variant={calculationMethod === 'sqft' ? 'default' : 'outline'}
                        onClick={() => setCalculationMethod('sqft')}
                        className="flex flex-col h-auto py-3"
                      >
                        <Home className="h-5 w-5 mb-1" />
                        <span className="text-xs">Square Feet</span>
                      </Button>
                      <Button
                        type="button"
                        variant={calculationMethod === 'acreage' ? 'default' : 'outline'}
                        onClick={() => setCalculationMethod('acreage')}
                        className="flex flex-col h-auto py-3"
                      >
                        <TrendingUp className="h-5 w-5 mb-1" />
                        <span className="text-xs">Acreage</span>
                      </Button>
                      <Button
                        type="button"
                        variant={calculationMethod === 'devices' ? 'default' : 'outline'}
                        onClick={() => setCalculationMethod('devices')}
                        className="flex flex-col h-auto py-3"
                      >
                        <Zap className="h-5 w-5 mb-1" />
                        <span className="text-xs">Devices</span>
                      </Button>
                    </div>
                  </div>

                  <Separator />

                  {/* Square Footage Input */}
                  {calculationMethod === 'sqft' && (
                    <div className="space-y-2">
                      <Label htmlFor="squareFootage">Property Size (Square Feet)</Label>
                      <Input
                        id="squareFootage"
                        type="number"
                        placeholder="e.g., 2000"
                        value={squareFootage}
                        onChange={(e) => setSquareFootage(e.target.value)}
                        min={100}
                        max={500000}
                      />
                      <p className="text-xs text-gray-500">
                        Using {CALCULATOR_CONFIG.baseline_assumptions.watts_per_sq_ft} W/sqft baseline
                      </p>
                    </div>
                  )}

                  {/* Acreage Input */}
                  {calculationMethod === 'acreage' && (
                    <div className="space-y-2">
                      <Label htmlFor="acreage">Property Size (Acres)</Label>
                      <Input
                        id="acreage"
                        type="number"
                        placeholder="e.g., 5"
                        value={acreage}
                        onChange={(e) => setAcreage(e.target.value)}
                        min={0.01}
                        max={1000}
                        step={0.01}
                      />
                      <p className="text-xs text-gray-500">
                        1 acre = 43,560 sqft × {CALCULATOR_CONFIG.baseline_assumptions.watts_per_sq_ft} W/sqft = {CALCULATOR_CONFIG.baseline_assumptions.watts_per_acre.toLocaleString()}W
                      </p>
                    </div>
                  )}

                  {/* Devices Input */}
                  {calculationMethod === 'devices' && (
                    <div className="space-y-4">
                      <div>
                        <Label className="mb-3 block">Add Devices from Library</Label>
                        <div className="grid grid-cols-2 gap-2">
                          {Object.entries(CALCULATOR_CONFIG.device_library).map(([key, watts]) => (
                            <Button
                              key={key}
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => addDevice(key as keyof typeof CALCULATOR_CONFIG.device_library)}
                              className="justify-start text-xs h-auto py-2"
                            >
                              <Plus className="h-3 w-3 mr-1" />
                              {key.replace(/_/g, ' ')} ({watts}W)
                            </Button>
                          ))}
                        </div>
                      </div>

                      {/* Custom Device */}
                      <div className="space-y-2">
                        <Label>Add Custom Device</Label>
                        <div className="flex gap-2">
                          <Input
                            placeholder="Device name"
                            value={customDeviceName}
                            onChange={(e) => setCustomDeviceName(e.target.value)}
                            className="flex-1"
                          />
                          <Input
                            type="number"
                            placeholder="Watts"
                            value={customDeviceWatts}
                            onChange={(e) => setCustomDeviceWatts(e.target.value)}
                            className="w-24"
                          />
                          <Button
                            type="button"
                            onClick={addCustomDevice}
                            size="sm"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Selected Devices */}
                      {devices.length > 0 && (
                        <div className="space-y-2">
                          <Label>Selected Devices ({devices.length})</Label>
                          <div className="border rounded-lg divide-y max-h-64 overflow-y-auto">
                            {devices.map((device, index) => (
                              <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-800">
                                <div className="flex-1">
                                  <p className="text-sm font-medium capitalize">{device.name.replace(/_/g, ' ')}</p>
                                  <p className="text-xs text-gray-500">{device.watts}W × {device.quantity} = {device.watts * device.quantity}W</p>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => updateDeviceQuantity(index, -1)}
                                    className="h-7 w-7 p-0"
                                  >
                                    <Minus className="h-3 w-3" />
                                  </Button>
                                  <span className="text-sm w-6 text-center">{device.quantity}</span>
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => updateDeviceQuantity(index, 1)}
                                    className="h-7 w-7 p-0"
                                  >
                                    <Plus className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                          <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-3">
                            <p className="text-sm font-medium text-emerald-900 dark:text-emerald-100">
                              Total Device Load: {devices.reduce((sum, d) => sum + (d.watts * d.quantity), 0).toLocaleString()}W
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Calculate Button */}
                  <Button 
                    onClick={calculateSizing} 
                    className="w-full"
                    disabled={
                      (calculationMethod === 'sqft' && !squareFootage) ||
                      (calculationMethod === 'acreage' && !acreage) ||
                      (calculationMethod === 'devices' && devices.length === 0)
                    }
                  >
                    <Calculator className="h-4 w-4 mr-2" />
                    Calculate Recommended Size
                  </Button>

                  {/* Results */}
                  {recommendedWattage > 0 && (
                    <div className="space-y-6 pt-6 border-t">
                      {/* Calculation Breakdown */}
                      {showCalculationBreakdown && (
                        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-2 border-blue-200 dark:border-blue-800">
                          <CardHeader className="pb-3">
                            <CardTitle className="text-lg flex items-center gap-2">
                              <Calculator className="h-5 w-5 text-blue-600" />
                              Calculation Breakdown
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <div className="grid grid-cols-2 gap-3 text-sm">
                              <div className="bg-white/60 dark:bg-gray-800/60 rounded p-3">
                                <p className="text-xs text-gray-600 dark:text-gray-400">Base Load</p>
                                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                  {calculatedLoad.toLocaleString()}W
                                </p>
                              </div>
                              <div className="bg-white/60 dark:bg-gray-800/60 rounded p-3">
                                <p className="text-xs text-gray-600 dark:text-gray-400">+ Surge (×{CALCULATOR_CONFIG.baseline_assumptions.startup_surge_multiplier})</p>
                                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                  {Math.ceil(calculatedLoad * CALCULATOR_CONFIG.baseline_assumptions.startup_surge_multiplier).toLocaleString()}W
                                </p>
                              </div>
                              <div className="bg-white/60 dark:bg-gray-800/60 rounded p-3">
                                <p className="text-xs text-gray-600 dark:text-gray-400">+ Safety Buffer ({CALCULATOR_CONFIG.precision.safety_buffer_percentage}%)</p>
                                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                  {Math.ceil(calculatedLoad * CALCULATOR_CONFIG.baseline_assumptions.startup_surge_multiplier * 1.2).toLocaleString()}W
                                </p>
                              </div>
                              <div className="bg-emerald-100 dark:bg-emerald-900/40 rounded p-3 border-2 border-emerald-400 dark:border-emerald-700">
                                <p className="text-xs text-emerald-700 dark:text-emerald-300 font-medium">Final Requirement</p>
                                <p className="text-xl font-bold text-emerald-700 dark:text-emerald-300">
                                  {recommendedWattage.toLocaleString()}W
                                </p>
                              </div>
                            </div>
                            <div className="text-xs text-gray-600 dark:text-gray-400 bg-white/40 dark:bg-gray-800/40 rounded p-2">
                              <p className="font-medium mb-1">Formula Applied:</p>
                              <p className="font-mono">
                                Base Load × {CALCULATOR_CONFIG.baseline_assumptions.startup_surge_multiplier} (surge) × 1.{CALCULATOR_CONFIG.precision.safety_buffer_percentage} (buffer) = Required Watts
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      )}

                      {/* Main Result Display */}
                      <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Generator Capacity Required</p>
                            <p className="text-3xl font-bold text-emerald-600">{recommendedWattage.toLocaleString()}W</p>
                          </div>
                          <Battery className="h-12 w-12 text-emerald-600" />
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">
                          {calculationMethod === 'sqft' && `Based on ${squareFootage} sqft property`}
                          {calculationMethod === 'acreage' && `Based on ${acreage} acre property`}
                          {calculationMethod === 'devices' && `Based on ${devices.length} selected device${devices.length !== 1 ? 's' : ''}`}
                        </p>
                      </div>

                      {/* Check if capacity exceeds complex project threshold */}
                      {(() => {
                        const exceedsCapacity = recommendedWattage > CALCULATOR_CONFIG.thresholds.complex_project_trigger;

                        return exceedsCapacity ? (
                          // Custom Solution Message
                          <Card className="border-2 border-amber-500 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20">
                            <CardHeader>
                              <div className="flex items-start gap-4">
                                <AlertCircle className="h-8 w-8 text-amber-600 shrink-0" />
                                <div>
                                  <CardTitle className="text-xl text-amber-900 dark:text-amber-100">
                                    Custom-Engineered Solution Required
                                  </CardTitle>
                                  <CardDescription className="text-amber-800 dark:text-amber-200 mt-2">
                                    Your power needs exceed standard generator offerings ({CALCULATOR_CONFIG.thresholds.complex_project_trigger.toLocaleString()}W+). A custom-engineered solution is required to meet your {recommendedWattage.toLocaleString()}W requirements.
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
                                  <Button size="lg" className="w-full bg-amber-600 hover:bg-amber-700 text-white">
                                    Request Engineering Assessment
                                  </Button>
                                </Link>
                                <Link href="/contact" className="flex-1">
                                  <Button size="lg" variant="outline" className="w-full border-amber-600 text-amber-600 hover:bg-amber-50">
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
                        const exceedsCapacity = recommendedWattage > CALCULATOR_CONFIG.thresholds.complex_project_trigger;
                        
                        return (
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <h3 className="text-lg font-semibold">
                                {exceedsCapacity ? 'Our Largest Available Units' : 'Recommended Products'}
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
                                    <Badge className="w-fit mb-2">{product.wattageNumeric.toLocaleString()}W</Badge>
                                    <CardTitle className="text-base">{product.name}</CardTitle>
                                    <CardDescription className="text-2xl font-bold text-emerald-600">
                                      ${product.priceNumeric.toLocaleString()}
                                    </CardDescription>
                                  </CardHeader>
                                  <CardContent>
                                    <Link href={`/products#${product.sku}`}>
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
