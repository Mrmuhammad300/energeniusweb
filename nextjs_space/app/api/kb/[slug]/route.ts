import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const article = await prisma.knowledgeBaseArticle.findUnique({
      where: {
        slug: params.slug,
        isPublished: true,
      },
    });

    if (!article) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      );
    }

    // Increment view count
    await prisma.knowledgeBaseArticle.update({
      where: { id: article.id },
      data: { viewCount: { increment: 1 } },
    });

    // Fetch related articles if any
    let relatedArticles: any[] = [];
    if (article.relatedArticles && article.relatedArticles.length > 0) {
      relatedArticles = await prisma.knowledgeBaseArticle.findMany({
        where: {
          id: { in: article.relatedArticles },
          isPublished: true,
        },
        select: {
          id: true,
          title: true,
          slug: true,
          excerpt: true,
          category: true,
        },
      });
    }

    return NextResponse.json({
      article,
      relatedArticles,
    });
  } catch (error) {
    console.error('Error fetching article:', error);
    return NextResponse.json(
      { error: 'Failed to fetch article' },
      { status: 500 }
    );
  }
}

// Feedback endpoints
export async function POST(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const body = await request.json();
    const { action } = body; // 'helpful' or 'not_helpful'

    const article = await prisma.knowledgeBaseArticle.findUnique({
      where: { slug: params.slug },
    });

    if (!article) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      );
    }

    if (action === 'helpful') {
      await prisma.knowledgeBaseArticle.update({
        where: { id: article.id },
        data: { helpfulCount: { increment: 1 } },
      });
    } else if (action === 'not_helpful') {
      await prisma.knowledgeBaseArticle.update({
        where: { id: article.id },
        data: { notHelpfulCount: { increment: 1 } },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating article feedback:', error);
    return NextResponse.json(
      { error: 'Failed to update feedback' },
      { status: 500 }
    );
  }
}
