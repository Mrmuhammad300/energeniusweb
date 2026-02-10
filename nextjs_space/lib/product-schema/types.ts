/**
 * Product Schema Type Definitions
 *
 * Canonical type system for the EnerGenius + PowerX product catalog.
 * These types map directly to the master product schema and are the
 * single source of truth for catalog data, pricing, commissions,
 * power assessment, and CRM synchronization with RRG Solutions.
 */

// ---------------------------------------------------------------------------
// Units & Enums
// ---------------------------------------------------------------------------

export type PowerUnit = 'W';
export type EnergyUnit = 'kWh';
export type BatteryCapacityUnit = 'Ah';
export type WeightUnit = 'lb';
export type Currency = 'USD';

export type ProductType =
  | 'generator_hardware'
  | 'installation_package'
  | 'professional_service';

export type ProductCategory =
  | 'portable_power'
  | 'commercial_power'
  | 'commercial_power_system';

export type ProductTier =
  | 'portable'   // ≤ 2000W
  | 'home'       // 2000–8000W
  | 'professional' // 8000–15000W
  | 'commercial';  // > 15000W

export type CoverageLevel = 'essential' | 'partial' | 'whole';

export type XrefMatchType = 'capacity_primary' | 'capacity_secondary' | 'equivalent';

// ---------------------------------------------------------------------------
// Role-Based Access (catalog-specific, complements existing RBAC)
// ---------------------------------------------------------------------------

export type CatalogPermission =
  | 'catalog_read'
  | 'catalog_write'
  | 'quote_build'
  | 'discount_override'
  | 'approve_discounts'
  | 'view_margins'
  | 'manage_commissions'
  | 'request_discount_approval'
  | 'view_commissions'
  | 'dealer_quote_build'
  | 'submit_for_approval'
  | 'view_dealer_pricing';

export type CatalogRole = 'admin' | 'sales_manager' | 'rep' | 'dealer_admin' | 'dealer_rep';

export interface CatalogRoleDefinition {
  permissions: CatalogPermission[];
}

// ---------------------------------------------------------------------------
// Commission Rules
// ---------------------------------------------------------------------------

export interface CommissionCondition {
  unit_price_gt?: number;
  unit_price_lt?: number;
  category_in?: ProductCategory[];
}

export interface CommissionRule {
  id: string;
  applies_to: ProductType;
  commission_pct: number;
  condition?: CommissionCondition;
  priority: number;
}

// ---------------------------------------------------------------------------
// Product Pricing
// ---------------------------------------------------------------------------

export interface ProductPricing {
  msrp: number;
  dealer_cost?: number;
  map_price?: number;         // Minimum advertised price
}

// ---------------------------------------------------------------------------
// Product Power Specs
// ---------------------------------------------------------------------------

export interface PowerSpec {
  continuous_w: number;
  peak_w?: number;
}

// ---------------------------------------------------------------------------
// Product Battery Specs
// ---------------------------------------------------------------------------

export interface BatterySpec {
  capacity_ah?: number | null;
  nominal_v?: number | null;
  capacity_kwh?: number | null;
  life_cycles?: number;
}

// ---------------------------------------------------------------------------
// Product Physical Specs
// ---------------------------------------------------------------------------

export interface PhysicalSpec {
  weight_lb?: number;
  dimensions?: string;
}

// ---------------------------------------------------------------------------
// Product Warranty
// ---------------------------------------------------------------------------

export interface WarrantySpec {
  years: number;
  description?: string;
}

// ---------------------------------------------------------------------------
// Cross-Reference (maps EnerGenius SKUs ↔ PowerX SKUs)
// ---------------------------------------------------------------------------

export interface ProductXref {
  provider: string;
  provider_sku: string;
  match_type: XrefMatchType;
}

// ---------------------------------------------------------------------------
// Product Flags
// ---------------------------------------------------------------------------

export interface ProductFlags {
  exclusive?: boolean;
  discontinued?: boolean;
  coming_soon?: boolean;
}

// ---------------------------------------------------------------------------
// Core Product
// ---------------------------------------------------------------------------

export interface CatalogProduct {
  canonical_sku: string;
  brand: string;
  series: string;
  display_name: string;
  type: ProductType;
  category: ProductCategory;
  pricing: ProductPricing;
  power?: PowerSpec;
  battery?: BatterySpec;
  physical?: PhysicalSpec;
  warranty?: WarrantySpec;
  attributes?: Record<string, boolean | string | number>;
  flags?: ProductFlags;
  xrefs?: ProductXref[];
}

