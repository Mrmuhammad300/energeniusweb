// ── Pricing Engine ────────────────────────────────────────────────────────────
// Compute totals, commissions, ITC view, and enforce discount guardrails.

import type {
  QuoteBuildInput,
  QuoteBuildOutput,
  QuoteTotals,
  CommissionResult,
  ApprovalResult,
  ValidationResult,
  LineItemType,
  InstallPricingBreakdown,
} from './types';
import {
  CATALOG_PRODUCTS,
  COMMISSION_RULES,
  INSTALL_PRICING_DEFAULTS,
  resolveUnitPrice,
} from './catalog';
import { isEnabled } from './feature-flags';

// ─── Helpers (crypto-free UUID for edge runtime compatibility) ─────────────────

function generateQuoteId(): string {
  const hex = () => Math.random().toString(16).slice(2, 10);
  return `${hex()}${hex()}-${hex()}-${hex()}-${hex()}-${hex()}${hex()}${hex()}`;
}

// ─── ITC Configuration ───────────────────────────────────────────────────────

const ITC_DEFAULT_PCT = 0.30;
const ITC_ELIGIBLE_TYPES: LineItemType[] = ['generator_hardware', 'eligible_accessory'];
const ITC_INELIGIBLE_TYPES: LineItemType[] = ['professional_service', 'installation_package'];

// ─── Guardrail thresholds ─────────────────────────────────────────────────────

const HARDWARE_DISCOUNT_APPROVAL_THRESHOLD = 0.10;
const INSTALL_DISCOUNT_APPROVAL_THRESHOLD = 0.20;
const TURNKEY_DEFAULT_CAPACITY_KW_GTE = 10;
const MINIMUM_INSTALL_GROSS_MARGIN_PCT = 0.25;

// ─── Multi-unit install discount ──────────────────────────────────────────────

interface MultiUnitInstallResult {
  per_unit_cost: number;
  total_cost: number;
  breakdown: InstallPricingBreakdown & { quantity: number };
}

function computeMultiUnitInstall(quantity: number): MultiUnitInstallResult {
  const d = INSTALL_PRICING_DEFAULTS;
  let mobilizationPerUnit = d.mobilization_fixed;
  let laborPerUnit = d.per_unit_labor;
  const materialsPerUnit = d.per_unit_materials_allowance; // never discounted
  let compliancePerUnit = d.compliance_admin;

  // MOBILIZATION_SPREAD: share mobilization across units
  if (quantity >= 2) {
    mobilizationPerUnit = d.mobilization_fixed / quantity;
  }

  // LABOR_EFFICIENCY tiers
  if (quantity >= 5) {
    laborPerUnit = d.per_unit_labor * (1 - 0.15); // 15% discount, cap 20%
  } else if (quantity >= 3) {
    laborPerUnit = d.per_unit_labor * (1 - 0.10); // 10% discount, cap 20%
  }

  // compliance_admin: up to 15% discount for multi-unit
  if (quantity >= 3) {
    compliancePerUnit = d.compliance_admin * (1 - 0.15);
  }

  const perUnit = mobilizationPerUnit + laborPerUnit + materialsPerUnit + compliancePerUnit;
  return {
    per_unit_cost: Math.round(perUnit * 100) / 100,
    total_cost: Math.round(perUnit * quantity * 100) / 100,
    breakdown: {
      mobilization_fixed: Math.round(mobilizationPerUnit * 100) / 100,
      per_unit_labor: Math.round(laborPerUnit * 100) / 100,
      per_unit_materials_allowance: materialsPerUnit,
      compliance_admin: Math.round(compliancePerUnit * 100) / 100,
      quantity,
    },
  };
}

// ─── Commission calculation ───────────────────────────────────────────────────

function computeCommission(
  hardwareLines: Array<{ unit_price: number; quantity: number }>
): CommissionResult {
  let total = 0;
  const notes: string[] = [];

  for (const line of hardwareLines) {
    const lineTotal = line.unit_price * line.quantity;
    // Evaluate rules in priority order (higher priority first)
    const sortedRules = [...COMMISSION_RULES].sort(
      (a, b) => (b.priority ?? 0) - (a.priority ?? 0)
    );

    let applied = false;
    for (const rule of sortedRules) {
      if (!rule.applies_to.includes('generator_hardware')) continue;

      if (rule.condition.type === 'UNIT_PRICE_GT') {
        if (line.unit_price > (rule.condition.value ?? 0)) {
          total += lineTotal * rule.commission_pct;
          notes.push(
            `${rule.id}: $${lineTotal.toLocaleString()} hardware @ ${(rule.commission_pct * 100).toFixed(0)}%`
          );
          applied = true;
          break;
        }
      } else if (rule.condition.type === 'ALWAYS') {
        total += lineTotal * rule.commission_pct;
        notes.push(
          `${rule.id}: $${lineTotal.toLocaleString()} hardware @ ${(rule.commission_pct * 100).toFixed(0)}%`
        );
        applied = true;
        break;
      }
    }

    if (!applied) {
      notes.push(`No commission rule matched for line $${lineTotal}`);
    }
  }

  return {
    total_commission: Math.round(total * 100) / 100,
    notes: notes.join('; '),
  };
}

