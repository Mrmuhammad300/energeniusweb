/**
 * Master Product Catalog
 *
 * Single source of truth for all products, installation packages,
 * professional services, pricing rules, commission structures,
 * calculator configs, and business guardrails.
 *
 * This file is the TypeScript representation of the canonical schema
 * and should be kept in sync with the RRG CRM via the crm-bridge module.
 */

import type { ProductSchema } from './types';

export const PRODUCT_SCHEMA: ProductSchema = {
  schema_version: '1.0.0',
  currency: 'USD',
  primary_key: 'canonical_sku',

  units: {
    power_continuous: 'W',
    power_peak: 'W',
    energy: 'kWh',
    battery_capacity: 'Ah',
    weight: 'lb',
  },

  // -------------------------------------------------------------------------
  // Catalog-specific roles (supplement the main RBAC in lib/permissions.ts)
  // -------------------------------------------------------------------------
  roles: {
    admin: {
      permissions: [
        'catalog_read',
        'catalog_write',
        'quote_build',
        'discount_override',
        'approve_discounts',
        'view_margins',
        'manage_commissions',
      ],
    },
    sales_manager: {
      permissions: [
        'catalog_read',
        'quote_build',
        'approve_discounts',
        'view_margins',
      ],
    },
    rep: {
      permissions: [
        'catalog_read',
        'quote_build',
        'request_discount_approval',
        'view_commissions',
      ],
    },
    dealer_admin: {
      permissions: [
        'catalog_read',
        'dealer_quote_build',
        'submit_for_approval',
        'view_dealer_pricing',
      ],
    },
    dealer_rep: {
      permissions: [
        'catalog_read',
        'dealer_quote_build',
        'submit_for_approval',
        'view_dealer_pricing',
      ],
    },
  },

  // -------------------------------------------------------------------------
  // Commission Rules
  // -------------------------------------------------------------------------
  commission_rules: [
    {
      id: 'GEN_HW_DEFAULT_15',
      applies_to: 'generator_hardware',
      commission_pct: 0.15,
      priority: 1,
    },
    {
      id: 'GEN_HW_OVER_25K_40',
      applies_to: 'generator_hardware',
      commission_pct: 0.40,
      condition: { unit_price_gt: 25000 },
      priority: 10,
    },
  ],

  // -------------------------------------------------------------------------
  // Product Catalog
  // -------------------------------------------------------------------------
  catalog: {
    products: [
      // — PowerX Lithium Series (portable) —
      {
        canonical_sku: 'PX-LITH-001000',
        brand: 'PowerX',
        series: 'Lithium',
        display_name: 'Power X Lithium 1000W Solar Generator',
        type: 'generator_hardware',
        category: 'portable_power',
        pricing: { msrp: 1995 },
        power: { continuous_w: 1000 },
        battery: { capacity_ah: 120, nominal_v: null, capacity_kwh: null },
        physical: { weight_lb: 40 },
      },
      {
        canonical_sku: 'PX-LITH-002000',
        brand: 'PowerX',
        series: 'Lithium',
        display_name: 'Power X Lithium 2000W Solar Generator',
        type: 'generator_hardware',
        category: 'portable_power',
        pricing: { msrp: 2495 },
        power: { continuous_w: 2000 },
        battery: { capacity_ah: 120, nominal_v: null, capacity_kwh: null },
        physical: { weight_lb: 55 },
      },
      {
        canonical_sku: 'PX-LITH-005000',
        brand: 'PowerX',
        series: 'Lithium',
        display_name: 'Power X Lithium 5000W Solar Generator',
        type: 'generator_hardware',
        category: 'portable_power',
        pricing: { msrp: 6325 },
        power: { continuous_w: 5000, peak_w: 10000 },
        battery: { capacity_ah: 400, nominal_v: null, capacity_kwh: null },
      },

      // — PowerX Lithium Series (commercial) —
      {
        canonical_sku: 'PX-LITH-020000',
        brand: 'PowerX',
        series: 'Lithium',
        display_name: 'Power X Lithium 20000W Solar Generator',
        type: 'generator_hardware',
        category: 'commercial_power',
        pricing: { msrp: 18750 },
        power: { continuous_w: 20000 },
      },
      {
        canonical_sku: 'PX-LITH-030000',
        brand: 'PowerX',
        series: 'Lithium',
        display_name: 'Power X Lithium 30000W Solar Generator',
        type: 'generator_hardware',
        category: 'commercial_power',
        pricing: { msrp: 31475 },
        power: { continuous_w: 30000 },
      },

      // — EnerGenius Nomad Series (commercial power systems) —
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
        attributes: { black_start: true },
        xrefs: [
          {
            provider: 'PowerX',
            provider_sku: 'PX-LITH-020000',
            match_type: 'capacity_primary',
          },
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
        flags: { exclusive: true },
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
        flags: { exclusive: true },
      },
    ],
  },

  // -------------------------------------------------------------------------
  // Installation Packages
  // -------------------------------------------------------------------------
  installation_packages: [
    { canonical_sku: 'INST-VIRTUAL-AUDIT', price: 299 },
    { canonical_sku: 'INST-QUICK-START', price: 3499 },
    { canonical_sku: 'INST-TURNKEY', price: 5999, default_for_kw_gte: 10 },
    { canonical_sku: 'INST-PEACE-OF-MIND', price: 5999 },
  ],

  // -------------------------------------------------------------------------
  // Professional Services
  // -------------------------------------------------------------------------
  professional_services: [
    { canonical_sku: 'SVC-SITE-VERIFY', min: 1000, default: 2000, max: 3000 },
    { canonical_sku: 'SVC-PANEL-ATS', min: 5000, default: 9000, max: 15000 },
    { canonical_sku: 'SVC-PCC-TIEIN', min: 5000, default: 12000, max: 20000 },
    { canonical_sku: 'SVC-NEC-GROUND', min: 2000, default: 3500, max: 6000 },
    { canonical_sku: 'SVC-AHJ-INSPECT', min: 800, default: 1500, max: 3000 },
  ],

  // -------------------------------------------------------------------------
  // Power Assessment Calculator
  // -------------------------------------------------------------------------
  calculator: {
    methods: {
      sqft: {
        baseline_w_per_sqft: 3.5,
        coverage_multipliers: {
          essential: 0.6,
          partial: 0.85,
          whole: 1.0,
        },
      },
      devices: {
        formula: 'SUM(device_watts)',
      },
    },
    recommendation_logic: {
      buffer_pct: 0.10,
      rule: 'smallest_continuous_w_gte_required',
    },
  },

  // -------------------------------------------------------------------------
  // Pricing Engine
  // -------------------------------------------------------------------------
  pricing_engine: {
    totals: {
      hardware_total: 'SUM(unit_price * quantity WHERE type == generator_hardware)',
      installation_total: 'SUM(unit_price * quantity WHERE type == installation_package)',
      services_total: 'SUM(unit_price * quantity WHERE type == professional_service)',
      subtotal: 'hardware_total + installation_total + services_total',
    },
    itc: {
      enabled: true,
      pct: 0.30,
      eligible_types: ['generator_hardware'],
    },
  },

  // -------------------------------------------------------------------------
  // Business Guardrails
  // -------------------------------------------------------------------------
  guardrails: {
    turnkey_required_kw_gte: 10,
    approval_thresholds: {
      hardware_discount_pct: 0.10,
      install_discount_pct: 0.20,
    },
    waiver_required_if_install_removed: true,
  },

  // -------------------------------------------------------------------------
  // API Endpoints (descriptor / documentation)
  // -------------------------------------------------------------------------
  api_endpoints: {
    'GET /api/catalog': 'returns catalog.products',
    'POST /api/assessment': 'returns estimated_watts + recommended_skus',
    'POST /api/quote/build': 'returns totals + approval_status',
  },
};
