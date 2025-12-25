"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown, Eye, Calendar, BookOpen } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

interface Article {
  id: string;
  title: string;
  slug: string;
  category: string;
  content: string;
  excerpt: string;
  viewCount: number;
  helpfulCount: number;
  notHelpfulCount: number;
  authorName: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function ArticlePage() {
  const params = useParams();
  const slug = params.slug as string;
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [feedbackGiven, setFeedbackGiven] = useState(false);

  useEffect(() => {
    if (slug) {
      fetchArticle();
    }
  }, [slug]);

  const fetchArticle = async () => {
    try {
      const response = await fetch(`/api/kb/${slug}`);
      const data = await response.json();

      if (response.ok) {
        setArticle(data.article);
      } else {
        toast.error('Article not found');
      }
    } catch (error) {
      toast.error('Failed to load article');
    } finally {
      setLoading(false);
    }
  };

  const handleFeedback = async (helpful: boolean) => {
    if (feedbackGiven) {
      toast.info('You\'ve already provided feedback for this article');
      return;
    }

    try {
      const response = await fetch(`/api/kb/${slug}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: helpful ? 'helpful' : 'not_helpful' 
        }),
      });

      if (response.ok) {
        setFeedbackGiven(true);
        toast.success('Thank you for your feedback!');
        
        // Update local counts
        if (article) {
          setArticle({
            ...article,
            helpfulCount: helpful ? article.helpfulCount + 1 : article.helpfulCount,
            notHelpfulCount: !helpful ? article.notHelpfulCount + 1 : article.notHelpfulCount,
          });
        }
      }
    } catch (error) {
      toast.error('Failed to submit feedback');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-12 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card>
            <CardContent className="py-12 text-center">
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Article Not Found</h2>
              <p className="text-gray-600 mb-6">We couldn't find the article you're looking for</p>
              <Link href="/support/kb">
                <Button>Browse All Articles</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/support" className="hover:text-emerald-600">Support</Link>
            <span>/</span>
            <Link href="/support/kb" className="hover:text-emerald-600">Knowledge Base</Link>
            <span>/</span>
            <span className="text-gray-900">{article.title}</span>
          </div>
        </div>

        {/* Article Header */}
        <div className="mb-8">
          <Badge variant="secondary" className="mb-4">
            {article.category.replace('_', ' ')}
          </Badge>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{article.title}</h1>
          
          <div className="flex items-center space-x-6 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <Eye className="h-4 w-4" />
              <span>{article.viewCount} views</span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>Updated {new Date(article.updatedAt).toLocaleDateString()}</span>
            </div>
            {article.authorName && (
              <div>
                By {article.authorName}
              </div>
            )}
          </div>
        </div>

        {/* Article Content */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="prose prose-lg max-w-none">
              {/* Render markdown or formatted content */}
              <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                {article.content}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Feedback Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Was this article helpful?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={() => handleFeedback(true)}
                disabled={feedbackGiven}
                className="flex-1"
              >
                <ThumbsUp className="h-4 w-4 mr-2" />
                Yes ({article.helpfulCount})
              </Button>
              <Button
                variant="outline"
                onClick={() => handleFeedback(false)}
                disabled={feedbackGiven}
                className="flex-1"
              >
                <ThumbsDown className="h-4 w-4 mr-2" />
                No ({article.notHelpfulCount})
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Still Need Help */}
        <Card>
          <CardHeader>
            <CardTitle>Still need help?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-gray-600">Can't find what you're looking for?</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/support/tickets/new" className="flex-1">
                <Button className="w-full">Submit a Ticket</Button>
              </Link>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  // @ts-ignore
                  if (window.Tawk_API) {
                    // @ts-ignore
                    window.Tawk_API.maximize();
                  }
                }}
              >
                Start Live Chat
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}