// ---------------------------------------------------------------------------
// Installation Packages
// ---------------------------------------------------------------------------

export interface InstallationPackage {
  canonical_sku: string;
  display_name?: string;
  price: number;
  default_for_kw_gte?: number;
  description?: string;
}

// ---------------------------------------------------------------------------
// Professional Services
// ---------------------------------------------------------------------------

export interface ProfessionalService {
  canonical_sku: string;
  display_name?: string;
  min: number;
  default: number;
  max: number;
  description?: string;
}

// ---------------------------------------------------------------------------
// Power Assessment Calculator
// ---------------------------------------------------------------------------

export interface SqftMethod {
  baseline_w_per_sqft: number;
  coverage_multipliers: Record<CoverageLevel, number>;
}

export interface DevicesMethod {
  formula: string;
}

export interface CalculatorMethods {
  sqft: SqftMethod;
  devices: DevicesMethod;
}

export interface RecommendationLogic {
  buffer_pct: number;
  rule: 'smallest_continuous_w_gte_required';
}

export interface CalculatorConfig {
  methods: CalculatorMethods;
  recommendation_logic: RecommendationLogic;
}

// ---------------------------------------------------------------------------
// Pricing Engine
// ---------------------------------------------------------------------------

export interface PricingTotals {
  hardware_total: string;
  installation_total: string;
  services_total: string;
  subtotal: string;
}

export interface ItcConfig {
  enabled: boolean;
  pct: number;
  eligible_types: ProductType[];
}

export interface PricingEngineConfig {
  totals: PricingTotals;
  itc: ItcConfig;
}

// ---------------------------------------------------------------------------
// Guardrails (business rules for quoting)
// ---------------------------------------------------------------------------

export interface ApprovalThresholds {
  hardware_discount_pct: number;
  install_discount_pct: number;
}

export interface GuardrailsConfig {
  turnkey_required_kw_gte: number;
  approval_thresholds: ApprovalThresholds;
  waiver_required_if_install_removed: boolean;
}

// ---------------------------------------------------------------------------
// API Endpoint Descriptor
// ---------------------------------------------------------------------------

export interface ApiEndpointDescriptor {
  [route: string]: string;
}

// ---------------------------------------------------------------------------
// Top-Level Schema
// ---------------------------------------------------------------------------

export interface ProductSchema {
  schema_version: string;
  currency: Currency;
  primary_key: 'canonical_sku';

  units: {
    power_continuous: PowerUnit;
    power_peak: PowerUnit;
    energy: EnergyUnit;
    battery_capacity: BatteryCapacityUnit;
    weight: WeightUnit;
  };

  roles: Record<CatalogRole, CatalogRoleDefinition>;
  commission_rules: CommissionRule[];

  catalog: {
    products: CatalogProduct[];
  };

  installation_packages: InstallationPackage[];
  professional_services: ProfessionalService[];
  calculator: CalculatorConfig;
  pricing_engine: PricingEngineConfig;
  guardrails: GuardrailsConfig;
  api_endpoints: ApiEndpointDescriptor;
}

// ---------------------------------------------------------------------------
// Quote Line Item (used when building quotes)
// ---------------------------------------------------------------------------

export interface QuoteLineItem {
  canonical_sku: string;
  type: ProductType;
  display_name: string;
  quantity: number;
  unit_price: number;
  discount_pct?: number;
  discount_approved_by?: string;
  total_price: number;
}

// ---------------------------------------------------------------------------
// Quote Totals (computed output)
// ---------------------------------------------------------------------------

export interface QuoteTotals {
  hardware_total: number;
  installation_total: number;
  services_total: number;
  subtotal: number;
  itc_eligible_amount: number;
  itc_savings: number;
  net_after_itc: number;
}

// ---------------------------------------------------------------------------
// Approval Status
// ---------------------------------------------------------------------------

export type ApprovalStatus = 'auto_approved' | 'pending_approval' | 'approved' | 'rejected';

export interface QuoteApproval {
  status: ApprovalStatus;
  reasons: string[];
  requires_approval_from?: CatalogRole;
}

// ---------------------------------------------------------------------------
// Assessment Result (power calculator output)
// ---------------------------------------------------------------------------

export interface AssessmentResult {
  method: 'sqft' | 'devices';
  estimated_watts: number;
  recommended_skus: string[];
  recommended_products: CatalogProduct[];
  buffer_applied_pct: number;
}
