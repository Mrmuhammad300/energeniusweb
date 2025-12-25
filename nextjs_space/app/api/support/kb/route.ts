import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

// Get knowledge base articles
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const category = searchParams.get('category');
    const slug = searchParams.get('slug');

    if (slug) {
      // Get specific article by slug
      const article = await prisma.knowledgeBaseArticle.findUnique({
        where: { slug }
      });

      if (!article) {
        return NextResponse.json(
          { error: 'Article not found' },
          { status: 404 }
        );
      }

      // Increment view count
      await prisma.knowledgeBaseArticle.update({
        where: { slug },
        data: { viewCount: article.viewCount + 1 }
      });

      return NextResponse.json({ article });
    }

    // Build query
    const where: any = {
      isPublished: true
    };

    if (category) {
      where.category = category;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
        { excerpt: { contains: search, mode: 'insensitive' } }
      ];
    }

    // Get articles
    const articles = await prisma.knowledgeBaseArticle.findMany({
      where,
      orderBy: [
        { isFeatured: 'desc' },
        { displayOrder: 'asc' },
        { viewCount: 'desc' }
      ],
      take: 100
    });

    return NextResponse.json({ articles });
  } catch (error) {
    console.error('Error fetching KB articles:', error);
    return NextResponse.json(
      { error: 'Failed to fetch articles' },
      { status: 500 }
    );
  }
}

// Create new knowledge base article (admin only)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      title,
      slug,
      category,
      content,
      excerpt,
      metaDescription,
      keywords,
      isPublished,
      isFeatured,
      displayOrder,
      authorName
    } = body;

    // Validation
    if (!title || !slug || !content) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const existing = await prisma.knowledgeBaseArticle.findUnique({
      where: { slug }
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Article with this slug already exists' },
        { status: 400 }
      );
    }

    // Create article
    const article = await prisma.knowledgeBaseArticle.create({
      data: {
        title,
        slug,
        category: category || 'general',
        content,
        excerpt,
        metaDescription,
        keywords: keywords || [],
        isPublished: isPublished !== undefined ? isPublished : true,
        isFeatured: isFeatured || false,
        displayOrder: displayOrder || 0,
        authorName,
        publishedAt: isPublished ? new Date() : null
      }
    });

    return NextResponse.json({
      success: true,
      article,
      message: 'Article created successfully'
    });
  } catch (error) {
    console.error('Error creating KB article:', error);
    return NextResponse.json(
      { error: 'Failed to create article' },
      { status: 500 }
    );
  }
}