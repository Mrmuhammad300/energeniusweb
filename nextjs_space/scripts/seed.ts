import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

// Helper function to parse price string to numeric value
function parsePriceToNumeric(priceStr: string): number {
  return parseFloat(priceStr.replace(/[$,]/g, ''));
}

// Helper function to determine tier based on wattage
function determineTier(model: string, category: string): string {
  if (category.includes('Battery')) return 'Battery';
  
  const wattageMatch = model.match(/(\d+)(?:W|\s+Watt)/i);
  if (!wattageMatch) return 'Portable';
  
  const wattage = parseInt(wattageMatch[1]);
  
  if (wattage <= 2000) return 'Portable';
  if (wattage <= 8000) return 'Home';
  if (wattage <= 15000) return 'Professional';
  return 'Commercial';
}

// Helper function to determine applications
function determineApplications(model: string, category: string, wattage: number): string[] {
  if (category.includes('Battery')) return ['battery'];
  
  const apps: string[] = [];
  
  if (wattage <= 2000) {
    apps.push('portable');
    apps.push('residential');
  } else if (wattage <= 8000) {
    apps.push('residential');
  } else if (wattage <= 15000) {
    apps.push('residential');
    apps.push('commercial');
  } else {
    apps.push('commercial');
  }
  
  return apps;
}

// Helper function to white-label product name from PowerX to Energenius
function whiteLabel(model: string): string {
  // Remove "Power X" and "PowerX" variations
  let energeniusModel = model
    .replace(/Power\s*X\s*/gi, '')
    .replace(/Lithium\s*/gi, '')
    .trim();
  
  // Map to Energenius product tiers based on wattage
  if (energeniusModel.includes('400')) return 'Energenius Scout 400';
  if (energeniusModel.includes('750') && energeniusModel.includes('Mini')) return 'Energenius Scout 750';
  if (energeniusModel.includes('1000') && energeniusModel.includes('Mini')) return 'Energenius Scout 1000';
  if (energeniusModel.includes('1500')) return 'Energenius Nomad 1500';
  if (energeniusModel.includes('2000')) return 'Energenius Nomad 2000';
  if (energeniusModel.includes('3000')) return 'Energenius Guardian 3000';
  if (energeniusModel.includes('5000')) return 'Energenius Guardian 5000';
  if (energeniusModel.includes('8000')) return 'Energenius Guardian 8000';
  if (energeniusModel.includes('10000') || energeniusModel.includes('10K')) return 'Energenius Titan 10K';
  if (energeniusModel.includes('15000') || energeniusModel.includes('15K')) return 'Energenius Titan 15K';
  if (energeniusModel.includes('20000') || energeniusModel.includes('20K')) return 'Energenius Apex 20K';
  if (energeniusModel.includes('25000') || energeniusModel.includes('25K')) return 'Energenius Apex 25K';
  if (energeniusModel.includes('30000') || energeniusModel.includes('30K')) return 'Energenius Apex 30K';
  if (energeniusModel.includes('750') && !energeniusModel.includes('Mini')) return 'Energenius Scout 750 Pro';
  if (energeniusModel.includes('1000') && !energeniusModel.includes('Mini')) return 'Energenius Scout 1000 Pro';
  
  // For batteries, keep a simpler naming
  if (energeniusModel.includes('X120')) return 'Energenius PowerBank 120';
  if (energeniusModel.includes('X90')) return 'Energenius PowerBank 90';
  if (energeniusModel.includes('X80')) return 'Energenius PowerBank 80';
  if (energeniusModel.includes('45')) return 'Energenius PowerBank 45';
  if (energeniusModel.includes('40')) return 'Energenius PowerBank 40';
  if (energeniusModel.includes('AGM')) return 'Energenius Scout 750 AGM';
  
  return `Energenius ${energeniusModel}`;
}

async function main() {
  console.log('🌟 Starting Energenius database seeding...');
  
  // Read the products JSON file
  const productsPath = path.join(process.cwd(), 'public', 'powerx_products.json');
  const productsData = JSON.parse(fs.readFileSync(productsPath, 'utf-8'));
  
  // Clear existing products
  console.log('🗑️  Clearing existing products...');
  await prisma.product.deleteMany({});
  
  let productsCreated = 0;
  
  // Process generators
  console.log('⚡ Processing generators...');
  for (const gen of productsData.generators) {
    const wattageNum = parseInt(gen.specifications.continuous_power.replace(/[^0-9]/g, ''));
    const priceNumeric = parsePriceToNumeric(gen.price);
    const tier = determineTier(gen.model, gen.category);
    const applications = determineApplications(gen.model, gen.category, wattageNum);
    
    const product = await prisma.product.create({
      data: {
        model: whiteLabel(gen.model),
        sku: gen.sku,
        price: gen.price,
        priceNumeric,
        wattage: gen.wattage,
        continuousPower: gen.specifications.continuous_power,
        peakPower: gen.specifications.peak_power,
        batteryType: gen.specifications.battery_type,
        batteryCapacity: gen.specifications.battery_capacity,
        lifeCycles: gen.specifications.life_cycles,
        outputVoltage: gen.specifications.output_voltage,
        solarChargeController: gen.specifications.solar_charge_controller,
        acOutlets: gen.specifications.ac_outlets,
        dcPorts: gen.specifications.dc_ports,
        usbPorts: gen.specifications.usb_ports,
        weight: gen.specifications.weight,
        dimensions: gen.specifications.dimensions,
        inverterType: gen.specifications.inverter_type,
        features: gen.features,
        description: gen.description,
        imageUrl: gen.image_url,
        warranty: gen.warranty,
        category: gen.category,
        includedAccessories: gen.included_accessories || [],
        tier,
        application: applications,
      },
    });
    
    productsCreated++;
    console.log(`   ✅ Created: ${product.model}`);
  }
  
  // Process batteries
  console.log('🔋 Processing batteries...');
  for (const battery of productsData.batteries) {
    const priceNumeric = parsePriceToNumeric(battery.price);
    
    const product = await prisma.product.create({
      data: {
        model: whiteLabel(battery.model),
        sku: battery.sku,
        price: battery.price,
        priceNumeric,
        wattage: battery.wattage || 'N/A',
        continuousPower: battery.specifications.capacity || 'N/A',
        peakPower: battery.specifications.burst_power || 'N/A',
        batteryType: battery.specifications.battery_type,
        batteryCapacity: battery.specifications.capacity,
        lifeCycles: battery.specifications.cycle_life,
        outputVoltage: battery.specifications.voltage_range,
        solarChargeController: null,
        acOutlets: null,
        dcPorts: battery.specifications.input_ports || null,
        usbPorts: null,
        weight: battery.specifications.weight,
        dimensions: battery.specifications.dimensions,
        inverterType: null,
        features: battery.features,
        description: battery.description,
        imageUrl: battery.image_url,
        warranty: battery.warranty,
        category: battery.category,
        includedAccessories: [],
        tier: 'Battery',
        application: ['battery'],
      },
    });
    
    productsCreated++;
    console.log(`   ✅ Created: ${product.model}`);
  }
  
  console.log(`\n🎉 Successfully seeded ${productsCreated} products!`);
  console.log('   📊 Product Breakdown:');
  console.log(`      - Generators: ${productsData.generators.length}`);
  console.log(`      - Batteries: ${productsData.batteries.length}`);
  console.log(`      - Total: ${productsCreated}`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
