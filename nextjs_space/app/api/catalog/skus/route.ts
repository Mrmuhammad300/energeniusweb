import { NextRequest, NextResponse } from 'next/server';
import {
  CATALOG_PRODUCTS,
  INSTALLATION_PACKAGES,
  PROFESSIONAL_SERVICES,
} from '@/lib/engines/catalog';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const params = request.nextUrl.searchParams;

    const brand = params.get('brand');
    const minContinuousW = params.get('min_continuous_w');
    const maxContinuousW = params.get('max_continuous_w');
    const category = params.get('category');
    const exclusiveOnly = params.get('exclusive_only');
    const includePackages = params.get('include_packages') === 'true';
    const includeServices = params.get('include_services') === 'true';

    let products = [...CATALOG_PRODUCTS];

    // Apply filters
    if (brand) {
      products = products.filter(
        (p) => p.brand.toLowerCase() === brand.toLowerCase()
      );
    }

    if (minContinuousW) {
      const min = parseInt(minContinuousW, 10);
      if (!isNaN(min)) {
        products = products.filter((p) => p.power.continuous_w >= min);
      }
    }

    if (maxContinuousW) {
      const max = parseInt(maxContinuousW, 10);
      if (!isNaN(max)) {
        products = products.filter((p) => p.power.continuous_w <= max);
      }
    }

    if (category) {
      products = products.filter((p) => p.category === category);
    }

    if (exclusiveOnly === 'true') {
      products = products.filter((p) => p.flags.exclusive_to_rrg_energenius);
    }

    // Sort by continuous_w ascending
    products.sort((a, b) => a.power.continuous_w - b.power.continuous_w);

    const response: Record<string, unknown> = { products };

    if (includePackages) {
      response.installation_packages = INSTALLATION_PACKAGES;
    }

    if (includeServices) {
      response.professional_services = PROFESSIONAL_SERVICES;
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error('[catalog/skus] Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch catalog SKUs' },
      { status: 500 }
    );
  }
}