// ─── ITC calculation ──────────────────────────────────────────────────────────

function computeItc(
  lines: Array<{ type: LineItemType; extended_price: number }>,
  itcPct: number = ITC_DEFAULT_PCT
): number {
  if (!isEnabled('ENABLE_ITC_VIEW')) return 0;

  const eligibleTotal = lines
    .filter((l) => ITC_ELIGIBLE_TYPES.includes(l.type) && !ITC_INELIGIBLE_TYPES.includes(l.type))
    .reduce((sum, l) => sum + l.extended_price, 0);

  return Math.round(eligibleTotal * itcPct * 100) / 100;
}

// ─── Approval / guardrail evaluation ──────────────────────────────────────────

function evaluateApproval(
  input: QuoteBuildInput,
  totals: QuoteTotals,
  hardwareLines: Array<{ unit_price: number; quantity: number }>,
): ApprovalResult {
  const reasons: string[] = [];
  const { discounts } = input;

  // APPROVE_IF_HARDWARE_DISCOUNT_GT_10
  if (discounts.hardware_pct > HARDWARE_DISCOUNT_APPROVAL_THRESHOLD) {
    reasons.push(
      `APPROVE_IF_HARDWARE_DISCOUNT_GT_10: hardware discount ${(discounts.hardware_pct * 100).toFixed(1)}% > ${(HARDWARE_DISCOUNT_APPROVAL_THRESHOLD * 100).toFixed(0)}%`
    );
  }

  // APPROVE_IF_INSTALL_DISCOUNT_GT_20
  if (discounts.install_pct > INSTALL_DISCOUNT_APPROVAL_THRESHOLD) {
    reasons.push(
      `APPROVE_IF_INSTALL_DISCOUNT_GT_20: install discount ${(discounts.install_pct * 100).toFixed(1)}% > ${(INSTALL_DISCOUNT_APPROVAL_THRESHOLD * 100).toFixed(0)}%`
    );
  }

  // REQUIRE_WAIVER_IF_INSTALL_REMOVED_GTE_10KW
  const hasInstallPackage = input.selected_lines.some((l) => l.type === 'installation_package');
  const totalCapacityKw = estimateCapacityKw(input);

  if (totalCapacityKw >= TURNKEY_DEFAULT_CAPACITY_KW_GTE && !hasInstallPackage) {
    reasons.push(
      `REQUIRE_WAIVER_IF_INSTALL_REMOVED_GTE_10KW: system capacity ${totalCapacityKw}kW >= ${TURNKEY_DEFAULT_CAPACITY_KW_GTE}kW but no installation package`
    );
  }

  // INSTALL_DISCOUNT_REQUIRES_LABOR_COVERAGE
  if (discounts.install_pct > 0) {
    reasons.push('INSTALL_DISCOUNT_REQUIRES_LABOR_COVERAGE: install discount applied, materials coverage must be verified');
  }

  if (reasons.length === 0) {
    return { status: 'APPROVED', reasons: [] };
  }

  return {
    status: 'PENDING',
    reasons,
    approver_role: 'sales_manager',
  };
}

function estimateCapacityKw(input: QuoteBuildInput): number {
  let totalW = 0;
  for (const line of input.selected_lines) {
    if (line.type !== 'generator_hardware') continue;
    const prod = CATALOG_PRODUCTS.find((p) => p.canonical_sku === line.canonical_sku);
    if (prod) totalW += prod.power.continuous_w * line.quantity;
  }
  return totalW / 1000;
}

// ─── Main pricing engine ──────────────────────────────────────────────────────

