"use client";

import Link from "next/link";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageSquare, BookOpen, Mail, Phone, Search, ExternalLink, FileText } from "lucide-react";

export default function SupportPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const quickLinks = [
    {
      title: "Black Start Explainer",
      description: "1-page PDF on Black Start technology",
      icon: FileText,
      href: "/EnerGenius_Black_Start_Explainer.pdf",
      color: "amber",
      isDownload: true
    },
    {
      title: "Knowledge Base",
      description: "Browse articles and guides",
      icon: BookOpen,
      href: "/support/kb",
      color: "emerald"
    },
    {
      title: "Submit a Ticket",
      description: "Get help from our team",
      icon: Mail,
      href: "/support/tickets/new",
      color: "blue"
    },
    {
      title: "Check Ticket Status",
      description: "Track your support request",
      icon: MessageSquare,
      href: "/support/tickets",
      color: "purple"
    },
    {
      title: "Live Chat",
      description: "Chat with support now",
      icon: MessageSquare,
      href: "#",
      color: "sky",
      onClick: () => {
        // @ts-ignore
        if (window.Tawk_API) {
          // @ts-ignore
          window.Tawk_API.maximize();
        }
      }
    }
  ];

  const popularArticles = [
    { title: "Getting Started with Your Solar Generator", slug: "getting-started", category: "Getting Started" },
    { title: "How to Size Your Solar System", slug: "sizing-guide", category: "Products" },
    { title: "Installation Guidelines", slug: "installation-guidelines", category: "Installation" },
    { title: "Maintenance Best Practices", slug: "maintenance-guide", category: "Maintenance" },
    { title: "Warranty Information", slug: "warranty-info", category: "General" },
    { title: "Shipping & Delivery", slug: "shipping-delivery", category: "Shipping" }
  ];

  const contactMethods = [
    {
      method: "Email Support",
      value: "support@rrg-solutions.com",
      icon: Mail,
      description: "Response within 24 hours",
      href: "mailto:support@rrg-solutions.com"
    },
    {
      method: "Phone Support",
      value: "(888) 555-0123",
      icon: Phone,
      description: "Mon-Fri 9AM-6PM EST",
      href: "tel:+18885550123"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-emerald-600 to-sky-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">How Can We Help You?</h1>
            <p className="text-xl text-emerald-50 mb-8">Find answers, submit tickets, or chat with our support team</p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search for help articles, FAQs, guides..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-4 py-6 text-lg bg-white text-gray-900 border-none"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && searchQuery) {
                      window.location.href = `/support/kb?search=${encodeURIComponent(searchQuery)}`;
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
          {quickLinks.map((link, index) => (
            <Card
              key={index}
              className={`hover:shadow-lg transition-shadow cursor-pointer border-t-4 ${
                link.color === 'amber' ? 'border-t-amber-500' :
                link.color === 'emerald' ? 'border-t-emerald-500' :
                link.color === 'blue' ? 'border-t-blue-500' :
                link.color === 'purple' ? 'border-t-purple-500' :
                'border-t-sky-500'
              }`}
              onClick={() => {
                if (link.onClick) {
                  link.onClick();
                } else if ((link as any).isDownload) {
                  window.open(link.href, '_blank');
                } else {
                  window.location.href = link.href;
                }
              }}
            >
              <CardHeader>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${
                  link.color === 'amber' ? 'bg-amber-100' :
                  link.color === 'emerald' ? 'bg-emerald-100' :
                  link.color === 'blue' ? 'bg-blue-100' :
                  link.color === 'purple' ? 'bg-purple-100' :
                  'bg-sky-100'
                }`}>
                  <link.icon className={`h-6 w-6 ${
                    link.color === 'amber' ? 'text-amber-600' :
                    link.color === 'emerald' ? 'text-emerald-600' :
                    link.color === 'blue' ? 'text-blue-600' :
                    link.color === 'purple' ? 'text-purple-600' :
                    'text-sky-600'
                  }`} />
                </div>
                <CardTitle className="text-lg">{link.title}</CardTitle>
                <CardDescription>{link.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>

        {/* Popular Articles */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-2xl">Popular Help Articles</CardTitle>
            <CardDescription>Quick answers to common questions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {popularArticles.map((article, index) => (
                <Link
                  key={index}
                  href={`/support/kb/${article.slug}`}
                  className="flex items-center justify-between p-4 rounded-lg border hover:border-emerald-500 hover:bg-emerald-50 transition-colors group"
                >
                  <div>
                    <p className="font-medium text-gray-900 group-hover:text-emerald-600">{article.title}</p>
                    <p className="text-sm text-gray-500">{article.category}</p>
                  </div>
                  <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-emerald-600" />
                </Link>
              ))}
            </div>
            <div className="mt-6 text-center">
              <Link href="/support/kb">
                <Button variant="outline">Browse All Articles</Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Contact Methods */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {contactMethods.map((contact, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
                    <contact.icon className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{contact.method}</CardTitle>
                    <CardDescription>{contact.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <a
                  href={contact.href}
                  className="text-xl font-semibold text-emerald-600 hover:text-emerald-700"
                >
                  {contact.value}
                </a>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}