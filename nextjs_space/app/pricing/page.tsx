'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Check, X, Star, ArrowRight, Phone, Calendar } from 'lucide-react';

interface ServicePackage {
  id: string;
  name: string;
  slug: string;
  category: string;
  packageType: string;
  price: number;
  priceMonthly: number | null;
  tagline: string | null;
  description: string;
  isPopular: boolean;
  deliverables: string[];
  exclusions: string[];
  prerequisites: string[];
  bestFor: string | null;
  estimatedTimeline: string | null;
  warrantyInfo: string | null;
}

export default function PricingPage() {
  const [packages, setPackages] = useState<ServicePackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('residential');

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await fetch('/api/services');
        const data = await response.json();
        setPackages(data);
      } catch (error) {
        console.error('Error fetching packages:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  const residentialPackages = packages.filter(pkg => pkg.category === 'residential');
  const commercialPackages = packages.filter(pkg => pkg.category === 'commercial');

  const formatPrice = (price: number, monthly?: number | null) => {
    if (monthly) {
      return (
        <div className="space-y-1">
          <div className="text-4xl font-bold text-emerald-600">${price.toLocaleString()}</div>
          <div className="text-lg text-gray-600">+ ${monthly}/month</div>
        </div>
      );
    }
    return <div className="text-4xl font-bold text-emerald-600">${price.toLocaleString()}</div>;
  };

  const PackageCard = ({ pkg }: { pkg: ServicePackage }) => (
    <Card className={`relative h-full flex flex-col ${
      pkg.isPopular ? 'border-2 border-emerald-500 shadow-xl' : 'border border-gray-200'
    }`}>
      {pkg.isPopular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <Badge className="bg-emerald-600 text-white px-4 py-1 flex items-center gap-1">
            <Star className="h-3 w-3 fill-current" />
            Most Popular
          </Badge>
        </div>
      )}
      
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl mb-2">{pkg.name}</CardTitle>
        {pkg.tagline && (
          <CardDescription className="text-sm font-medium text-emerald-700">
            {pkg.tagline}
          </CardDescription>
        )}
        <div className="mt-4">
          {formatPrice(pkg.price, pkg.priceMonthly)}
        </div>
        {pkg.bestFor && (
          <div className="mt-3 text-sm text-gray-600">
            <strong>Best For:</strong> {pkg.bestFor}
          </div>
        )}
      </CardHeader>

      <CardContent className="flex-grow space-y-6">
        <p className="text-gray-700 leading-relaxed">{pkg.description}</p>

        {pkg.estimatedTimeline && (
          <div className="flex items-center gap-2 text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
            <Calendar className="h-4 w-4 text-blue-600" />
            <span><strong>Timeline:</strong> {pkg.estimatedTimeline}</span>
          </div>
        )}

        {pkg.deliverables && pkg.deliverables.length > 0 && (
          <div>
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Check className="h-5 w-5 text-emerald-600" />
              What's Included
            </h4>
            <ul className="space-y-2">
              {pkg.deliverables.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                  <Check className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {pkg.exclusions && pkg.exclusions.length > 0 && (
          <div>
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <X className="h-5 w-5 text-red-600" />
              Not Included
            </h4>
            <ul className="space-y-2">
              {pkg.exclusions.slice(0, 3).map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                  <X className="h-4 w-4 text-red-400 mt-0.5 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
              {pkg.exclusions.length > 3 && (
                <li className="text-sm text-gray-500 ml-6">+ {pkg.exclusions.length - 3} more exclusions</li>
              )}
            </ul>
          </div>
        )}

        {pkg.warrantyInfo && (
          <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-100">
            <p className="text-sm text-emerald-900">
              <strong className="text-emerald-700">Warranty:</strong> {pkg.warrantyInfo}
            </p>
          </div>
        )}

        <div className="pt-4 space-y-3">
          <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white" size="lg" asChild>
            <Link href={`/contact?package=${pkg.slug}`}>
              Request This Package
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
          <Button variant="outline" className="w-full" asChild>
            <Link href="/contact" className="flex items-center justify-center gap-2">
              <Phone className="h-4 w-4" />
              Call to Discuss
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center py-20">
            <div className="animate-spin h-12 w-12 border-4 border-emerald-600 border-t-transparent rounded-full mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading pricing...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-emerald-600 to-sky-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Professional Installation & Service Packages
            </h1>
            <p className="text-xl text-emerald-50 mb-8">
              From virtual audits to complete turnkey installations, we offer transparent, 
              fixed-price packages with clear deliverables and no surprises.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/products">
                  View Products First
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="bg-white/10 border-white text-white hover:bg-white/20" asChild>
                <Link href="/quote">
                  Need Custom Quote?
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Tabs defaultValue="residential" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-12">
            <TabsTrigger value="residential" className="text-lg py-3">
              Residential
            </TabsTrigger>
            <TabsTrigger value="commercial" className="text-lg py-3">
              Commercial
            </TabsTrigger>
          </TabsList>

          <TabsContent value="residential" className="space-y-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Residential Solar Generator Packages
              </h2>
              <p className="text-lg text-gray-600">
                From simple site audits to comprehensive installation with lifetime service. 
                Choose the package that fits your needs and budget.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
              {residentialPackages.map((pkg) => (
                <PackageCard key={pkg.id} pkg={pkg} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="commercial" className="space-y-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Commercial & Industrial Packages
              </h2>
              <p className="text-lg text-gray-600">
                Professional-grade installations for businesses that demand reliability. 
                From warranty certification to complete turnkey deployments.
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              {commercialPackages.map((pkg) => (
                <PackageCard key={pkg.id} pkg={pkg} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Trust Section */}
      <div className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Why Choose EnerGenius Installation Services?
            </h2>
            <div className="grid md:grid-cols-3 gap-8 mt-12">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="h-6 w-6 text-emerald-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Fixed Pricing</h3>
                <p className="text-gray-600 text-sm">
                  No surprise charges. Know exactly what you're paying upfront with clear scope definitions.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="h-6 w-6 text-emerald-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Licensed & Insured</h3>
                <p className="text-gray-600 text-sm">
                  All installations performed by certified technicians with full liability coverage.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="h-6 w-6 text-emerald-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Local Support</h3>
                <p className="text-gray-600 text-sm">
                  U.S.-based team ready to help with questions, scheduling, and ongoing support.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-emerald-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Not Sure Which Package Is Right for You?
          </h2>
          <p className="text-xl text-emerald-50 mb-8">
            Our team can help you choose the perfect installation package for your needs and budget.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/contact">
                Contact Our Team
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="bg-white/10 border-white text-white hover:bg-white/20" asChild>
              <Link href="/quote">
                Request Custom Quote
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
