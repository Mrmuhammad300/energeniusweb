/**
 * Product Schema — public API
 *
 * Re-exports everything consumers need from a single import path:
 *   import { PRODUCT_SCHEMA, computeQuoteTotals, assessBySqft } from '@/lib/product-schema';
 */

// Schema data
export { PRODUCT_SCHEMA } from './catalog';

// Type definitions
export type {
  ProductSchema,
  CatalogProduct,
  InstallationPackage,
  ProfessionalService,
  ProductType,
  ProductCategory,
  ProductTier,
  CoverageLevel,
  CatalogRole,
  CatalogPermission,
  CatalogRoleDefinition,
  CommissionRule,
  CommissionCondition,
  ProductPricing,
  PowerSpec,
  BatterySpec,
  PhysicalSpec,
  WarrantySpec,
  ProductXref,
  ProductFlags,
  QuoteLineItem,
  QuoteTotals,
  QuoteApproval,
  ApprovalStatus,
  AssessmentResult,
  CalculatorConfig,
  PricingEngineConfig,
  GuardrailsConfig,
  SqftMethod,
  RecommendationLogic,
  ItcConfig,
} from './types';

// Pricing engine
export {
  computeQuoteTotals,
  computeCommission,
  resolveCommissionRule,
  evaluateApproval,
  buildLineItem,
  findProductBySku,
  findInstallationPackageBySku,
  findProfessionalServiceBySku,
} from './pricing-engine';

// Power assessment calculator
export { assessBySqft, assessByDevices } from './calculator';
