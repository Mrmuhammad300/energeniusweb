import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
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
    }
  ];

  let count = 0;
  for (const article of kbArticles) {
    await prisma.knowledgeBaseArticle.upsert({
      where: { slug: article.slug },
      update: article,
      create: article
    });
    count++;
    console.log(`   ✅ Created/updated article: ${article.title}`);
  }

  console.log(`\n✅ Successfully seeded ${count} knowledge base articles!`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding KB articles:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
