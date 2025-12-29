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
        role: 'SUPER_ADMIN',
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
  
  // Phase 3: Service Packages (Productized Services)
  console.log("\n🏗️  Phase 3: Seeding Service Packages...");
  
  const servicePackages = [
    // Residential Packages
    {
      name: "Virtual Site Audit",
      slug: "virtual-site-audit",
      category: "residential",
      packageType: "one_time",
      price: 299,
      priceMonthly: null,
      description: "Professional virtual site assessment to verify your location is ready for solar generator installation. Reduce installation risk and get expert recommendations before you buy.",
      tagline: "Verify Site Readiness & Reduce Installation Risk",
      isPopular: false,
      displayOrder: 1,
      deliverables: [
        "Site readiness verification via photos and video call",
        "Electrical panel compatibility assessment",
        "Installation location recommendations",
        "Risk summary report with identified concerns",
        "Professional installation recommendation"
      ],
      exclusions: [
        "Physical installation services",
        "Permitting assistance",
        "Hardware configuration",
        "On-site visit"
      ],
      prerequisites: [
        "Client has clear photos of installation area",
        "Client has photos of electrical panel",
        "Client available for 1-hour video consultation"
      ],
      scopeLimits: JSON.stringify({ audit_duration_hours: 1 }),
      bestFor: "All PowerX Units",
      targetWattage: "5000-30000",
      estimatedTimeline: "Completed within 48 hours",
      warrantyInfo: "100% refundable if you purchase a full installation package within 30 days",
      isActive: true,
      isPublic: true
    },
    {
      name: "The Quick Start",
      slug: "quick-start-install",
      category: "residential",
      packageType: "one_time",
      price: 3499,
      priceMonthly: null,
      description: "Essential installation service for smaller PowerX units. Perfect for straightforward installations with standard electrical runs. Get your solar generator up and running quickly and professionally.",
      tagline: "Fast & Affordable Professional Installation",
      isPopular: false,
      displayOrder: 2,
      deliverables: [
        "Professional generator placement and mounting",
        "Electrical hookup (up to 15ft from panel)",
        "Transfer switch installation",
        "City permitting (permit fees included)",
        "System testing and startup",
        "First annual service visit FREE ($200 value)"
      ],
      exclusions: [
        "Trenching beyond 15ft",
        "Rock excavation requiring specialized equipment",
        "Gas line installation",
        "HOA permitting",
        "Crane services"
      ],
      prerequisites: [
        "Installation location within 15ft of electrical panel",
        "Standard soil conditions (no rock)",
        "Electrical panel up to current code",
        "Clear equipment access to installation site"
      ],
      scopeLimits: JSON.stringify({ electrical_run_ft: 15, included_permits: ["city"] }),
      bestFor: "PowerX 5kW - 8kW Units",
      targetWattage: "5000-8000",
      estimatedTimeline: "2-4 weeks from booking",
      warrantyInfo: "1-year installation workmanship warranty",
      isActive: true,
      isPublic: true
    },
    {
      name: "The Turnkey",
      slug: "turnkey-install",
      category: "residential",
      packageType: "one_time",
      price: 5999,
      priceMonthly: null,
      description: "Our most popular installation package! Comprehensive installation service including extended electrical runs, gas line connection, and HOA permitting. We handle everything so you can enjoy worry-free backup power.",
      tagline: "Complete Installation - We Handle Everything",
      isPopular: true,
      displayOrder: 3,
      deliverables: [
        "Professional generator placement and mounting",
        "Extended electrical hookup (up to 50ft from panel)",
        "Natural gas or LP line connection",
        "Transfer switch installation with load management",
        "City AND HOA permitting (all permit fees included)",
        "24/7 remote monitoring setup",
        "System testing and startup",
        "1-Year comprehensive service plan included",
        "Owner training and documentation"
      ],
      exclusions: [
        "Trenching beyond 50ft",
        "Rock excavation requiring blasting",
        "Crane services (if required for access)",
        "Main electrical panel upgrades"
      ],
      prerequisites: [
        "Installation location within 50ft of electrical panel and gas line",
        "Standard soil conditions",
        "Existing gas service at property",
        "Electrical panel capacity sufficient for transfer switch"
      ],
      scopeLimits: JSON.stringify({ 
        electrical_run_ft: 50,
        gas_line_ft: 50,
        included_permits: ["city", "hoa"],
        service_visits: 1 
      }),
      bestFor: "PowerX 10kW - 15kW Units",
      targetWattage: "10000-15000",
      estimatedTimeline: "3-5 weeks from booking",
      warrantyInfo: "2-year installation workmanship warranty, 1-year service plan",
      isActive: true,
      isPublic: true
    },
    {
      name: "The Peace of Mind",
      slug: "peace-of-mind",
      category: "residential",
      packageType: "subscription",
      price: 5999,
      priceMonthly: 49,
      description: "Premium installation PLUS lifetime annual service with active subscription. Protect your investment with proactive maintenance, priority service, and dealer monitoring. We call you if your system fails - not the other way around.",
      tagline: "Premium Install + Lifetime Service Protection",
      isPopular: false,
      displayOrder: 4,
      deliverables: [
        "Everything included in The Turnkey package",
        "Priority installation scheduling",
        "Premium outdoor-rated materials upgrade",
        "Expedited permitting service",
        "Pro-active dealer monitoring (we call YOU if system fails)",
        "Annual preventive maintenance visit (for life with active subscription)",
        "Priority service dispatch for repairs",
        "Extended 5-year installation warranty",
        "Seasonal system health checks"
      ],
      exclusions: [
        "Repair parts (covered under manufacturer warranty)",
        "Service calls beyond annual visit (billable at standard rates)",
        "Modifications to original installation"
      ],
      prerequisites: [
        "Same as Turnkey package",
        "Commitment to $49/month subscription",
        "Installation location within 50ft of panel and gas line"
      ],
      scopeLimits: JSON.stringify({ 
        electrical_run_ft: 50,
        gas_line_ft: 50,
        included_permits: ["city", "hoa"],
        annual_service_visits: "unlimited_with_subscription"
      }),
      bestFor: "PowerX 10kW+ (High Criticality)",
      targetWattage: "10000-30000",
      estimatedTimeline: "2-3 weeks (priority scheduling)",
      warrantyInfo: "5-year installation warranty, lifetime annual service with active $49/mo subscription",
      isActive: true,
      isPublic: true
    },
    // Commercial Packages
    {
      name: "Site Commissioning",
      slug: "site-commissioning",
      category: "commercial",
      packageType: "one_time",
      price: 2500,
      priceMonthly: null,
      description: "Professional startup and warranty certification service for commercial clients with their own installation contractors. We verify your installation meets manufacturer specifications and activate your warranty coverage.",
      tagline: "Professional Startup & Warranty Certification",
      isPopular: false,
      displayOrder: 5,
      deliverables: [
        "Installation inspection and verification",
        "System startup and testing",
        "Load testing and performance validation",
        "Warranty registration and activation",
        "Operator training (up to 4 personnel)",
        "Commissioning documentation package",
        "Initial remote monitoring setup"
      ],
      exclusions: [
        "Physical installation work",
        "Permitting services",
        "Electrical or gas line work",
        "Equipment corrections (billable if required)"
      ],
      prerequisites: [
        "Generator already installed by licensed contractor",
        "All electrical and gas connections completed",
        "All permits obtained and approved",
        "Site ready for startup"
      ],
      scopeLimits: JSON.stringify({ 
        included_personnel_training: 4,
        startup_attempts: 1,
        return_visits_billable: true
      }),
      bestFor: "Commercial clients with own contractors",
      targetWattage: "15000-30000",
      estimatedTimeline: "1-2 weeks from scheduling",
      warrantyInfo: "Warranty activation service - manufacturer warranty applies",
      isActive: true,
      isPublic: true
    },
    {
      name: "Full Deployment",
      slug: "full-deployment",
      category: "commercial",
      packageType: "project_based",
      price: 12500,
      priceMonthly: null,
      description: "Complete turnkey installation service for commercial and industrial clients. From site preparation to final startup, we handle every aspect of your backup power deployment including crane placement, heavy-gauge wiring, and commercial permitting.",
      tagline: "Complete Commercial Turnkey Solution",
      isPopular: true,
      displayOrder: 6,
      deliverables: [
        "Site survey and engineering",
        "Concrete pad design and installation",
        "Crane placement services (if required)",
        "Heavy-gauge electrical wiring and subpanel",
        "Automatic transfer switch installation",
        "Natural gas or diesel fuel system connection",
        "Commercial permitting (all jurisdictions)",
        "Load bank testing",
        "System commissioning and startup",
        "Operator training (up to 8 personnel)",
        "As-built documentation package",
        "2-year maintenance plan included"
      ],
      exclusions: [
        "Rock excavation requiring blasting (quoted separately)",
        "Environmental remediation",
        "Building structural modifications",
        "Ongoing fuel delivery contracts"
      ],
      prerequisites: [
        "Site survey completed (can be arranged)",
        "Electrical capacity confirmed",
        "Fuel source available or planned",
        "Project timeline of 8-12 weeks accepted"
      ],
      scopeLimits: JSON.stringify({ 
        concrete_pad_included: true,
        crane_services_included: true,
        included_personnel_training: 8,
        maintenance_visits_year_1: 2,
        maintenance_visits_year_2: 2
      }),
      bestFor: "Commercial 15kW - 30kW Systems",
      targetWattage: "15000-30000",
      estimatedTimeline: "8-12 weeks from contract",
      warrantyInfo: "3-year installation warranty, 2-year maintenance plan included",
      isActive: true,
      isPublic: true
    }
  ];

  for (const pkg of servicePackages) {
    await prisma.servicePackage.upsert({
      where: { slug: pkg.slug },
      update: pkg,
      create: pkg
    });
  }

  console.log(`   ✅ Created/updated ${servicePackages.length} service packages`);

  // Seed Knowledge Base Articles
  console.log('\n🔖 Seeding knowledge base articles...');
  const kbArticles = [
    {
      title: "Getting Started with Your Solar Generator",
      slug: "getting-started-with-your-solar-generator",
      category: "getting_started",
      content: `# Welcome to Your New Solar Generator!

Congratulations on your purchase! This guide will help you get started with your EnerGenius solar generator.

## What's in the Box

Your solar generator package includes:
- Main power station unit
- AC charging cable
- User manual and quick start guide
- Warranty registration card
- Solar panel connection cables (if applicable)

## Initial Setup

### 1. Unboxing and Inspection
- Carefully remove all items from the packaging
- Inspect for any shipping damage
- Keep all packaging materials for at least 30 days

### 2. First Charge
Before first use, charge your unit to 100% using the included AC adapter:
- Connect the AC charging cable to a wall outlet
- Plug the other end into your generator's AC input port
- Charging time: 6-12 hours depending on model
- LED indicators will show charging progress

### 3. Location Selection
Choose a location that is:
- Dry and well-ventilated
- Away from direct sunlight or heat sources
- Easily accessible for monitoring
- On a stable, level surface

## Safety First

⚠️ **Important Safety Guidelines:**
- Never use indoors in enclosed spaces
- Keep away from water and moisture
- Do not cover ventilation openings
- Read the full safety manual before operation

## Next Steps

After initial charging:
1. Test the power output with a small device
2. Register your warranty at our customer portal
3. Download the Smart Connect app for monitoring
4. Review the full user manual for advanced features

## Need Help?

- **Live Support:** Available 8 AM - 8 PM EST
- **Email:** support@rrg-solutions.com
- **Knowledge Base:** Browse articles for detailed guides
- **Video Tutorials:** Visit our YouTube channel

Your satisfaction is our priority. Don't hesitate to reach out with any questions!`,
      excerpt: "Everything you need to know to get started with your new solar generator, from unboxing to first use.",
      displayOrder: 1,
      isPublished: true,
      isFeatured: true,
      metaDescription: "Complete getting started guide for your EnerGenius solar generator. Learn about initial setup, charging, and safety guidelines.",
      keywords: ["getting started", "solar generator", "setup", "first use", "unboxing"],
      viewCount: 0,
      helpfulCount: 0,
      notHelpfulCount: 0,
      authorName: "EnerGenius Support Team",
      publishedAt: new Date()
    },
    {
      title: "Accessing Your Smart Connect Dashboard",
      slug: "accessing-smart-connect-dashboard",
      category: "getting_started",
      content: `# Smart Connect Dashboard Guide

Your Smart Connect dashboard provides real-time monitoring and control of your solar generator system.

## What is Smart Connect?

Smart Connect is your comprehensive monitoring portal that allows you to:
- Track real-time power consumption
- Monitor battery health and charge levels
- View usage history and analytics
- Receive maintenance alerts
- Access warranty information
- Schedule service appointments

## Accessing Your Dashboard

### First-Time Setup

1. **Locate Your Credentials**
   - Your login credentials were sent to your email after purchase
   - Subject line: "Welcome to EnerGenius - Dashboard Access"
   - If you can't find it, check your spam folder

2. **Visit the Dashboard**
   - Go to: https://rrg-solutions.com/dashboard
   - Or click the "Dashboard" link in your navigation menu

3. **Log In**
   - Enter your email address
   - Enter your temporary password
   - Click "Sign In"

4. **Set Your Permanent Password**
   - You'll be prompted to change your password on first login
   - Use a strong password (8+ characters, mix of letters, numbers, symbols)
   - Confirm your new password

### Troubleshooting Login Issues

**Forgot Password?**
- Click "Forgot Password" on the login page
- Enter your email address
- Check your email for reset instructions
- Follow the link to create a new password

**Account Not Found?**
- Verify you're using the email address from your order
- Allow up to 24 hours after purchase for account activation
- Contact support if issues persist

## Dashboard Features

### Home Screen
- **Current Status:** Real-time power output and battery level
- **Quick Actions:** Start/stop monitoring, view alerts
- **Recent Activity:** Last 7 days of usage

### Power Monitoring
- Live wattage consumption
- Historical usage graphs (daily, weekly, monthly)
- Peak usage times
- Cost savings calculator

### Battery Health
- Current state of charge (%)
- Estimated runtime remaining
- Cycle count and battery health score
- Temperature monitoring

### Maintenance
- Service history
- Upcoming maintenance reminders
- Warranty information
- Parts and supplies ordering

### Settings
- User profile management
- Notification preferences
- Alert thresholds
- System configuration

## Mobile Access

Access your dashboard on-the-go:
- Fully responsive design works on any device
- No app download required
- Same features as desktop version
- Save to home screen for quick access

## Need Assistance?

If you're having trouble accessing your dashboard:
- **Email:** support@rrg-solutions.com
- **Phone:** (555) 123-4567
- **Live Chat:** Available on our website 8 AM - 8 PM EST

We're here to help you get the most out of your solar generator system!`,
      excerpt: "Learn how to access and navigate your Smart Connect dashboard for real-time monitoring and control.",
      displayOrder: 2,
      isPublished: true,
      isFeatured: true,
      metaDescription: "Step-by-step guide to accessing your Smart Connect dashboard and monitoring your solar generator system.",
      keywords: ["smart connect", "dashboard", "monitoring", "login", "account access"],
      viewCount: 0,
      helpfulCount: 0,
      notHelpfulCount: 0,
      authorName: "EnerGenius Support Team",
      publishedAt: new Date()
    },
    {
      title: "Installation Guide for Residential Systems",
      slug: "installation-guide-residential-systems",
      category: "installation",
      content: `# Residential Solar Generator Installation

This guide covers installation considerations for residential solar generator systems.

## DIY vs Professional Installation

### When DIY is Appropriate
- Portable units under 3kW
- No permanent wiring required
- Simple plug-and-play operation
- Indoor/outdoor flexibility

### When to Hire a Professional
- Systems over 5kW
- Permanent installation required
- Automatic transfer switch integration
- Building code compliance needed
- Warranty requirements specify professional installation

## Pre-Installation Checklist

Before starting installation:
- [ ] Review local building codes and permit requirements
- [ ] Verify electrical capacity at installation site
- [ ] Confirm clearance requirements (see specifications)
- [ ] Prepare level, stable foundation or pad
- [ ] Ensure proper ventilation
- [ ] Plan cable routing paths
- [ ] Gather necessary tools and materials

## Location Requirements

### Indoor Placement (Portable Units Only)
- Well-ventilated area
- Away from living spaces during operation
- Near garage door or window for exhaust
- Protected from weather
- Easy access for maintenance

### Outdoor Placement
**Recommended:**
- Concrete pad or stable platform
- 3-5 feet clearance on all sides
- Protected from direct rain/snow
- Away from windows and air intakes
- Secure from theft/vandalism

**Avoid:**
- Low-lying areas prone to flooding
- Directly under roof drainage
- Areas with poor ventilation
- Locations blocking access routes

## Electrical Connections

### Simple Plug-In (Portable Units)
1. Fully charge the unit
2. Plug devices directly into AC outlets
3. Monitor power consumption via display
4. Avoid overloading (check wattage limits)

### Transfer Switch Installation (Permanent Systems)
**⚠️ REQUIRES LICENSED ELECTRICIAN**

A transfer switch safely connects your generator to your home's electrical panel:

**Benefits:**
- Powers multiple circuits simultaneously
- Automatic switching during outage
- Prevents backfeed to utility grid
- Code-compliant installation

**Installation Steps (Professional Only):**
1. Install transfer switch next to main panel
2. Connect generator output to transfer switch
3. Wire selected circuits through transfer switch
4. Test switching operation
5. Obtain final electrical inspection

## Solar Panel Connections

If you purchased solar panels:

### Panel Placement
- Face true south (northern hemisphere)
- Tilt angle = your latitude ±15°
- Free from shade 9 AM - 3 PM
- Secure mounting (roof, ground, or tracker)

### Wiring
1. Connect panels in series for voltage matching
2. Use proper gauge wire for distance
3. Connect to generator's solar input port
4. Verify polarity before connection
5. Test charging operation

### Safety
- Never exceed maximum solar input voltage
- Use weather-resistant connections
- Install lightning protection if applicable
- Follow NEC Article 690 requirements

## Fuel Connections (Generator Models)

For models with gas/propane options:

**⚠️ REQUIRES LICENSED GAS PROFESSIONAL**

- Natural gas connection: Hard-piped by licensed plumber
- Propane: Installed per NFPA 58 standards
- Proper pressure regulation required
- Leak testing mandatory
- Regular inspection recommended

## Final Steps

After installation:
1. Perform safety inspection
2. Test all operations
3. Register product for warranty
4. Document installation (photos recommended)
5. Schedule first maintenance check
6. Add to home insurance policy

## Safety Reminders

- Never operate gas-powered units indoors
- Maintain proper clearances
- Keep fire extinguisher nearby
- Ensure proper grounding
- Follow all manufacturer guidelines

## Professional Installation Services

Need expert installation? EnerGenius offers:
- **Virtual Site Audit:** $95 - Remote consultation
- **Quick Start Installation:** $750 - Basic setup and testing
- **Turnkey Installation:** $3,950 - Complete residential installation

Visit our Services page or contact us for a custom quote.

## Questions?

- **Technical Support:** support@rrg-solutions.com
- **Installation Quotes:** sales@rrg-solutions.com  
- **Phone:** (555) 123-4567
- **Live Chat:** Available 8 AM - 8 PM EST`,
      excerpt: "Complete installation guide for residential solar generator systems, including location selection, electrical connections, and safety requirements.",
      displayOrder: 3,
      isPublished: true,
      isFeatured: false,
      metaDescription: "Professional installation guide for residential solar generators covering placement, electrical connections, and safety requirements.",
      keywords: ["installation", "residential", "solar generator", "setup", "electrical"],
      viewCount: 0,
      helpfulCount: 0,
      notHelpfulCount: 0,
      authorName: "EnerGenius Support Team",
      publishedAt: new Date()
    },
    {
      title: "Maintenance and Care Best Practices",
      slug: "maintenance-and-care-best-practices",
      category: "maintenance",
      content: `# Solar Generator Maintenance Guide

Proper maintenance ensures optimal performance and extends the life of your solar generator.

## Daily Checks (For Active Systems)

- Monitor battery charge level
- Check for any error messages or alerts
- Verify ventilation openings are clear
- Inspect for any unusual sounds or odors
- Confirm output voltage is within normal range

## Weekly Maintenance

### Visual Inspection
- Check all connections for tightness
- Inspect power cables for damage
- Look for signs of moisture or corrosion
- Verify cooling fans operate properly
- Ensure unit is clean and dust-free

### Performance Check
- Test output with various loads
- Monitor charging efficiency
- Review power consumption logs
- Check temperature readings

## Monthly Maintenance

### Deep Clean
1. Power off and disconnect all cables
2. Wipe exterior with damp cloth
3. Clean ventilation openings (compressed air)
4. Inspect and clean cooling fans
5. Check and tighten all connections
6. Clean solar panels (if applicable)

### Battery Health
- Run full charge/discharge cycle
- Check battery voltage readings
- Monitor charging time
- Review battery health metrics in app
- Clean battery terminals if accessible

### Documentation
- Log runtime hours
- Record any issues or anomalies
- Update maintenance log
- Save performance data

## Seasonal Maintenance

### Spring
- Inspect for winter weather damage
- Check seals and gaskets
- Test all safety features
- Verify outdoor mounting security
- Clean and inspect solar panels thoroughly

### Summer
- Verify cooling system operation
- Check for overheating issues
- Ensure adequate shade/ventilation
- Monitor increased cooling demands
- Inspect for insect nests or debris

### Fall
- Prepare for heating season load
- Test automatic transfer switch
- Inspect weatherproofing
- Check fuel systems (if applicable)
- Stock emergency supplies

### Winter
- Monitor battery performance in cold
- Protect from freezing temperatures
- Keep snow/ice clear from unit
- Check for proper ventilation
- Test cold weather starting

## Annual Professional Service

We recommend annual professional maintenance including:
- Complete electrical testing
- Battery capacity assessment
- Cooling system service
- Firmware updates
- Safety system verification
- Warranty compliance inspection

**Schedule Your Annual Service:**
- Online: rrg-solutions.com/service
- Phone: (555) 123-4567
- Email: service@rrg-solutions.com

## Battery Care

### Lithium Battery (LiFePO4) Systems
**Best Practices:**
- Keep charged between 20-80% for daily use
- Fully charge/discharge monthly for calibration
- Store at 50-60% charge if unused
- Avoid extreme temperatures (32-95°F ideal)
- Never let battery fully deplete repeatedly

**Warning Signs:**
- Reduced runtime
- Slow charging
- Swelling or deformation
- Unusual heat during charging
- Error messages

### Battery Replacement
- Typical lifespan: 8,000 cycles (10-15 years)
- Always use manufacturer-approved batteries
- Professional installation recommended
- Recycle old batteries properly
- Register new battery for warranty

## Troubleshooting Common Issues

### Unit Won't Power On
1. Check main power switch position
2. Verify battery charge level
3. Inspect main fuse
4. Check for error codes
5. Contact support if unresolved

### Reduced Output Power
1. Check load requirements vs capacity
2. Verify battery health
3. Inspect for overheating
4. Review error messages
5. Test with different loads

### Charging Issues
1. Verify input power source
2. Check charging cable connections
3. Monitor charging current
4. Review charge controller settings
5. Test with AC charger (eliminate solar variables)

### Unusual Noises
- Cooling fan operation is normal
- Inverter may produce slight hum
- Clicking may indicate relay operation
- Grinding or screeching requires immediate attention
- Document any unusual sounds for technician

## Safety Inspections

Monthly safety checks should include:
- [ ] Ground connections secure
- [ ] No exposed wiring
- [ ] Circuit breakers functional
- [ ] Emergency shutoff accessible
- [ ] Fire extinguisher nearby (for fuel units)
- [ ] Carbon monoxide detector operational (if applicable)
- [ ] Warning labels visible and legible

## Storage (Long-Term)

If storing your unit for extended periods:
1. Fully charge battery to 50-60%
2. Clean and dry unit completely
3. Disconnect all cables
4. Store in climate-controlled space
5. Recharge every 3 months
6. Cover to prevent dust accumulation
7. Check condition monthly

## Warranty Maintenance Requirements

To maintain warranty coverage:
- Perform all required maintenance
- Use only approved parts/accessories
- Document all maintenance activities
- Schedule annual professional inspections
- Report issues promptly
- Follow all safety guidelines

**Keep records of:**
- Maintenance logs
- Service receipts
- Warranty registration
- Installation documentation

## When to Call for Service

Contact professional service immediately if:
- Unit displays error codes
- Output is significantly reduced
- Battery won't hold charge
- Unit overheats frequently
- Unusual smells or sounds
- Physical damage occurs
- Safety features not functioning

## Replacement Parts

Order genuine parts through:
- **Online:** rrg-solutions.com/parts
- **Phone:** (555) 123-PART
- **Email:** parts@rrg-solutions.com

Common replacement parts:
- Charging cables
- AC outlet covers
- Cooling fans
- Fuses and breakers
- Battery packs (authorized only)

## Extended Protection Plans

Consider our extended maintenance plans:
- **Basic:** Annual inspection + priority support
- **Plus:** Bi-annual service + 20% parts discount
- **Premium:** Quarterly service + free parts + 2-year warranty extension

Contact sales for pricing and details.

---

**Questions or Concerns?**

Our support team is here to help:
- **Email:** support@rrg-solutions.com
- **Phone:** (555) 123-4567  
- **Live Chat:** 8 AM - 8 PM EST daily
- **Emergency:** 24/7 technical support line`,
      excerpt: "Comprehensive maintenance guide covering daily checks, seasonal care, battery maintenance, and troubleshooting tips.",
      displayOrder: 4,
      isPublished: true,
      isFeatured: true,
      metaDescription: "Essential maintenance and care guide for your solar generator including daily checks, cleaning, battery care, and troubleshooting.",
      keywords: ["maintenance", "care", "battery", "troubleshooting", "cleaning"],
      viewCount: 0,
      helpfulCount: 0,
      notHelpfulCount: 0,
      authorName: "EnerGenius Support Team",
      publishedAt: new Date()
    },
    {
      title: "Understanding Your Warranty Coverage",
      slug: "understanding-warranty-coverage",
      category: "getting_started",
      content: `# EnerGenius Warranty Coverage

Understanding your warranty helps you get the most protection for your investment.

## Standard Warranty Coverage

All EnerGenius solar generators include:

### 5-Year Limited Warranty
**Covers:**
- Manufacturing defects
- Material failures
- Workmanship issues
- Component malfunctions
- Inverter and charge controller

**Excludes:**
- Normal wear and tear
- Accidental damage
- Misuse or neglect
- Unauthorized modifications
- Environmental damage (flood, fire, etc.)
- Battery degradation beyond specifications

### Battery Warranty

**LiFePO4 Batteries:**
- 8,000 cycles or 10 years (whichever comes first)
- Maintains 70% capacity at end of warranty period
- Covers manufacturing defects
- Does not cover user damage or improper charging

**Lead-Acid Batteries:**
- 2 years or 500 cycles
- Maintains 80% capacity
- Prorated after first year

## What's Covered

### Components Included
- Inverter and power electronics
- Charge controller
- Battery management system (BMS)
- Display and controls
- AC/DC outlets
- Internal wiring and connections
- Cooling system
- Structural housing

### Types of Coverage
1. **Repair:** We fix the issue at no cost
2. **Replacement:** We provide equivalent or better part
3. **Unit Exchange:** In rare cases of multiple failures

## What's NOT Covered

### Exclusions
- Cosmetic damage (scratches, dents)
- Accessories and cables (separate 1-year warranty)
- Solar panels (covered by panel manufacturer)
- Transportation costs (except major repairs)
- Labor for user-serviceable parts
- Damage from improper installation
- Failure to perform required maintenance
- Using incompatible power sources
- Acts of God (lightning, floods, earthquakes)

### Warranty Voids
Your warranty may be void if:
- Serial number removed or altered
- Repairs by unauthorized technician
- Use of non-genuine parts
- Operating outside specifications
- Commercial use (residential warranty)
- Product modified or altered
- Preventive maintenance neglected

## Registering Your Warranty

**Important: Register within 30 days of purchase!**

### How to Register
1. Visit: rrg-solutions.com/warranty
2. Enter your information:
   - Name and contact details
   - Serial number (found on unit)
   - Purchase date and order number
   - Installation date
3. Upload proof of purchase
4. Submit registration form

### What Happens Next
- Receive confirmation email immediately
- Warranty certificate sent within 5 business days
- Account created in customer portal
- Registered for service reminders

## Making a Warranty Claim

### Step 1: Troubleshoot
Before filing a claim:
- Check our troubleshooting guides
- Contact technical support
- Try suggested solutions
- Document the issue with photos/videos

### Step 2: Contact Us
**Email:** warranty@rrg-solutions.com  
**Phone:** (555) 123-WARE
**Portal:** rrg-solutions.com/warranty-claim

**Provide:**
- Warranty registration number
- Serial number
- Description of issue
- When problem started
- Photos or videos
- Error codes or messages

### Step 3: Evaluation
We will:
- Review your claim within 48 hours
- Request additional information if needed
- Determine if issue is covered
- Provide resolution options

### Step 4: Resolution
**If Approved:**
- We'll send replacement parts (2-5 business days)
- Provide return label for defective parts
- Schedule technician visit (if needed)
- Process warranty repair

**If Not Covered:**
- Explanation of why claim was denied
- Quote for out-of-warranty repair
- Advice on preventing future issues

## Extended Warranty Options

### EnerGenius Protection Plus
Add up to 5 additional years of coverage:

**Benefits:**
- Extended component coverage
- Accidental damage protection
- Zero deductible
- Priority service
- Free annual inspections
- Loaner unit during major repairs

**Pricing:**
- +2 Years: $299
- +3 Years: $449
- +5 Years: $699

*Must be purchased within 90 days of original purchase*

### Commercial Extended Warranty
For commercial installations:
- Up to 10-year coverage available
- Include labor and transportation
- On-site service priority
- Preventive maintenance included
- 24/7 emergency support

Contact sales for commercial warranty options.

## Service Locations

### Authorized Service Centers
We have service centers across our coverage area:
- Ohio
- Texas
- Arizona
- New Mexico
- Midwest region

Find nearest location: rrg-solutions.com/service-locators

### Mobile Service
For larger units or complex issues:
- Technician comes to your location
- Diagnose and repair on-site
- Scheduled at your convenience
- Available in most service areas

## Warranty Transfers

### Selling Your Unit?
Warranty is transferable to new owner:
1. Log into customer portal
2. Submit transfer request
3. Provide new owner information
4. Pay $50 transfer fee
5. New owner receives updated warranty

**Benefits:**
- Increases resale value
- Provides buyer confidence
- Simple online process

## International Warranty

For international purchases:
- Warranty valid in country of purchase
- Service through local authorized centers
- May require proof of export
- International shipping costs not covered
- Contact international support for details

## Maintenance Requirements

To maintain warranty coverage:

### Required Actions
- Register product within 30 days
- Perform routine maintenance
- Use authorized service for major repairs
- Document all maintenance
- Report issues promptly

### Recommended Actions
- Annual professional inspection
- Keep maintenance logs
- Use genuine parts
- Follow operating guidelines
- Store safely when not in use

## Frequently Asked Questions

**Q: Do I need to keep my receipt?**  
A: Yes! Keep original purchase receipt for warranty claims.

**Q: What if I lost my warranty certificate?**  
A: Access it anytime in your customer portal or request a new copy.

**Q: Can I upgrade my warranty later?**  
A: Extended warranties must be purchased within 90 days of original purchase.

**Q: What's the turnaround time for warranty repairs?**  
A: Most repairs completed within 7-14 business days from receiving unit.

**Q: Who pays for shipping on warranty claims?**  
A: We provide prepaid label for sending units to us. We pay return shipping.

**Q: Can I get a refund instead of repair?**  
A: Refunds are not provided under warranty. We repair or replace defective products.

**Q: Does warranty cover installation?**  
A: No. Installation must be done by licensed professional per local codes.

## Contact Warranty Support

**General Questions:**  
warranty@rrg-solutions.com  
(555) 123-WARE

**File a Claim:**  
rrg-solutions.com/warranty-claim

**Live Chat:**  
Available 8 AM - 6 PM EST M-F

**Customer Portal:**  
rrg-solutions.com/login

---

We stand behind our products with industry-leading warranty coverage. Your satisfaction and peace of mind are our priorities!`,
      excerpt: "Complete guide to your EnerGenius warranty coverage, including what's covered, how to file claims, and extended protection options.",
      displayOrder: 5,
      isPublished: true,
      isFeatured: false,
      metaDescription: "Understand your EnerGenius solar generator warranty coverage, claim process, and extended protection options.",
      keywords: ["warranty", "coverage", "protection", "claim", "guarantee"],
      viewCount: 0,
      helpfulCount: 0,
      notHelpfulCount: 0,
      authorName: "EnerGenius Support Team",
      publishedAt: new Date()
    },
    {
      title: "Shipping and Delivery Information",
      slug: "shipping-and-delivery-information",
      category: "shipping",
      content: `# Shipping and Delivery Information

Everything you need to know about receiving your solar generator order.

## Shipping Timeline

### Processing Time
- **In-Stock Items:** 1-2 business days
- **Made-to-Order:** 5-7 business days
- **Custom Configurations:** 10-14 business days

Orders placed before 2 PM EST ship same day (if in stock).

### Delivery Time
After shipment:
- **Standard Ground:** 5-7 business days
- **Express:** 2-3 business days
- **Overnight:** Next business day

*Times may vary by location and carrier*

## Shipping Methods

### Standard Ground (Free for most orders)
- Free shipping on orders over $100
- Carrier: FedEx or UPS
- Tracking provided
- Signature may be required

### Express Shipping
- 2-3 day delivery
- Available at checkout
- Pricing based on weight and destination
- Signature required

### Freight Shipping (Large Units)
For units over 100 lbs:
- LTL freight carrier
- Scheduled delivery appointment
- Curbside delivery included
- Inside delivery available (additional cost)
- Commercial addresses preferred

## Tracking Your Order

### Order Confirmation
You'll receive an email immediately after ordering with:
- Order number
- Items purchased
- Estimated ship date
- Billing/shipping addresses

### Shipping Notification
When your order ships:
- Shipping confirmation email
- Tracking number
- Carrier information
- Estimated delivery date
- Link to track package

### Track Online
- Visit: rrg-solutions.com/track
- Enter order number or tracking number
- View real-time status updates

## Delivery Requirements

### Residential Delivery
- Someone 18+ must be present
- Signature required for orders over $500
- Safe drop-off location acceptable for smaller items
- Driver cannot enter home or garage

### Commercial Delivery
- Business hours delivery
- Receiving dock preferred
- Provide business name and hours
- May require DOT authority for freight

### Freight Delivery (Large Units)
1. Carrier calls to schedule appointment
2. Must be available during delivery window
3. Inspect shipment before signing
4. Driver assists with unloading to curb only
5. Additional services (inside delivery, setup) available

## Preparing for Delivery

### What You Need
- Clear path to delivery location
- Space to inspect shipment
- Camera for damage documentation
- Tools for uncrating (if freight)
- Help for heavy items

### Delivery Location
Ensure your location:
- Is accessible for delivery vehicle
- Has clear path 48" wide minimum (freight)
- Can accommodate pallet jack (if freight)
- Is protected from weather
- Has adequate space for inspection

## Receiving Your Shipment

### Inspection Checklist
Before signing for delivery:
- [ ] Count all packages
- [ ] Check for visible damage
- [ ] Look for punctures or tears
- [ ] Note any concerns on delivery receipt
- [ ] Take photos if damage suspected
- [ ] Don't refuse delivery unless severely damaged

### If You Find Damage
**External damage:**
1. Note on delivery receipt "damaged box"
2. Take photos of all sides
3. Sign for delivery
4. Open and inspect contents immediately
5. Contact us within 48 hours

**Concealed damage:**
1. Keep all packaging materials
2. Take detailed photos
3. Contact us within 48 hours
4. Do not use damaged items
5. We'll arrange inspection or replacement

## Shipping Restrictions

### Areas We Ship To
- All 50 US states
- APO/FPO addresses (some restrictions)
- US territories (additional fees may apply)

### Areas We Don't Ship To
- International addresses (contact for options)
- PO Boxes (for large items)
- Restricted zip codes (carrier limitations)

## Shipping Costs

### Free Shipping Thresholds
- Standard items: Orders over $100
- Power banks: Always free shipping
- Generators 5kW+: Free ground shipping
- Freight items: Varies by weight and location

### Cost Factors
Shipping fees based on:
- Item weight and dimensions
- Destination zip code
- Delivery speed selected
- Special handling requirements

Calculate shipping at checkout or contact us for quotes.

## International Shipping

We currently serve US customers primarily. For international orders:
- Contact sales for availability
- Customs and duties are customer responsibility
- Extended delivery times
- Warranty coverage may vary
- Voltage compatibility must be verified

## Refused or Returned Shipments

### Refused Delivery
If you refuse delivery:
- Original shipping charges apply
- Return shipping charges apply
- 15% restocking fee
- Refund processed after item received
- May take 2-3 weeks total

### Return to Sender
If package is returned due to:
- Incorrect address (your error)
- Unable to deliver
- Delivery refused

You are responsible for:
- Original shipping cost
- Return shipping cost
- Reshipment cost (if desired)

## Lost or Stolen Packages

### Carrier Lost Package
If tracking shows:
- Package stuck in transit 14+ days
- Missing scan events
- Delivery to wrong address

We will:
1. File claim with carrier
2. Wait 7 days for carrier investigation
3. Send replacement or refund
4. Process claim with carrier

### Stolen Package (Porch Theft)
If tracking confirms delivery but you didn't receive:
- File police report
- Provide report number to us
- Check with neighbors
- Verify delivery address
- We'll assess options case-by-case

**Protection:** Consider requiring signature or use secure location delivery notes.

## Delivery Issues

### Damaged in Transit
We pack securely but occasionally damage occurs:
- We'll send replacement parts/unit
- No cost to you for carrier damage
- Keep all packaging for inspection
- Photos required for claim

### Wrong Item Received
If you receive incorrect items:
- Contact us immediately
- Don't open if clearly wrong
- We'll arrange correct shipment
- Return label provided
- No cost to you

### Missing Items
If your order is incomplete:
- Verify all boxes received (check tracking)
- Check packing slip
- Contact us within 48 hours
- We'll ship missing items immediately
- Expedited at no charge

## Special Delivery Options

### Hold at Location
Available for most carriers:
- Hold at FedEx or UPS facility
- Pick up at your convenience
- Specify at checkout or contact carrier
- Requires ID for pickup

### Signature Required
- Automatically applied for orders $500+
- Can be added to any order
- Ensures secure delivery
- Someone must be present

### Saturday Delivery
- Available for express shipments
- Additional fee applies
- Must specify at checkout
- Not available in all areas

## Order Changes

### Before Shipment
Contact us ASAP if you need to:
- Change shipping address
- Upgrade shipping speed
- Add items to order
- Cancel order

**Note:** Orders ship quickly! Changes may not be possible after 24 hours.

### After Shipment
Once shipped:
- Contact carrier to hold or reroute (fees may apply)
- Address changes difficult after shipment
- Carrier charges apply to rerouting

## Contact Shipping Support

**Questions about your order?**

**Email:** shipping@rrg-solutions.com  
**Phone:** (555) 123-SHIP
**Live Chat:** Available 8 AM - 6 PM EST

**Include:**
- Order number
- Tracking number (if applicable)
- Description of issue
- Photos (if damage or wrong item)

---

We want your delivery experience to be smooth and hassle-free. Don't hesitate to reach out with any shipping questions or concerns!`,
      excerpt: "Complete guide to shipping timelines, delivery methods, tracking, and what to do if you experience delivery issues.",
      displayOrder: 6,
      isPublished: true,
      isFeatured: false,
      metaDescription: "Everything about EnerGenius shipping and delivery including timelines, tracking, and handling delivery issues.",
      keywords: ["shipping", "delivery", "tracking", "freight", "timeline"],
      viewCount: 0,
      helpfulCount: 0,
      notHelpfulCount: 0,
      authorName: "EnerGenius Support Team",
      publishedAt: new Date()
    }
  ];

  for (const article of kbArticles) {
    await prisma.knowledgeBaseArticle.upsert({
      where: { slug: article.slug },
      update: article,
      create: article
    });
  }

  console.log(`   ✅ Created/updated ${kbArticles.length} knowledge base articles`);
  console.log('\n✅ Phase 3 seeding complete!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
