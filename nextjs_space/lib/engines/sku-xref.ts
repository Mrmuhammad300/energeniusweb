// ── SKU Cross-Reference Mapping Engine ────────────────────────────────────────
// Connect EnerGenius SKUs to vendor SKUs. Capacity-first, then other methods.

import type {
  CatalogProduct,
  VendorProduct,
  XrefMatch,
  XrefMappingOutput,
  XrefMatchMethod,
} from './types';
import { CATALOG_PRODUCTS } from './catalog';

// ─── Thresholds from schema ───────────────────────────────────────────────────

const CONTINUOUS_W_PCT_THRESHOLD = 0.02;
const KWH_THRESHOLD_PCT = 0.05;
const NUMERIC_REGEX = /(\d{3,5})\s*(w|kw|k)/i;

// ─── Match priority order ─────────────────────────────────────────────────────

interface MatchAttempt {
  method: XrefMatchMethod;
  fn: (vendor: VendorProduct, catalog: CatalogProduct) => number | null; // returns confidence or null
}

const MATCH_ATTEMPTS: MatchAttempt[] = [
  {
    method: 'continuous_w_within_pct',
    fn: (v, c) => {
      if (v.continuous_w == null || v.continuous_w === 0) return null;
      const diff = Math.abs(v.continuous_w - c.power.continuous_w) / c.power.continuous_w;
      return diff <= CONTINUOUS_W_PCT_THRESHOLD ? 0.95 : null;
    },
  },
  {
    method: 'continuous_w_exact',
    fn: (v, c) => {
      if (v.continuous_w == null) return null;
      return v.continuous_w === c.power.continuous_w ? 0.95 : null;
    },
  },
  {
    method: 'kwh_if_available',
    fn: (v, c) => {
      if (v.kwh == null || c.power.kwh == null) return null;
      const diff = Math.abs(v.kwh - c.power.kwh) / c.power.kwh;
      return diff <= KWH_THRESHOLD_PCT ? 0.90 : null;
    },
  },
  {
    method: 'ah_plus_voltage_to_kwh',
    fn: (v, c) => {
      if (v.capacity_ah == null || v.nominal_v == null) return null;
      if (c.battery?.capacity_ah == null || c.battery?.nominal_v == null) return null;
      const vendorKwh = (v.capacity_ah * v.nominal_v) / 1000;
      const catalogKwh = (c.battery.capacity_ah * c.battery.nominal_v) / 1000;
      if (catalogKwh === 0) return null;
      const diff = Math.abs(vendorKwh - catalogKwh) / catalogKwh;
      return diff <= KWH_THRESHOLD_PCT ? 0.85 : null;
    },
  },
  {
    method: 'name_token_numeric_match',
    fn: (v, c) => {
      const vendorMatch = v.vendor_name.match(NUMERIC_REGEX);
      const catalogMatch = c.display_name.match(NUMERIC_REGEX);
      if (!vendorMatch || !catalogMatch) return null;
      const vendorNum = parseNumericToken(vendorMatch);
      const catalogNum = parseNumericToken(catalogMatch);
      if (vendorNum === 0 || catalogNum === 0) return null;
      return vendorNum === catalogNum ? 0.70 : null;
    },
  },
];

function parseNumericToken(match: RegExpMatchArray): number {
  const raw = parseInt(match[1], 10);
  const unit = match[2].toLowerCase();
  if (unit === 'kw' || unit === 'k') return raw * 1000;
  return raw; // watts
}

// ─── Public API ───────────────────────────────────────────────────────────────

export interface XrefInput {
  vendor_products: VendorProduct[];
  manual_overrides?: Array<{ vendor_sku: string; canonical_sku: string }>;
}

export function mapVendorSkus(input: XrefInput): XrefMappingOutput {
  const { vendor_products, manual_overrides = [] } = input;
  const matches: XrefMatch[] = [];
  const unmatched: string[] = [];
  const warnings: string[] = [];

  // Index manual overrides
  const overrideMap = new Map<string, string>();
  for (const o of manual_overrides) overrideMap.set(o.vendor_sku, o.canonical_sku);

  for (const vendor of vendor_products) {
    // Check manual override first
    const overrideSku = overrideMap.get(vendor.vendor_sku);
    if (overrideSku) {
      matches.push({
        canonical_sku: overrideSku,
        vendor_sku: vendor.vendor_sku,
        match_method: 'manual_override',
        confidence: 1.0,
        details: `Manual override: ${vendor.vendor_sku} → ${overrideSku}`,
      });
      continue;
    }

    // Try each method in priority order
    let matched = false;
    for (const attempt of MATCH_ATTEMPTS) {
      let bestMatch: { product: CatalogProduct; confidence: number } | null = null;

      for (const catalogProduct of CATALOG_PRODUCTS) {
        const confidence = attempt.fn(vendor, catalogProduct);
        if (confidence != null && (bestMatch == null || confidence > bestMatch.confidence)) {
          bestMatch = { product: catalogProduct, confidence };
        }
      }

      if (bestMatch) {
        matches.push({
          canonical_sku: bestMatch.product.canonical_sku,
          vendor_sku: vendor.vendor_sku,
          match_method: attempt.method,
          confidence: bestMatch.confidence,
          details: `Matched via ${attempt.method}: ${vendor.vendor_sku} → ${bestMatch.product.canonical_sku} (${bestMatch.product.display_name})`,
        });
        matched = true;
        break;
      }
    }

    if (!matched) {
      unmatched.push(vendor.vendor_sku);
    }
  }

  // Note about exclusives
  const exclusives = CATALOG_PRODUCTS.filter((p) => p.flags.exclusive_to_rrg_energenius);
  if (exclusives.length > 0) {
    const skuList = exclusives.map((p) => p.canonical_sku).join(', ');
    warnings.push(
      `Exclusive products (${skuList}) do not require vendor xrefs; xrefs may be empty.`
    );
  }

  return { matches, unmatched_vendor_skus: unmatched, warnings };
}
