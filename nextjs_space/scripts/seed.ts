import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import bcrypt from 'bcryptjs';

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

// Helper function to white-label product name from PowerX to EnerGenius
function whiteLabel(model: string): string {
  // Remove "Power X" and "PowerX" variations
  let energeniusModel = model
    .replace(/Power\s*X\s*/gi, '')
    .replace(/Lithium\s*/gi, '')
    .trim();
  
  // Map to EnerGenius product tiers based on wattage
  // Check larger wattages first to avoid substring matching issues
  if (energeniusModel.includes('30000') || energeniusModel.includes('30K')) return 'EnerGenius Guardian 30K';
  if (energeniusModel.includes('25000') || energeniusModel.includes('25K')) return 'EnerGenius Guardian 25K';
  if (energeniusModel.includes('20000') || energeniusModel.includes('20K')) return 'EnerGenius Nomad 20K';
  if (energeniusModel.includes('15000') || energeniusModel.includes('15K')) return 'EnerGenius Nomad 15K';
  if (energeniusModel.includes('10000') || energeniusModel.includes('10K')) return 'EnerGenius Titan 10K';
  if (energeniusModel.includes('8000')) return 'EnerGenius Guardian 8000';
  if (energeniusModel.includes('5000')) return 'EnerGenius Guardian 5000';
  if (energeniusModel.includes('3000')) return 'EnerGenius Guardian 3000';
  if (energeniusModel.includes('2000')) return 'EnerGenius Nomad 2000';
  if (energeniusModel.includes('1500')) return 'EnerGenius Nomad 1500';
  if (energeniusModel.includes('1000') && energeniusModel.includes('Mini')) return 'EnerGenius Scout 1000';
  if (energeniusModel.includes('750') && energeniusModel.includes('Mini')) return 'EnerGenius Scout 750';
  if (energeniusModel.includes('400')) return 'EnerGenius Scout 400';
  if (energeniusModel.includes('750') && !energeniusModel.includes('Mini')) return 'EnerGenius Scout 750 Pro';
  if (energeniusModel.includes('1000') && !energeniusModel.includes('Mini')) return 'EnerGenius Scout 1000 Pro';
  
  // For batteries, keep a simpler naming
  if (energeniusModel.includes('X120')) return 'EnerGenius PowerBank 120';
  if (energeniusModel.includes('X90')) return 'EnerGenius PowerBank 90';
  if (energeniusModel.includes('X80')) return 'EnerGenius PowerBank 80';
  if (energeniusModel.includes('45')) return 'EnerGenius PowerBank 45';
  if (energeniusModel.includes('40')) return 'EnerGenius PowerBank 40';
  if (energeniusModel.includes('AGM')) return 'EnerGenius Scout 750 AGM';
  
  return `EnerGenius ${energeniusModel}`;
}

