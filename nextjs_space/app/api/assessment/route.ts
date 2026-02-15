import { NextResponse } from 'next/server';
import { assessBySqft, assessByDevices } from '@/lib/product-schema';
import type { CoverageLevel } from '@/lib/product-schema';

export const dynamic = 'force-dynamic';

/**
 * POST /api/assessment
 *
 * Power assessment calculator.
 *
 * Request body (sqft method):
 *   { "method": "sqft", "sqft": 2500, "coverage": "essential" }
 *
 * Request body (devices method):
 *   { "method": "devices", "device_watts": [150, 60, 1200, 100] }
 *
 * Returns: estimated_watts + recommended_skus + recommended_products
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { method } = body;

    if (method === 'sqft') {
      const sqft = Number(body.sqft);
      const coverage: CoverageLevel = body.coverage ?? 'essential';

      if (!sqft || sqft <= 0) {
        return NextResponse.json(
          { error: 'sqft must be a positive number' },
          { status: 400 },
        );
      }

      const validCoverage: CoverageLevel[] = ['essential', 'partial', 'whole'];
      if (!validCoverage.includes(coverage)) {
        return NextResponse.json(
          { error: `coverage must be one of: ${validCoverage.join(', ')}` },
          { status: 400 },
        );
      }

      const result = assessBySqft(sqft, coverage);
      return NextResponse.json(result);
    }

    if (method === 'devices') {
      const deviceWatts: number[] = body.device_watts;

      if (!Array.isArray(deviceWatts) || deviceWatts.length === 0) {
        return NextResponse.json(
          { error: 'device_watts must be a non-empty array of numbers' },
          { status: 400 },
        );
      }

      if (deviceWatts.some((w) => typeof w !== 'number' || w < 0)) {
        return NextResponse.json(
          { error: 'All device_watts values must be non-negative numbers' },
          { status: 400 },
        );
      }

      const result = assessByDevices(deviceWatts);
      return NextResponse.json(result);
    }

    return NextResponse.json(
      { error: 'method must be "sqft" or "devices"' },
      { status: 400 },
    );
  } catch (error) {
    console.error('Assessment error:', error);
    return NextResponse.json(
      { error: 'Failed to process assessment' },
      { status: 500 },
    );
  }
}
