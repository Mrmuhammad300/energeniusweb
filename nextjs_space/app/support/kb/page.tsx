"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, BookOpen, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

interface Article {
  id: string;
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  viewCount: number;
  isFeatured: boolean;
}

function KnowledgeBaseContent() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams?.get('search') || '';
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  const categories = [
    { value: 'all', label: 'All Articles', icon: BookOpen },
    { value: 'getting_started', label: 'Getting Started' },
    { value: 'products', label: 'Products' },
    { value: 'installation', label: 'Installation' },
    { value: 'maintenance', label: 'Maintenance' },
    { value: 'troubleshooting', label: 'Troubleshooting' },
    { value: 'shipping', label: 'Shipping' },
    { value: 'returns', label: 'Returns & Warranty' }
  ];

  useEffect(() => {
    fetchArticles();
  }, [searchQuery, selectedCategory]);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.set('search', searchQuery);
      if (selectedCategory !== 'all') params.set('category', selectedCategory);

      const response = await fetch(`/api/kb?${params.toString()}`);
      const data = await response.json();

      if (response.ok) {
        setArticles(data || []);
      }
    } catch (error) {
      console.error('Failed to fetch articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const featuredArticles = articles.filter(a => a.isFeatured);
  const regularArticles = articles.filter(a => !a.isFeatured);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/support" className="text-emerald-600 hover:text-emerald-700 text-sm font-medium mb-4 inline-block">
            ← Back to Support
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Knowledge Base</h1>
          <p className="text-gray-600">Find answers and learn about your solar generators</p>
        </div>

        {/* Search */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 py-6 text-lg"
              />
            </div>
          </CardContent>
        </Card>

        {/* Categories */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Browse by Category</h2>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <Button
                key={cat.value}
                variant={selectedCategory === cat.value ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(cat.value)}
                className="rounded-full"
              >
                {cat.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Featured Articles */}
        {featuredArticles.length > 0 && !searchQuery && (
          <div className="mb-12">
            <div className="flex items-center space-x-2 mb-4">
              <Sparkles className="h-5 w-5 text-yellow-500" />
              <h2 className="text-2xl font-bold text-gray-900">Featured Articles</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {featuredArticles.map((article) => (
                <Link key={article.id} href={`/support/kb/${article.slug}`}>
                  <Card className="hover:shadow-lg transition-shadow h-full border-2 border-emerald-200">
                    <CardHeader>
                      <div className="flex items-start justify-between mb-2">
                        <Badge variant="secondary">{article.category.replace('_', ' ')}</Badge>
                        <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                          <Sparkles className="h-3 w-3 mr-1" />
                          Featured
                        </Badge>
                      </div>
                      <CardTitle className="text-xl group-hover:text-emerald-600">{article.title}</CardTitle>
                      <CardDescription className="line-clamp-2">{article.excerpt}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>{article.viewCount} views</span>
                        <span className="text-emerald-600 font-medium flex items-center">
                          Read more <ArrowRight className="h-4 w-4 ml-1" />
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* All Articles */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                  <div className="h-6 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                </CardHeader>
              </Card>
            ))}
          </div>
        ) : regularArticles.length > 0 ? (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {searchQuery ? 'Search Results' : 'All Articles'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regularArticles.map((article) => (
                <Link key={article.id} href={`/support/kb/${article.slug}`}>
                  <Card className="hover:shadow-lg transition-shadow h-full hover:border-emerald-300">
                    <CardHeader>
                      <Badge variant="outline" className="w-fit mb-2">
                        {article.category.replace('_', ' ')}
                      </Badge>
                      <CardTitle className="text-lg hover:text-emerald-600">{article.title}</CardTitle>
                      <CardDescription className="line-clamp-3">{article.excerpt}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>{article.viewCount} views</span>
                        <span className="text-emerald-600 font-medium flex items-center">
                          Read <ArrowRight className="h-4 w-4 ml-1" />
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No articles found</h3>
              <p className="text-gray-600 mb-6">
                {searchQuery 
                  ? `No articles match your search for "${searchQuery}"`
                  : 'No articles available in this category'}
              </p>
              {searchQuery && (
                <Button onClick={() => setSearchQuery('')}>Clear Search</Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
export default function KnowledgeBasePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12"><div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div className="animate-pulse space-y-4"><div className="h-8 bg-gray-200 rounded w-1/3"></div><div className="h-64 bg-gray-200 rounded"></div></div></div></div>}>
      <KnowledgeBaseContent />
    </Suspense>
  );
}
