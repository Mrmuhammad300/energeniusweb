// ── Static catalog registry: products, installation packages, and services ──
// Data sourced from the canonical schema. In production this would be backed by
// the database; for Phase 0 we keep it in-memory so the recommendation +
// pricing engines work without a migration.

import type {
  CatalogProduct,
  InstallationPackage,
  ProfessionalService,
  CommissionRule,
  InstallPricingBreakdown,
} from './types';

// ─── Generator Hardware ───────────────────────────────────────────────────────

export const CATALOG_PRODUCTS: CatalogProduct[] = [
  {
    canonical_sku: 'PX-LITH-000400-MINI',
    brand: 'PowerX',
    series: 'Lithium',
    display_name: 'Power X Lithium 400 Watt Solar Generator (Mini)',
    type: 'generator_hardware',
    category: 'portable_power',
    pricing: { msrp: 750 },
    power: { continuous_w: 400 },
    flags: { exclusive_to_rrg_energenius: false },
  },
  {
    canonical_sku: 'PX-LITH-000750-MINI',
    brand: 'PowerX',
    series: 'Lithium',
    display_name: 'Power X Lithium 750 Watt Solar Generator (Mini)',
    type: 'generator_hardware',
    category: 'portable_power',
    pricing: { msrp: 945 },
    power: { continuous_w: 750 },
    flags: { exclusive_to_rrg_energenius: false },
  },
  {
    canonical_sku: 'PX-AGM-000750',
    brand: 'PowerX',
    series: 'AGM',
    display_name: 'Power X 750 AGM Solar Generator',
    type: 'generator_hardware',
    category: 'portable_power',
    pricing: { msrp: 750 },
    power: { continuous_w: 750 },
    flags: { exclusive_to_rrg_energenius: false },
  },
  {
    canonical_sku: 'PX-LITH-000750',
    brand: 'PowerX',
    series: 'Lithium',
    display_name: 'Power X Lithium 750 Watt Solar Generator',
    type: 'generator_hardware',
    category: 'portable_power',
    pricing: { msrp: 1920 },
    power: { continuous_w: 750 },
    flags: { exclusive_to_rrg_energenius: false },
  },
  {
    canonical_sku: 'PX-LITH-001000-MINI',
    brand: 'PowerX',
    series: 'Lithium',
    display_name: 'Power X Lithium 1000 Watt Solar Generator (Mini)',
    type: 'generator_hardware',
    category: 'portable_power',
    pricing: { msrp: 1000 },
    power: { continuous_w: 1000 },
    battery: { capacity_ah: 120 },
    flags: { exclusive_to_rrg_energenius: false },
  },
  {
    canonical_sku: 'PX-LITH-001000',
    brand: 'PowerX',
    series: 'Lithium',
    display_name: 'Power X Lithium 1000 Watt Solar Generator',
    type: 'generator_hardware',
    category: 'portable_power',
    pricing: { msrp: 1995 },
    power: { continuous_w: 1000 },
    battery: { capacity_ah: 120 },
    flags: { exclusive_to_rrg_energenius: false },
  },
  {
    canonical_sku: 'PX-LITH-001500',
    brand: 'PowerX',
    series: 'Lithium',
    display_name: 'Power X Lithium 1500 Watt Solar Generator',
    type: 'generator_hardware',
    category: 'portable_power',
    pricing: { msrp: 2045 },
    power: { continuous_w: 1500 },
    flags: { exclusive_to_rrg_energenius: false },
  },
  {
    canonical_sku: 'PX-LITH-002000',
    brand: 'PowerX',
    series: 'Lithium',
    display_name: 'Power X Lithium 2000 Watt Solar Generator',
    type: 'generator_hardware',
    category: 'portable_power',
    pricing: { msrp: 2495 },
    power: { continuous_w: 2000 },
    battery: { capacity_ah: 120 },
    flags: { exclusive_to_rrg_energenius: false },
  },
  {
    canonical_sku: 'PX-LITH-003000',
    brand: 'PowerX',
    series: 'Lithium',
    display_name: 'Power X Lithium 3000 Watt Solar Generator',
    type: 'generator_hardware',
    category: 'portable_power',
    pricing: { msrp: 3750 },
    power: { continuous_w: 3000 },
    flags: { exclusive_to_rrg_energenius: false },
  },
  {
    canonical_sku: 'PX-LITH-005000',
    brand: 'PowerX',
    series: 'Lithium',
    display_name: 'Power X Lithium 5000 Watt Solar Generator',
    type: 'generator_hardware',
    category: 'portable_power',
    pricing: { msrp: 6325 },
    power: { continuous_w: 5000, peak_w: 10000 },
    battery: { capacity_ah: 400 },
    flags: { exclusive_to_rrg_energenius: false },
  },
  {
    canonical_sku: 'PX-LITH-008000',
    brand: 'PowerX',
    series: 'Lithium',
    display_name: 'Power X Lithium 8000 Watt Solar Generator',
    type: 'generator_hardware',
    category: 'portable_power',
    pricing: { msrp: 8825 },
    power: { continuous_w: 8000 },
    flags: { exclusive_to_rrg_energenius: false },
  },
  {
    canonical_sku: 'PX-LITH-010000',
    brand: 'PowerX',
    series: 'Lithium',
    display_name: 'Power X Lithium 10000 Watt Solar Generator',
    type: 'generator_hardware',
    category: 'portable_power',
    pricing: { msrp: 10350 },
    power: { continuous_w: 10000 },
    flags: { exclusive_to_rrg_energenius: false },
  },
  {
    canonical_sku: 'PX-LITH-015000',
    brand: 'PowerX',
    series: 'Lithium',
    display_name: 'Power X Lithium 15000 Watt Solar Generator',
    type: 'generator_hardware',
    category: 'portable_power',
    pricing: { msrp: 14950 },
    power: { continuous_w: 15000 },
    flags: { exclusive_to_rrg_energenius: false },
  },
  {
    canonical_sku: 'PX-LITH-020000',
    brand: 'PowerX',
    series: 'Lithium',
    display_name: 'Power X Lithium 20000 Watt Solar Generator',
    type: 'generator_hardware',
    category: 'commercial_power',
    pricing: { msrp: 18750 },
    power: { continuous_w: 20000 },
    flags: { exclusive_to_rrg_energenius: false },
    xrefs: [
      { provider: 'EnerGenius', provider_sku: 'EG-NOMAD-20K', match_type: 'capacity_primary', confidence: 0.98 },
    ],
  },
  {
    canonical_sku: 'PX-LITH-025000',
    brand: 'PowerX',
    series: 'Lithium',
    display_name: 'Power X Lithium 25000 Watt Solar Generator',
    type: 'generator_hardware',
    category: 'commercial_power',
    pricing: { msrp: 24750 },
    power: { continuous_w: 25000 },
    flags: { exclusive_to_rrg_energenius: false },
  },
  {
    canonical_sku: 'PX-LITH-030000',
    brand: 'PowerX',
    series: 'Lithium',
    display_name: 'Power X Lithium 30000 Watt Solar Generator',
    type: 'generator_hardware',
    category: 'commercial_power',
    pricing: { msrp: 31475 },
    power: { continuous_w: 30000 },
    flags: { exclusive_to_rrg_energenius: false },
  },
  // EnerGenius exclusives and branded products
  {
    canonical_sku: 'EG-NOMAD-20K',
    brand: 'EnerGenius',
    series: 'Nomad',
    display_name: 'EnerGenius Nomad 20K',
    type: 'generator_hardware',
    category: 'commercial_power_system',
    pricing: { msrp: 18750 },
    power: { continuous_w: 20000, peak_w: 40000 },
    battery: { life_cycles: 8000 },
    warranty: { years: 5 },
    flags: { exclusive_to_rrg_energenius: false },
    xrefs: [
      { provider: 'PowerXGenerators', provider_sku: 'Lithium-20000', match_type: 'capacity_primary', confidence: 0.98 },
    ],
  },
  {
    canonical_sku: 'EG-NOMAD-40K',
    brand: 'EnerGenius',
    series: 'Nomad',
    display_name: 'EnerGenius Nomad 40K',
    type: 'generator_hardware',
    category: 'commercial_power_system',
    pricing: { msrp: 34500 },
    power: { continuous_w: 40000 },
    flags: { exclusive_to_rrg_energenius: true },
    xrefs: [],
  },
  {
    canonical_sku: 'EG-NOMAD-80K',
    brand: 'EnerGenius',
    series: 'Nomad',
    display_name: 'EnerGenius Nomad 80K',
    type: 'generator_hardware',
    category: 'commercial_power_system',
    pricing: { msrp: 67500 },
    power: { continuous_w: 80000 },
    flags: { exclusive_to_rrg_energenius: true },
    xrefs: [],
  },
];

