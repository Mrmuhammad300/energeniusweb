/**
 * Utility functions to translate technical specifications into customer benefits
 * Converts watts, watt-hours, and other technical specs into real-world usage examples
 */

export interface ApplianceRuntime {
  appliance: string;
  icon: string;
  duration: string;
  watts: number;
}

export interface ProductBenefit {
  category: string;
  examples: string[];
}

/**
 * Get practical runtime examples based on wattage capacity
 * @param watts - Generator wattage capacity
 * @returns Array of appliance runtime examples
 */
export function getApplianceRuntimes(watts: number): ApplianceRuntime[] {
  const runtimes: ApplianceRuntime[] = [];

  // Common appliances and their typical wattage
  const appliances = [
    { name: 'LED Lights (10 bulbs)', watts: 100, icon: '💡' },
    { name: 'Smartphone Charging', watts: 20, icon: '📱' },
    { name: 'Laptop', watts: 60, icon: '💻' },
    { name: 'WiFi Router', watts: 10, icon: '📡' },
    { name: 'TV (40")', watts: 100, icon: '📺' },
    { name: 'Refrigerator', watts: 150, icon: '❄️' },
    { name: 'Coffee Maker', watts: 1000, icon: '☕' },
    { name: 'Microwave', watts: 1200, icon: '🔥' },
    { name: 'Space Heater', watts: 1500, icon: '🔥' },
    { name: 'Window AC Unit', watts: 1200, icon: '❄️' },
    { name: 'Power Tools', watts: 1000, icon: '🔧' },
    { name: 'Medical Equipment (CPAP)', watts: 60, icon: '⚕️' },
    { name: 'Electric Grill', watts: 1650, icon: '🍖' },
    { name: 'Washing Machine', watts: 500, icon: '🧺' },
    { name: 'Sump Pump', watts: 800, icon: '💧' },
  ];

  // Select appropriate appliances based on capacity
  for (const appliance of appliances) {
    if (appliance.watts <= watts * 0.8) { // 80% safe operating capacity
      runtimes.push({
        appliance: appliance.name,
        icon: appliance.icon,
        duration: 'continuous',
        watts: appliance.watts
      });
    }
  }

  return runtimes.slice(0, 6); // Return top 6 most relevant
}

/**
 * Get battery runtime examples based on watt-hour capacity
 * @param wattHours - Battery capacity in Wh
 * @returns Array of runtime examples
 */
export function getBatteryRuntimeExamples(wattHours: number): string[] {
  const examples: string[] = [];

  // Calculate runtimes for common appliances
  const fridgeHours = Math.floor(wattHours / 150); // Fridge uses ~150W
  const laptopHours = Math.floor(wattHours / 60); // Laptop uses ~60W
  const phoneCharges = Math.floor(wattHours / 15); // Phone battery ~15Wh
  const tvHours = Math.floor(wattHours / 100); // TV uses ~100W
  const cpapNights = Math.floor(wattHours / (60 * 8)); // CPAP 60W for 8 hours
  const lightsHours = Math.floor(wattHours / 100); // 10 LED bulbs ~100W

  if (fridgeHours >= 1) {
    examples.push(`❄️ Runs a refrigerator for ${fridgeHours} hours`);
  }
  
  if (phoneCharges >= 10) {
    examples.push(`📱 Charges smartphones ${phoneCharges}+ times`);
  }
  
  if (laptopHours >= 5) {
    examples.push(`💻 Powers laptop for ${laptopHours} hours`);
  }
  
  if (tvHours >= 3) {
    examples.push(`📺 Runs TV for ${tvHours} hours`);
  }
  
  if (cpapNights >= 1) {
    examples.push(`⚕️ Powers CPAP for ${cpapNights} full nights`);
  }
  
  if (lightsHours >= 5) {
    examples.push(`💡 Lights home for ${lightsHours} hours`);
  }

  return examples.slice(0, 4); // Return top 4 most relevant
}

/**
 * Get power capacity benefit description
 * @param watts - Generator wattage
 * @returns Human-readable benefit description
 */
export function getPowerCapacityBenefit(watts: number): string {
  if (watts < 1000) {
    return '📱 Perfect for charging devices, small electronics, and emergency lighting';
  } else if (watts < 2000) {
    return '💻 Powers essentials: phones, laptops, WiFi, TV, and small appliances';
  } else if (watts < 3500) {
    return '🏠 Runs essential household: fridge, lights, WiFi, TV, and medical equipment';
  } else if (watts < 6000) {
    return '🏡 Powers most home essentials plus tools and larger appliances';
  } else if (watts < 10000) {
    return '🏘️ Handles whole-home backup: all essentials plus AC/heating';
  } else if (watts < 20000) {
    return '🏭 Commercial-grade: powers entire homes or small business operations';
  } else {
    return '🏢 Industrial capacity: full building backup for businesses and large homes';
  }
}

