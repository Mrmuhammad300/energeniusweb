/**
 * Power Assessment Calculator
 *
 * Two methods for estimating required wattage:
 *   1. sqft — based on square footage and desired coverage level
 *   2. devices — based on a list of individual device wattages
 *
 * After computing the required watts (+ buffer), the calculator
 * recommends the smallest generator(s) that meet the requirement.
 */

import { PRODUCT_SCHEMA } from './catalog';
import type { AssessmentResult, CatalogProduct, CoverageLevel } from './types';

// ---------------------------------------------------------------------------
// Sqft method
// ---------------------------------------------------------------------------

export function assessBySqft(
  sqft: number,
  coverage: CoverageLevel,
): AssessmentResult {
  const { sqft: sqftConfig } = PRODUCT_SCHEMA.calculator.methods;
  const multiplier = sqftConfig.coverage_multipliers[coverage];
  const rawWatts = sqft * sqftConfig.baseline_w_per_sqft * multiplier;
  return buildResult('sqft', rawWatts);
}

// ---------------------------------------------------------------------------
// Devices method
// ---------------------------------------------------------------------------

export function assessByDevices(deviceWatts: number[]): AssessmentResult {
  const rawWatts = deviceWatts.reduce((sum, w) => sum + w, 0);
  return buildResult('devices', rawWatts);
}

// ---------------------------------------------------------------------------
// Shared recommendation logic
// ---------------------------------------------------------------------------

function buildResult(
  method: 'sqft' | 'devices',
  rawWatts: number,
): AssessmentResult {
  const { buffer_pct } = PRODUCT_SCHEMA.calculator.recommendation_logic;
  const estimatedWatts = Math.ceil(rawWatts * (1 + buffer_pct));

  // Filter to generator_hardware, sort by continuous_w ascending
  const generators = PRODUCT_SCHEMA.catalog.products
    .filter((p) => p.type === 'generator_hardware' && p.power?.continuous_w)
    .sort((a, b) => (a.power!.continuous_w) - (b.power!.continuous_w));

  const recommended = pickSmallestSufficient(generators, estimatedWatts);

  return {
    method,
    estimated_watts: estimatedWatts,
    recommended_skus: recommended.map((p) => p.canonical_sku),
    recommended_products: recommended,
    buffer_applied_pct: buffer_pct,
  };
}

/**
 * Pick the smallest single unit whose continuous_w ≥ required watts.
 * If no single unit is large enough, return the largest available
 * and let the caller know they may need multiple units.
 */
function pickSmallestSufficient(
  generators: CatalogProduct[],
  requiredWatts: number,
): CatalogProduct[] {
  const match = generators.find(
    (g) => (g.power?.continuous_w ?? 0) >= requiredWatts,
  );

  if (match) {
    return [match];
  }

  // No single unit is large enough — return the largest unit available.
  // The consumer should check if estimated_watts > recommended product's continuous_w
  // and offer multi-unit configurations.
  if (generators.length > 0) {
    return [generators[generators.length - 1]];
  }

  return [];
}