// ─── Installation Packages ────────────────────────────────────────────────────

export const INSTALLATION_PACKAGES: InstallationPackage[] = [
  {
    canonical_sku: 'INST-VIRTUAL-AUDIT',
    type: 'installation_package',
    display_name: 'Virtual Site Audit',
    pricing: { msrp: 299 },
    rules: {
      eligible_for_discount: false,
      notes: 'Pre-sales validation. No discounts.',
    },
  },
  {
    canonical_sku: 'INST-QUICK-START',
    type: 'installation_package',
    display_name: 'Quick Start',
    pricing: { msrp: 3499 },
    rules: {
      eligible_for_discount: true,
      recommended_for_capacity_kw_lte: 10,
      notes: 'For small/portable systems. Not intended for PCC work.',
    },
  },
  {
    canonical_sku: 'INST-TURNKEY',
    type: 'installation_package',
    display_name: 'Turnkey (Most Popular)',
    pricing: { msrp: 5999 },
    rules: {
      eligible_for_discount: true,
      default_for_capacity_kw_gte: 10,
      notes: 'Default for >=10kW per policy. Removal requires waiver + acknowledgement.',
    },
  },
  {
    canonical_sku: 'INST-PEACE-OF-MIND',
    type: 'installation_package',
    display_name: 'Peace of Mind',
    pricing: { msrp: 5999 },
    rules: {
      eligible_for_discount: true,
      notes: 'Premium framing/PM. Same price as Turnkey, additional service-level positioning.',
    },
  },
];

