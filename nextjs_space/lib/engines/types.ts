// ── Shared types for SKU recommendation, cross-reference, and pricing engines ──

// ─── Product / Catalog ────────────────────────────────────────────────────────

export type CustomerType = 'residential' | 'commercial';

export type ProductCategory =
  | 'residential_power'
  | 'commercial_power'
  | 'commercial_power_system'
  | 'portable_power';

export interface CatalogProduct {
  canonical_sku: string;
  display_name: string;
  type: 'generator_hardware' | 'eligible_accessory';
  category: ProductCategory;
  pricing: { msrp: number };
  power: {
    continuous_w: number;
    peak_w?: number;
    kwh?: number;
  };
  battery?: {
    capacity_ah?: number;
    nominal_v?: number;
    capacity_kwh?: number;
    life_cycles?: number;
  };
  warranty?: { years?: number };
  flags: {
    exclusive_to_rrg_energenius: boolean;
  };
  brand: string;
  series?: string;
  xrefs?: Array<{
    provider: string;
    provider_sku: string;
    match_type: string;
    confidence: number;
  }>;
}

export interface InstallationPackage {
  canonical_sku: string;
  type: 'installation_package';
  display_name: string;
  pricing: { msrp: number };
  rules: {
    eligible_for_discount: boolean;
    default_for_capacity_kw_gte?: number;
    recommended_for_capacity_kw_lte?: number;
    notes?: string;
  };
}

export interface ProfessionalService {
  canonical_sku: string;
  type: 'professional_service';
  display_name: string;
  pricing: {
    min: number;
    max: number;
    default: number;
    pricing_type: 'range_with_default';
  };
  notes?: string;
}

export type ServicePriceLevel = 'low' | 'medium' | 'high';

// ─── Multi-Unit Install Discount Logic ────────────────────────────────────────

export interface InstallPricingBreakdown {
  mobilization_fixed: number;
  per_unit_labor: number;
  per_unit_materials_allowance: number;
  compliance_admin: number;
}

// ─── Commission Rules ─────────────────────────────────────────────────────────

export interface CommissionRule {
  id: string;
  applies_to: LineItemType[];
  commission_pct: number;
  condition: { type: string; field?: string; value?: number };
  priority?: number;
}

// ─── SKU Recommendation Engine ────────────────────────────────────────────────

export interface SkuRecommendationInput {
  estimated_watts: number;
  customer_type?: CustomerType;
  min_kw?: number;
  overage_buffer_pct?: number;
  preferred_brands?: string[];
  exclude_brands?: string[];
  exclusive_only?: boolean;
}

export interface RecommendedSku {
  canonical_sku: string;
  display_name: string;
  continuous_w: number;
  peak_w: number;
  msrp: number;
  confidence: number;
  why: string;
}

export interface SkuRecommendationOutput {
  recommended: RecommendedSku[];
  warnings: string[];
}

// ─── SKU Cross-Reference Mapping Engine ───────────────────────────────────────

export type XrefMatchMethod =
  | 'continuous_w_within_pct'
  | 'continuous_w_exact'
  | 'kwh_if_available'
  | 'ah_plus_voltage_to_kwh'
  | 'name_token_numeric_match'
  | 'manual_override';

export interface VendorProduct {
  vendor_sku: string;
  vendor_name: string;
  continuous_w?: number;
  kwh?: number;
  capacity_ah?: number;
  nominal_v?: number;
}

export interface XrefMatch {
  canonical_sku: string;
  vendor_sku: string;
  match_method: XrefMatchMethod;
  confidence: number;
  details: string;
}

export interface XrefMappingOutput {
  matches: XrefMatch[];
  unmatched_vendor_skus: string[];
  warnings: string[];
}

// ─── Pricing Engine ───────────────────────────────────────────────────────────

export type LineItemType =
  | 'generator_hardware'
  | 'installation_package'
  | 'professional_service'
  | 'eligible_accessory';

export interface QuoteLineItem {
  canonical_sku: string;
  type: LineItemType;
  quantity: number;
  unit_price?: number; // if omitted, looked up from catalog
}

export type PricingMode = 'rep' | 'dealer' | 'direct';

export interface Discounts {
  hardware_pct: number;
  install_pct: number;
  services_pct: number;
  reason?: string;
}

export interface QuoteBuildInput {
  pricing_mode: PricingMode;
  customer_type: CustomerType;
  state: string;
  assessment_id?: string;
  selected_lines: QuoteLineItem[];
  discounts: Discounts;
  actor: {
    role_id: string;
    actor_id: string;
  };
}

export interface QuoteTotals {
  hardware_total: number;
  installation_total: number;
  services_total: number;
  subtotal: number;
  itc_estimate: number;
  net_total_after_itc: number;
}

export interface CommissionResult {
  total_commission: number;
  notes: string;
}

export interface ApprovalResult {
  status: 'APPROVED' | 'PENDING';
  reasons: string[];
  approver_role?: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export interface QuoteBuildOutput {
  quote_id: string;
  status: 'APPROVED' | 'REQUIRES_APPROVAL' | 'REQUIRE_WAIVER';
  approval: ApprovalResult;
  totals: QuoteTotals;
  commission: CommissionResult;
  validation: ValidationResult;
}

// ─── Assessment ───────────────────────────────────────────────────────────────

export type AssessmentMethod = 'sqft' | 'acreage' | 'devices' | 'direct';

export interface AssessmentInput {
  method: AssessmentMethod;
  square_feet?: number;
  acreage?: number;
  devices?: Record<string, number>;
  direct_watts?: number;
  coverage_tier?: 'essential' | 'whole' | 'premium';
  state?: string;
  customer_type?: CustomerType;
  overage_buffer_pct?: number;
}

export interface AssessmentOutput {
  estimated_watts: number;
  recommended_kw: number;
  recommended_skus: RecommendedSku[];
  warnings: string[];
}

// ─── Leads ────────────────────────────────────────────────────────────────────

export interface LeadIngestInput {
  name: string;
  email: string;
  phone?: string;
  source: string;
  assessment_id?: string;
  estimated_watts?: number;
  recommended_sku?: string;
  customer_type?: CustomerType;
  state?: string;
  notes?: string;
}

export interface LeadIngestOutput {
  lead_id: string;
  status: string;
}