async function main() {
  console.log('🌟 Starting EnerGenius database seeding...');
  
  // Create admin user if not exists
  console.log('👤 Creating admin user...');
  const adminEmail = 'admin@energenius.com';
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });
  
  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await prisma.user.create({
      data: {
        name: 'Admin User',
        email: adminEmail,
        password: hashedPassword,
        role: 'admin',
      },
    });
    console.log(`   ✅ Admin user created: ${adminEmail} / admin123`);
  } else {
    console.log('   ℹ️  Admin user already exists');
  }
  
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
  
  // Phase 2: Seed Customers
  console.log('\n👥 Seeding customers...');
  
  const customers = [
    {
      firstName: 'John',
      lastName: 'Smith',
      email: 'john.smith@example.com',
      phone: '(614) 555-0123',
      company: null,
      customerType: 'residential',
      billingAddress: '123 Main Street',
      billingCity: 'Columbus',
      billingState: 'OH',
      billingZip: '43215',
      shippingAddress: '123 Main Street',
      shippingCity: 'Columbus',
      shippingState: 'OH',
      shippingZip: '43215',
      status: 'active',
      notes: 'Interested in residential solar backup solutions',
    },
    {
      firstName: 'Sarah',
      lastName: 'Johnson',
      email: 'sarah.j@techcorp.com',
      phone: '(512) 555-0456',
      company: 'TechCorp Solutions',
      customerType: 'commercial',
      billingAddress: '456 Business Blvd, Suite 200',
      billingCity: 'Austin',
      billingState: 'TX',
      billingZip: '78701',
      shippingAddress: '456 Business Blvd, Suite 200',
      shippingCity: 'Austin',
      shippingState: 'TX',
      shippingZip: '78701',
      status: 'active',
      taxExempt: true,
      taxId: '12-3456789',
      notes: 'Commercial client - multiple office locations',
    },
    {
      firstName: 'Mike',
      lastName: 'Rodriguez',
      email: 'mike.r@gmail.com',
      phone: '(602) 555-0789',
      company: null,
      customerType: 'residential',
      billingAddress: '789 Desert View Drive',
      billingCity: 'Phoenix',
      billingState: 'AZ',
      billingZip: '85001',
      shippingAddress: '789 Desert View Drive',
      shippingCity: 'Phoenix',
      shippingState: 'AZ',
      shippingZip: '85001',
      status: 'active',
      notes: 'Off-grid solar installation project',
    },
  ];
  
  for (const customerData of customers) {
    const existing = await prisma.customer.findUnique({
      where: { email: customerData.email },
    });
    
    if (!existing) {
      await prisma.customer.create({ data: customerData });
      console.log(`   ✅ Created customer: ${customerData.firstName} ${customerData.lastName}`);
    }
  }
  
  // Phase 2: Seed Team Members
  console.log('\n👔 Seeding team members...');
  
  // Get admin user for linking
  const adminUser = await prisma.user.findUnique({
    where: { email: adminEmail },
  });
  
  const teamMembers = [
    {
      firstName: 'Admin',
      lastName: 'User',
      email: adminEmail,
      phone: '(614) 555-1000',
      role: 'admin',
      department: 'management',
      status: 'active',
      userId: adminUser?.id,
      hireDate: new Date('2024-01-01'),
      notes: 'System administrator and business owner',
    },
    {
      firstName: 'Emily',
      lastName: 'Chen',
      email: 'emily.chen@energenius.com',
      phone: '(614) 555-1001',
      role: 'staff',
      department: 'sales',
      status: 'active',
      hireDate: new Date('2024-02-15'),
      notes: 'Senior sales representative - residential focus',
    },
    {
      firstName: 'David',
      lastName: 'Martinez',
      email: 'david.martinez@energenius.com',
      phone: '(614) 555-1002',
      role: 'staff',
      department: 'fulfillment',
      status: 'active',
      hireDate: new Date('2024-03-01'),
      notes: 'Fulfillment coordinator - manages supplier relationships',
    },
  ];
  
  for (const memberData of teamMembers) {
    const existing = await prisma.teamMember.findUnique({
      where: { email: memberData.email },
    });
    
    if (!existing) {
      await prisma.teamMember.create({ data: memberData });
      console.log(`   ✅ Created team member: ${memberData.firstName} ${memberData.lastName}`);
    }
  }
  
  // Phase 2: Seed Email Templates
  console.log('\n📧 Seeding email templates...');
  
  const emailTemplates = [
    {
      name: 'powerx_order_notification',
      category: 'supplier',
      subject: 'New Order - {{orderNumber}} - {{customerName}}',
      body: `Dear PowerX Team,

We have a new order that requires fulfillment:

ORDER DETAILS:
Order Number: {{orderNumber}}
Order Date: {{orderDate}}

CUSTOMER INFORMATION:
Name: {{customerName}}
Email: {{customerEmail}}
Phone: {{customerPhone}}

SHIPPING ADDRESS:
{{shippingAddress}}
{{shippingCity}}, {{shippingState}} {{shippingZip}}
{{shippingCountry}}

ORDER ITEMS:
{{items}}

TOTAL: {{totalAmount}}

Please confirm receipt of this order and provide:
1. Estimated ship date
2. Tracking information once shipped

Thank you,
EnerGenius / Renewable Resource Group LLC`,
      variables: JSON.stringify([
        'orderNumber',
        'orderDate',
        'customerName',
        'customerEmail',
        'customerPhone',
        'shippingAddress',
        'shippingCity',
        'shippingState',
        'shippingZip',
        'shippingCountry',
        'items',
        'totalAmount',
      ]),
      description: 'Email template for notifying PowerX supplier of new orders requiring dropship fulfillment',
      isActive: true,
    },
    {
      name: 'customer_order_confirmation',
      category: 'customer',
      subject: 'Order Confirmation - {{orderNumber}}',
      body: `Dear {{customerName}},

Thank you for your order! We're excited to help power your energy independence.

ORDER CONFIRMATION:
Order Number: {{orderNumber}}
Order Date: {{orderDate}}
Total Amount: {{totalAmount}}

SHIPPING TO:
{{shippingAddress}}
{{shippingCity}}, {{shippingState}} {{shippingZip}}

ORDER ITEMS:
{{items}}

WHAT'S NEXT:
- Your order has been forwarded to our fulfillment partner
- You'll receive a shipping notification with tracking details within 2-3 business days
- Estimated delivery: 5-7 business days from ship date

If you have any questions, please contact us at:
Email: support@energenius.com
Phone: (614) 555-SOLAR

Thank you for choosing EnerGenius!

Best regards,
The EnerGenius Team
Renewable Resource Group LLC`,
      variables: JSON.stringify([
        'customerName',
        'orderNumber',
        'orderDate',
        'totalAmount',
        'shippingAddress',
        'shippingCity',
        'shippingState',
        'shippingZip',
        'items',
      ]),
      description: 'Order confirmation email sent to customers after order is placed',
      isActive: true,
    },
    {
      name: 'customer_shipping_notification',
      category: 'customer',
      subject: 'Your Order Has Shipped! - {{orderNumber}}',
      body: `Dear {{customerName}},

Great news! Your EnerGenius order has shipped!

ORDER NUMBER: {{orderNumber}}

TRACKING INFORMATION:
Carrier: {{carrier}}
Tracking Number: {{trackingNumber}}
Track your shipment: {{trackingUrl}}

Estimated Delivery: {{estimatedDelivery}}

SHIPPING TO:
{{shippingAddress}}
{{shippingCity}}, {{shippingState}} {{shippingZip}}

WHAT'S IN YOUR SHIPMENT:
{{items}}

INSTALLATION & SUPPORT:
Once you receive your solar generator, visit our resources page for:
- Quick start guides
- Installation videos
- Safety information
- Warranty registration

Need help? Contact us:
Email: support@energenius.com
Phone: (614) 555-SOLAR

Thank you for choosing EnerGenius!

Best regards,
The EnerGenius Team
Renewable Resource Group LLC`,
      variables: JSON.stringify([
        'customerName',
        'orderNumber',
        'carrier',
        'trackingNumber',
        'trackingUrl',
        'estimatedDelivery',
        'shippingAddress',
        'shippingCity',
        'shippingState',
        'shippingZip',
        'items',
      ]),
      description: 'Shipping notification email sent to customers when order ships',
      isActive: true,
    },
    {
      name: 'internal_order_alert',
      category: 'internal',
      subject: 'New Order Received - {{orderNumber}}',
      body: `New order alert!

Order: {{orderNumber}}
Customer: {{customerName}} ({{customerEmail}})
Amount: {{totalAmount}}
Status: {{status}}

Action Required:
1. Review order details in admin dashboard
2. Generate PowerX notification email
3. Monitor fulfillment status

View Order: [Admin Dashboard Link]`,
      variables: JSON.stringify([
        'orderNumber',
        'customerName',
        'customerEmail',
        'totalAmount',
        'status',
      ]),
      description: 'Internal alert for new orders - sent to fulfillment team',
      isActive: true,
    },
  ];
  
  for (const templateData of emailTemplates) {
    const existing = await prisma.emailTemplate.findUnique({
      where: { name: templateData.name },
    });
    
    if (!existing) {
      await prisma.emailTemplate.create({ data: templateData });
      console.log(`   ✅ Created email template: ${templateData.name}`);
    }
  }
  
  console.log('\n✅ Phase 2 seeding complete!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
