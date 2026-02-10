/**
 * Pricing Engine
 *
 * Computes quote totals, ITC (Investment Tax Credit) savings,
 * commission amounts, and enforces business guardrails.
 */

import { PRODUCT_SCHEMA } from './catalog';
import type {
  QuoteLineItem,
  QuoteTotals,
  QuoteApproval,
  ApprovalStatus,
  CommissionRule,
  CatalogProduct,
} from './types';

// ---------------------------------------------------------------------------
// Lookup helpers
// ---------------------------------------------------------------------------

export function findProductBySku(sku: string): CatalogProduct | undefined {
  return PRODUCT_SCHEMA.catalog.products.find((p) => p.canonical_sku === sku);
}

export function findInstallationPackageBySku(sku: string) {
  return PRODUCT_SCHEMA.installation_packages.find((p) => p.canonical_sku === sku);
}

export function findProfessionalServiceBySku(sku: string) {
  return PRODUCT_SCHEMA.professional_services.find((s) => s.canonical_sku === sku);
}

// ---------------------------------------------------------------------------
// Quote Totals
// ---------------------------------------------------------------------------

export function computeQuoteTotals(lineItems: QuoteLineItem[]): QuoteTotals {
  let hardware_total = 0;
  let installation_total = 0;
  let services_total = 0;

  for (const item of lineItems) {
    const lineTotal = item.total_price;
    switch (item.type) {
      case 'generator_hardware':
        hardware_total += lineTotal;
        break;
      case 'installation_package':
        installation_total += lineTotal;
        break;
      case 'professional_service':
        services_total += lineTotal;
        break;
    }
  }

  const subtotal = hardware_total + installation_total + services_total;

  // ITC applies only to eligible types
  const { itc } = PRODUCT_SCHEMA.pricing_engine;
  let itc_eligible_amount = 0;
  if (itc.enabled) {
    for (const item of lineItems) {
      if (itc.eligible_types.includes(item.type)) {
        itc_eligible_amount += item.total_price;
      }
    }
  }

  const itc_savings = itc.enabled ? itc_eligible_amount * itc.pct : 0;
  const net_after_itc = subtotal - itc_savings;

  return {
    hardware_total,
    installation_total,
    services_total,
    subtotal,
    itc_eligible_amount,
    itc_savings,
    net_after_itc,
  };
}

// ---------------------------------------------------------------------------
// Commission Calculation
// ---------------------------------------------------------------------------

/**
 * Returns the applicable commission rule for a line item.
 * Higher-priority rules override lower ones when conditions are met.
 */
export function resolveCommissionRule(
  unitPrice: number,
  productType: string,
): CommissionRule | null {
  const applicable = PRODUCT_SCHEMA.commission_rules
    .filter((r) => r.applies_to === productType)
    .sort((a, b) => b.priority - a.priority); // highest priority first

  for (const rule of applicable) {
    if (!rule.condition) {
      // Lowest-priority fallback — keep searching for a better match.
      continue;
    }
    if (rule.condition.unit_price_gt && unitPrice > rule.condition.unit_price_gt) {
      return rule;
    }
  }

  // Fall back to the first rule with no condition (the default).
  return applicable.find((r) => !r.condition) ?? null;
}

export function computeCommission(lineItems: QuoteLineItem[]): number {
  let total = 0;
  for (const item of lineItems) {
    const rule = resolveCommissionRule(item.unit_price, item.type);
    if (rule) {
      total += item.total_price * rule.commission_pct;
    }
  }
  return Math.round(total * 100) / 100;
}

// ---------------------------------------------------------------------------
// Guardrails & Approval
// ---------------------------------------------------------------------------

export function evaluateApproval(lineItems: QuoteLineItem[]): QuoteApproval {
  const { guardrails } = PRODUCT_SCHEMA;
  const reasons: string[] = [];
  let status: ApprovalStatus = 'auto_approved';

  // Check hardware discount thresholds
  for (const item of lineItems) {
    if (item.type === 'generator_hardware' && item.discount_pct) {
      if (item.discount_pct > guardrails.approval_thresholds.hardware_discount_pct) {
        reasons.push(
          `Hardware discount ${(item.discount_pct * 100).toFixed(0)}% on ${item.canonical_sku} exceeds ${(guardrails.approval_thresholds.hardware_discount_pct * 100).toFixed(0)}% threshold`,
        );
        status = 'pending_approval';
      }
    }
    if (item.type === 'installation_package' && item.discount_pct) {
      if (item.discount_pct > guardrails.approval_thresholds.install_discount_pct) {
        reasons.push(
          `Installation discount ${(item.discount_pct * 100).toFixed(0)}% on ${item.canonical_sku} exceeds ${(guardrails.approval_thresholds.install_discount_pct * 100).toFixed(0)}% threshold`,
        );
        status = 'pending_approval';
      }
    }
  }

  // Check turnkey requirement for large systems
  const totalKw = lineItems
    .filter((i) => i.type === 'generator_hardware')
    .reduce((sum, item) => {
      const product = findProductBySku(item.canonical_sku);
      return sum + (product?.power?.continuous_w ?? 0) * item.quantity / 1000;
    }, 0);

  if (totalKw >= guardrails.turnkey_required_kw_gte) {
    const hasTurnkey = lineItems.some((i) => i.canonical_sku === 'INST-TURNKEY');
    if (!hasTurnkey && guardrails.waiver_required_if_install_removed) {
      reasons.push(
        `System is ${totalKw}kW — turnkey installation required (or waiver needed)`,
      );
      status = 'pending_approval';
    }
  }

  return {
    status,
    reasons,
    requires_approval_from: status === 'pending_approval' ? 'sales_manager' : undefined,
  };
}

// ---------------------------------------------------------------------------
// Build a QuoteLineItem from a SKU + quantity
// ---------------------------------------------------------------------------

export function buildLineItem(
  sku: string,
  quantity: number,
  discountPct?: number,
): QuoteLineItem | null {
  // Try generator hardware first
  const product = findProductBySku(sku);
  if (product) {
    const unitPrice = product.pricing.msrp;
    const effectivePrice = discountPct ? unitPrice * (1 - discountPct) : unitPrice;
    return {
      canonical_sku: sku,
      type: 'generator_hardware',
      display_name: product.display_name,
      quantity,
      unit_price: unitPrice,
      discount_pct: discountPct,
      total_price: Math.round(effectivePrice * quantity * 100) / 100,
    };
  }

  // Try installation package
  const pkg = findInstallationPackageBySku(sku);
  if (pkg) {
    const unitPrice = pkg.price;
    const effectivePrice = discountPct ? unitPrice * (1 - discountPct) : unitPrice;
    return {
      canonical_sku: sku,
      type: 'installation_package',
      display_name: pkg.display_name ?? sku,
      quantity,
      unit_price: unitPrice,
      discount_pct: discountPct,
      total_price: Math.round(effectivePrice * quantity * 100) / 100,
    };
  }

  // Try professional service
  const svc = findProfessionalServiceBySku(sku);
  if (svc) {
    const unitPrice = svc.default;
    return {
      canonical_sku: sku,
      type: 'professional_service',
      display_name: svc.display_name ?? sku,
      quantity,
      unit_price: unitPrice,
      total_price: Math.round(unitPrice * quantity * 100) / 100,
    };
  }

  return null;
}