// ─── Professional Services ────────────────────────────────────────────────────

export const PROFESSIONAL_SERVICES: ProfessionalService[] = [
  {
    canonical_sku: 'SVC-SITE-VERIFY',
    type: 'professional_service',
    display_name: 'Site Verification & Load Confirmation',
    pricing: { min: 1000, max: 3000, default: 2000, pricing_type: 'range_with_default' },
    notes: 'Engineer/site visit to verify loads, panel capacity, short-circuit/coordination study.',
  },
  {
    canonical_sku: 'SVC-PANEL-ATS',
    type: 'professional_service',
    display_name: 'Main Panel & ATS Integration',
    pricing: { min: 5000, max: 15000, default: 9000, pricing_type: 'range_with_default' },
    notes: 'Panel size, breaker upgrades, ATS. Commercial ATS is expensive vs residential.',
  },
  {
    canonical_sku: 'SVC-PCC-TIEIN',
    type: 'professional_service',
    display_name: 'Electrical Tie-in at PCC (Point of Common Coupling)',
    pricing: { min: 5000, max: 20000, default: 12000, pricing_type: 'range_with_default' },
    notes: 'Utility side/service entrance tap, meter socket work, disconnects.',
  },
  {
    canonical_sku: 'SVC-NEC-GROUND',
    type: 'professional_service',
    display_name: 'Grounding & NEC Compliance Package',
    pricing: { min: 2000, max: 6000, default: 3500, pricing_type: 'range_with_default' },
    notes: 'Earth rods, bonding, ground grid tie-in, conduit, inspection corrections.',
  },
  {
    canonical_sku: 'SVC-AHJ-INSPECT',
    type: 'professional_service',
    display_name: 'Coordination with AHJ + Inspections',
    pricing: { min: 800, max: 3000, default: 1500, pricing_type: 'range_with_default' },
    notes: 'Permit fees + inspector callbacks + documentation + punch list fixes.',
  },
];

