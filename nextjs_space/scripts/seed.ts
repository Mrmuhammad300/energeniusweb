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