export function buildQuote(input: QuoteBuildInput): QuoteBuildOutput {
  const validation = validateInput(input);
  if (!validation.valid) {
    return {
      quote_id: generateQuoteId(),
      status: 'REQUIRES_APPROVAL',
      approval: { status: 'PENDING', reasons: validation.errors },
      totals: emptyTotals(),
      commission: { total_commission: 0, notes: 'Validation failed' },
      validation,
    };
  }

  const { selected_lines, discounts } = input;

  // Resolve prices and compute extended prices per line
  const resolvedLines = selected_lines.map((line) => {
    const unitPrice = line.unit_price ?? resolveUnitPrice(line.canonical_sku) ?? 0;
    const discountPct = getDiscountForType(line.type, discounts);
    const discountedPrice = unitPrice * (1 - discountPct);
    const extendedPrice = discountedPrice * line.quantity;
    return { ...line, unit_price: unitPrice, discounted_price: discountedPrice, extended_price: extendedPrice };
  });

  // Compute subtotals by type
  const hardwareTotal = sumByType(resolvedLines, 'generator_hardware');
  const installTotal = sumByType(resolvedLines, 'installation_package');
  const servicesTotal = sumByType(resolvedLines, 'professional_service');
  const subtotal = hardwareTotal + installTotal + servicesTotal;

  // Multi-unit install logic
  let multiUnitNote = '';
  if (isEnabled('ENABLE_MULTI_UNIT_INSTALL_LOGIC')) {
    const installLines = selected_lines.filter((l) => l.type === 'installation_package');
    const totalInstallQty = installLines.reduce((s, l) => s + l.quantity, 0);
    if (totalInstallQty >= 2) {
      const muResult = computeMultiUnitInstall(totalInstallQty);
      multiUnitNote = `Multi-unit install: ${totalInstallQty} units, $${muResult.per_unit_cost}/unit (mobilization spread).`;
    }
  }

  // ITC
  const itcEstimate = computeItc(
    resolvedLines.map((l) => ({ type: l.type, extended_price: l.extended_price }))
  );

  const totals: QuoteTotals = {
    hardware_total: round2(hardwareTotal),
    installation_total: round2(installTotal),
    services_total: round2(servicesTotal),
    subtotal: round2(subtotal),
    itc_estimate: itcEstimate,
    net_total_after_itc: round2(subtotal - itcEstimate),
  };

  // Commission (on hardware only)
  const hardwareLines = resolvedLines
    .filter((l) => l.type === 'generator_hardware')
    .map((l) => ({ unit_price: l.unit_price, quantity: l.quantity }));

  const commission = computeCommission(hardwareLines);
  if (multiUnitNote) {
    commission.notes = commission.notes ? `${commission.notes}; ${multiUnitNote}` : multiUnitNote;
  }

  // Approval evaluation
  const approval = evaluateApproval(input, totals, hardwareLines);

  const quoteStatus = approval.status === 'APPROVED'
    ? 'APPROVED'
    : approval.reasons.some((r) => r.includes('REQUIRE_WAIVER'))
      ? 'REQUIRE_WAIVER'
      : 'REQUIRES_APPROVAL';

  return {
    quote_id: generateQuoteId(),
    status: quoteStatus,
    approval,
    totals,
    commission,
    validation: { valid: true, errors: [] },
  };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function validateInput(input: QuoteBuildInput): ValidationResult {
  const errors: string[] = [];

  if (!input.selected_lines || input.selected_lines.length === 0) {
    errors.push('At least one line item is required.');
  }

  if (!input.actor?.role_id) {
    errors.push('Actor role_id is required.');
  }

  if (!input.state) {
    errors.push('State is required.');
  }

  for (const line of input.selected_lines ?? []) {
    if (!line.canonical_sku) errors.push('Each line item must have a canonical_sku.');
    if (!line.type) errors.push(`Line ${line.canonical_sku}: type is required.`);
    if (!line.quantity || line.quantity < 1) errors.push(`Line ${line.canonical_sku}: quantity must be >= 1.`);

    // Verify SKU exists in catalog
    const price = line.unit_price ?? resolveUnitPrice(line.canonical_sku);
    if (price == null) {
      errors.push(`Line ${line.canonical_sku}: SKU not found in catalog.`);
    }
  }

  return { valid: errors.length === 0, errors };
}

function getDiscountForType(type: LineItemType, discounts: QuoteBuildInput['discounts']): number {
  switch (type) {
    case 'generator_hardware':
    case 'eligible_accessory':
      return discounts.hardware_pct ?? 0;
    case 'installation_package':
      return discounts.install_pct ?? 0;
    case 'professional_service':
      return discounts.services_pct ?? 0;
    default:
      return 0;
  }
}

function sumByType(
  lines: Array<{ type: LineItemType; extended_price: number }>,
  type: LineItemType
): number {
  return lines.filter((l) => l.type === type).reduce((s, l) => s + l.extended_price, 0);
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

function emptyTotals(): QuoteTotals {
  return {
    hardware_total: 0,
    installation_total: 0,
    services_total: 0,
    subtotal: 0,
    itc_estimate: 0,
    net_total_after_itc: 0,
  };
}
