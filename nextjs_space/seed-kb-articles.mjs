import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('\n🔖 Seeding knowledge base articles...');
  
  const kbArticles = [
    {
      title: "Getting Started with Your Solar Generator",
      slug: "getting-started-with-your-solar-generator",
      category: "getting_started",
      content: `# Welcome to Your New Solar Generator!\n\nCongratulations on your purchase!`,
      excerpt: "Everything you need to know to get started with your new solar generator.",
      displayOrder: 1,
      isPublished: true,
      isFeatured: true,
      metaDescription: "Complete getting started guide for your EnerGenius solar generator.",
      keywords: ["getting started", "solar generator", "setup"],
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
      content: `# Smart Connect Dashboard Guide\n\nYour Smart Connect dashboard provides monitoring.`,
      excerpt: "Learn how to access and navigate your Smart Connect dashboard.",
      displayOrder: 2,
      isPublished: true,
      isFeatured: true,
      metaDescription: "Step-by-step guide to accessing your Smart Connect dashboard.",
      keywords: ["smart connect", "dashboard", "monitoring"],
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
    console.log(`   ✅ Created/updated: ${article.title}`);
  }

  console.log(`\n✅ Successfully seeded ${count} KB articles!`);
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