// ─── Commission Rules ─────────────────────────────────────────────────────────

export const COMMISSION_RULES: CommissionRule[] = [
  {
    id: 'GEN_HW_OVER_25K_40',
    applies_to: ['generator_hardware'],
    commission_pct: 0.40,
    condition: { type: 'UNIT_PRICE_GT', field: 'msrp', value: 25000 },
    priority: 10,
  },
  {
    id: 'GEN_HW_DEFAULT_15',
    applies_to: ['generator_hardware'],
    commission_pct: 0.15,
    condition: { type: 'ALWAYS' },
    priority: 0,
  },
];

// ─── Multi-Unit Install Pricing Defaults ──────────────────────────────────────

export const INSTALL_PRICING_DEFAULTS: InstallPricingBreakdown = {
  mobilization_fixed: 1750,
  per_unit_labor: 2400,
  per_unit_materials_allowance: 850,
  compliance_admin: 750,
};

// ─── Assessment Sizing Constants ──────────────────────────────────────────────

export const SIZING_CONSTANTS = {
  watts_per_sqft: 3.5,
  watts_per_acre: 15246,
  startup_surge_multiplier: 1.25,
  safety_buffer_pct: 0.20,
  coverage_multipliers: {
    essential: 0.6,
    partial: 0.85,
    whole: 1.0,
    premium: 1.0,
  } as Record<string, number>,
  device_library: {
    refrigerator: 800,
    freezer: 700,
    hvac_1_ton: 3500,
    well_pump: 1000,
    lighting_standard_room: 300,
    server_rack_small: 2000,
    security_system: 250,
    medical_equipment_basic: 1500,
  } as Record<string, number>,
};

// ─── Lookup helpers ───────────────────────────────────────────────────────────

const productIndex = new Map<string, CatalogProduct>();
for (const p of CATALOG_PRODUCTS) productIndex.set(p.canonical_sku, p);

const installIndex = new Map<string, InstallationPackage>();
for (const p of INSTALLATION_PACKAGES) installIndex.set(p.canonical_sku, p);

const serviceIndex = new Map<string, ProfessionalService>();
for (const s of PROFESSIONAL_SERVICES) serviceIndex.set(s.canonical_sku, s);

export function lookupProduct(sku: string): CatalogProduct | undefined {
  return productIndex.get(sku);
}

export function lookupInstallPackage(sku: string): InstallationPackage | undefined {
  return installIndex.get(sku);
}

export function lookupService(sku: string): ProfessionalService | undefined {
  return serviceIndex.get(sku);
}

/** Resolve the unit price for any SKU across all catalog types. */
export function resolveUnitPrice(sku: string, servicePriceLevel?: string): number | undefined {
  const prod = lookupProduct(sku);
  if (prod) return prod.pricing.msrp;

  const inst = lookupInstallPackage(sku);
  if (inst) return inst.pricing.msrp;

  const svc = lookupService(sku);
  if (svc) {
    if (servicePriceLevel === 'low') return svc.pricing.min;
    if (servicePriceLevel === 'high') return svc.pricing.max;
    return svc.pricing.default; // medium / default
  }

  return undefined;
}
