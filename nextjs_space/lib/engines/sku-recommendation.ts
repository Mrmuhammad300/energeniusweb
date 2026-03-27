// ── SKU Recommendation Engine ─────────────────────────────────────────────────
// Turn assessment watts into recommended SKUs using capacity-first matching.

import type {
  CatalogProduct,
  CustomerType,
  ProductCategory,
  SkuRecommendationInput,
  SkuRecommendationOutput,
  RecommendedSku,
} from './types';
import { CATALOG_PRODUCTS } from './catalog';

// ─── Defaults ─────────────────────────────────────────────────────────────────

const DEFAULT_OVERAGE_BUFFER_PCT = 0.10;
const DEFAULT_PREFERRED_BRANDS = ['EnerGenius', 'PowerX'];
const DEFAULT_CUSTOMER_TYPE: CustomerType = 'commercial';

// ─── Category filters ─────────────────────────────────────────────────────────

const ALLOWED_CATEGORIES: Record<CustomerType, ProductCategory[]> = {
  residential: ['residential_power', 'portable_power'],
  commercial: ['commercial_power', 'commercial_power_system', 'portable_power'],
};

// ─── Engine ───────────────────────────────────────────────────────────────────

export function recommendSkus(input: SkuRecommendationInput): SkuRecommendationOutput {
  const {
    estimated_watts,
    customer_type = DEFAULT_CUSTOMER_TYPE,
    overage_buffer_pct = DEFAULT_OVERAGE_BUFFER_PCT,
    preferred_brands = DEFAULT_PREFERRED_BRANDS,
    exclude_brands = [],
    exclusive_only = false,
    min_kw,
  } = input;

  const warnings: string[] = [];
  const effectiveRequiredWatts = estimated_watts * (1 + overage_buffer_pct);
  const minWatts = min_kw ? min_kw * 1000 : 0;
  const requiredWatts = Math.max(effectiveRequiredWatts, minWatts);

  // 1. Filter candidates
  const allowedCats = ALLOWED_CATEGORIES[customer_type] ?? ALLOWED_CATEGORIES.commercial;
  const excludeSet = new Set(exclude_brands.map((b) => b.toLowerCase()));

  let candidates = CATALOG_PRODUCTS.filter((p) => {
    if (!allowedCats.includes(p.category)) return false;
    if (excludeSet.has(p.brand.toLowerCase())) return false;
    if (exclusive_only && !p.flags.exclusive_to_rrg_energenius) return false;
    return true;
  });

  if (candidates.length === 0) {
    warnings.push('No products available after applying filters.');
    return { recommended: [], warnings };
  }

  // 2. Sort by continuous_w ascending for capacity-first matching
  candidates = candidates.slice().sort((a, b) => a.power.continuous_w - b.power.continuous_w);

  // 3. Primary rule: smallest product >= requiredWatts
  let matches = candidates.filter((p) => p.power.continuous_w >= requiredWatts);

  // 4. Fallback: if no product meets requirement, return largest + warn
  if (matches.length === 0) {
    const largest = candidates[candidates.length - 1];
    warnings.push(
      `warn_capacity_shortfall: No product meets ${Math.round(requiredWatts)}W requirement. ` +
        `Largest available is ${largest.display_name} at ${largest.power.continuous_w}W.`
    );
    matches = [largest];
  }

  // 5. Apply tie-breaker logic and build recommendations
  const recommended = applyTieBreakers(matches, preferred_brands, requiredWatts);

  return { recommended, warnings };
}

// ─── Tie-breaker helpers ──────────────────────────────────────────────────────

function applyTieBreakers(
  candidates: CatalogProduct[],
  preferredBrands: string[],
  requiredWatts: number,
): RecommendedSku[] {
  // Score each candidate; lower = better
  const scored = candidates.map((p) => ({
    product: p,
    score: tieBreakScore(p, preferredBrands),
  }));

  scored.sort((a, b) => {
    // Primary: continuous_w ascending (smallest adequate first)
    const wDiff = a.product.power.continuous_w - b.product.power.continuous_w;
    if (wDiff !== 0) return wDiff;
    // Secondary: tie-break score descending (higher = better brand preference etc.)
    return b.score - a.score;
  });

  // Return top 3
  return scored.slice(0, 3).map(({ product }, idx) => {
    const isExact = product.power.continuous_w >= requiredWatts;
    const confidence = isExact ? Math.max(0.98 - idx * 0.04, 0.80) : 0.60;
    return {
      canonical_sku: product.canonical_sku,
      display_name: product.display_name,
      continuous_w: product.power.continuous_w,
      peak_w: product.power.peak_w ?? 0,
      msrp: product.pricing.msrp,
      confidence: parseFloat(confidence.toFixed(2)),
      why: buildWhy(product, requiredWatts),
    };
  });
}

function tieBreakScore(p: CatalogProduct, preferredBrands: string[]): number {
  let score = 0;

  // Prefer EnerGenius over PowerX when continuous_w is within 5%
  const brandIdx = preferredBrands.findIndex(
    (b) => b.toLowerCase() === p.brand.toLowerCase()
  );
  if (brandIdx === 0) score += 3; // first preferred brand
  else if (brandIdx > 0) score += 2;

  // Prefer products with peak_w provided
  if (p.power.peak_w != null && p.power.peak_w > 0) score += 1;

  // Prefer products with known warranty
  if (p.warranty?.years != null && p.warranty.years > 0) score += 1;

  return score;
}

function buildWhy(p: CatalogProduct, requiredWatts: number): string {
  if (p.power.continuous_w >= requiredWatts) {
    return `Smallest continuous_w (${p.power.continuous_w}W) >= required watts (${Math.round(requiredWatts)}W) with buffer.`;
  }
  return `Largest available product (${p.power.continuous_w}W). Required: ${Math.round(requiredWatts)}W.`;
}