/**
 * Get use case recommendations based on wattage
 * @param watts - Generator wattage
 * @returns Array of recommended use cases
 */
export function getUseCaseRecommendations(watts: number): string[] {
  const useCases: string[] = [];

  if (watts >= 400) {
    useCases.push('Camping & Outdoor Adventures');
    useCases.push('Emergency Device Charging');
  }
  
  if (watts >= 1000) {
    useCases.push('RV & Van Life');
    useCases.push('Tailgating & Events');
  }
  
  if (watts >= 2000) {
    useCases.push('Home Emergency Backup');
    useCases.push('Remote Work Setup');
  }
  
  if (watts >= 5000) {
    useCases.push('Whole-Home Backup Power');
    useCases.push('Construction Sites');
  }
  
  if (watts >= 10000) {
    useCases.push('Small Business Operations');
    useCases.push('Farm & Ranch Equipment');
  }
  
  if (watts >= 20000) {
    useCases.push('Commercial Building Backup');
    useCases.push('Industrial Operations');
  }

  return useCases;
}

/**
 * Get benefit highlights for a product based on all specs
 * @param product - Product with specifications
 * @returns Structured benefits object
 */
export function getProductBenefits(product: {
  wattage?: string;
  batteryCapacity?: string;
  price?: number;
}): ProductBenefit[] {
  const benefits: ProductBenefit[] = [];

  // Parse wattage
  const wattsMatch = product.wattage?.match(/(\d+)/);
  const watts = wattsMatch ? parseInt(wattsMatch[1]) : 0;

  if (watts > 0) {
    const runtimes = getBatteryRuntimeExamples(watts); // Simplified for demo
    benefits.push({
      category: 'Power Capacity',
      examples: [getPowerCapacityBenefit(watts)]
    });

    const useCases = getUseCaseRecommendations(watts);
    if (useCases.length > 0) {
      benefits.push({
        category: 'Ideal For',
        examples: useCases.slice(0, 3)
      });
    }
  }

  // Parse battery capacity (Wh)
  const capacityMatch = product.batteryCapacity?.match(/(\d+)/);
  const wattHours = capacityMatch ? parseInt(capacityMatch[1]) : watts; // Fallback to watts if no specific capacity

  if (wattHours > 0) {
    const runtimeExamples = getBatteryRuntimeExamples(wattHours);
    if (runtimeExamples.length > 0) {
      benefits.push({
        category: 'Real-World Runtime',
        examples: runtimeExamples
      });
    }
  }

  // Value proposition
  if (product.price) {
    const costPerWatt = watts > 0 ? (product.price / watts).toFixed(2) : '0';
    benefits.push({
      category: 'Value',
      examples: [
        `💰 Only $${costPerWatt} per watt of capacity`,
        '🎯 30% Federal Tax Credit eligible',
        '⚡ 8,000 cycle lifespan (15+ years)'
      ]
    });
  }

  return benefits;
}

/**
 * Get a short, punchy benefit headline for a product
 * @param watts - Generator wattage
 * @returns Short benefit headline
 */
export function getBenefitHeadline(watts: number): string {
  if (watts < 1000) {
    return 'Essential Emergency Power';
  } else if (watts < 2000) {
    return 'Powers Your Digital Life';
  } else if (watts < 3500) {
    return 'Home Essentials Backup';
  } else if (watts < 6000) {
    return 'Comprehensive Home Power';
  } else if (watts < 10000) {
    return 'Whole-Home Protection';
  } else if (watts < 20000) {
    return 'Commercial-Grade Reliability';
  } else {
    return 'Industrial Power Solution';
  }
}

/**
 * Get quick benefit tags (3-4 word phrases) for product cards
 * @param watts - Generator wattage
 * @returns Array of benefit tags
 */
export function getQuickBenefitTags(watts: number): string[] {
  const tags: string[] = [];

  // Calculate some quick stats
  const wattHours = watts; // Simplified assumption
  const fridgeHours = Math.floor(wattHours / 150);
  const phoneCharges = Math.floor(wattHours / 15);

  if (fridgeHours >= 8) {
    tags.push(`🍽️ ${fridgeHours}hr Fridge Runtime`);
  } else if (fridgeHours >= 1) {
    tags.push(`❄️ ${fridgeHours}+ Hour Fridge`);
  }

  if (phoneCharges >= 50) {
    tags.push(`📱 ${phoneCharges}+ Phone Charges`);
  } else if (phoneCharges >= 10) {
    tags.push(`📱 ${phoneCharges}+ Charges`);
  }

  if (watts >= 1500) {
    tags.push('☕ Powers Coffee Maker');
  }

  if (watts >= 1200) {
    tags.push('❄️ Runs AC Unit');
  }

  if (watts >= 500) {
    tags.push('💻 Work-From-Home Ready');
  }

  if (watts >= 5000) {
    tags.push('🏠 Whole-Home Capable');
  }

  return tags.slice(0, 3); // Max 3 tags
}
