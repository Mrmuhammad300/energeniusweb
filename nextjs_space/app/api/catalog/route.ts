import { NextResponse } from 'next/server';
import { PRODUCT_SCHEMA } from '@/lib/product-schema';

export const dynamic = 'force-dynamic';

/**
 * GET /api/catalog
 *
 * Returns the full product catalog from the canonical schema.
 * Supports optional query params:
 *   ?brand=PowerX        — filter by brand
 *   ?category=portable_power — filter by category
 *   ?min_watts=5000      — minimum continuous watts
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const brand = searchParams.get('brand');
    const category = searchParams.get('category');
    const minWatts = searchParams.get('min_watts');

    let products = PRODUCT_SCHEMA.catalog.products;

    if (brand) {
      products = products.filter(
        (p) => p.brand.toLowerCase() === brand.toLowerCase(),
      );
    }

    if (category) {
      products = products.filter((p) => p.category === category);
    }

    if (minWatts) {
      const min = parseInt(minWatts, 10);
      if (!isNaN(min)) {
        products = products.filter(
          (p) => (p.power?.continuous_w ?? 0) >= min,
        );
      }
    }

    return NextResponse.json({
      schema_version: PRODUCT_SCHEMA.schema_version,
      currency: PRODUCT_SCHEMA.currency,
      products,
      installation_packages: PRODUCT_SCHEMA.installation_packages,
      professional_services: PRODUCT_SCHEMA.professional_services,
    });
  } catch (error) {
    console.error('Catalog fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch catalog' },
      { status: 500 },
    );
  }
}
