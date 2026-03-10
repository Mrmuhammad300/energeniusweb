/**
 * Install Cost Calculator — Pure calculation logic for CRM deal pricing.
 *
 * Used by sales reps to quickly estimate total project cost including
 * equipment, installation packages, and bundle discounts.
 */

// Residential install packages with base and bundle pricing
export const INSTALL_PACKAGES = {
  residential: [
    {
      id: 'virtual-site-audit',
      name: 'Virtual Site Audit',
      price: 299,
      bundlePrice: null,
      timeline: '48 hours',
      minWatts: 5000,
      maxWatts: 30000,
      warranty: 'N/A',
      description: 'Remote site assessment via photos/video call',
    },
    {
      id: 'quick-start-install',
      name: 'The Quick Start',
      price: 3499,
      bundlePrice: null,
      timeline: '2-4 weeks',
      minWatts: 5000,
      maxWatts: 8000,
      warranty: '1-year workmanship',
      description: 'Standard install with transfer switch & permitting',
    },
    {
      id: 'turnkey-install',
      name: 'The Turnkey',
      price: 5999,
      bundlePrice: 4999,
      timeline: '3-5 weeks',
      minWatts: 10000,
      maxWatts: 15000,
      warranty: '2-year workmanship + 1-year service',
      description: 'Full install with monitoring, gas connection & service plan',
      isPopular: true,
    },
    {
      id: 'peace-of-mind',
      name: 'The Peace of Mind',
      price: 5999,
      bundlePrice: null,
      timeline: '2-3 weeks (priority)',
      minWatts: 10000,
      maxWatts: 30000,
      warranty: '5-year workmanship + lifetime service',
      description: 'Premium install with proactive monitoring & $49/mo service',
      monthlyFee: 49,
    },
  ],
  commercial: [
    {
      id: 'site-commissioning',
      name: 'Site Commissioning',
      price: 2500,
      bundlePrice: null,
      timeline: '1-2 weeks',
      minWatts: 15000,
      maxWatts: 30000,
      warranty: 'N/A',
      description: 'Inspection, testing & startup for pre-installed systems',
    },
    {
      id: 'full-deployment',
      name: 'Full Deployment',
      price: 12500,
      bundlePrice: 9999,
      timeline: '8-12 weeks',
      minWatts: 15000,
      maxWatts: 30000,
      warranty: '3-year workmanship + 2-year maintenance',
      description: 'End-to-end commercial install with pad, crane & training',
      isPopular: true,
    },
  ],
} as const;

export type InstallPackage = (typeof INSTALL_PACKAGES.residential)[number] | (typeof INSTALL_PACKAGES.commercial)[number];

// Threshold for bundle discount eligibility: 5,000W+
const BUNDLE_WATTAGE_THRESHOLD = 5000;

// Multi-unit discount: 10% off for 20kW+ generators when qty > 1
const MULTI_UNIT_DISCOUNT_RATE = 0.10;
const MULTI_UNIT_WATTAGE_THRESHOLD = 20000;

export interface DealCalculation {
  // Equipment
  unitPrice: number;
  quantity: number;
  equipmentSubtotal: number;
  multiUnitDiscount: number;
  equipmentTotal: number;

  // Installation
  installPackageName: string;
  installBasePrice: number;
  installBundleSavings: number;
  installTotal: number;
  monthlyFee: number;

  // Totals
  dealSubtotal: number;
  totalSavings: number;
  dealTotal: number;

  // Commission (15% default)
  commissionRate: number;
  commissionAmount: number;
}

export interface DealInput {
  unitPrice: number;
  wattage: number;
  quantity: number;
  installPackageId: string | null;
  commissionRate?: number; // default 0.15
  category?: 'residential' | 'commercial';
}

/**
 * Calculate the full deal cost breakdown for a CRM deal.
 * Returns all line items needed for rep approval.
 */
export function calculateDeal(input: DealInput): DealCalculation {
  const {
    unitPrice,
    wattage,
    quantity,
    installPackageId,
    commissionRate = 0.15,
    category = 'residential',
  } = input;

  // --- Equipment ---
  const equipmentSubtotal = unitPrice * quantity;

  // Multi-unit discount: 10% when wattage >= 20kW and qty > 1
  const qualifiesForMultiUnit = wattage >= MULTI_UNIT_WATTAGE_THRESHOLD && quantity > 1;
  const multiUnitDiscount = qualifiesForMultiUnit
    ? Math.round(equipmentSubtotal * MULTI_UNIT_DISCOUNT_RATE * 100) / 100
    : 0;
  const equipmentTotal = equipmentSubtotal - multiUnitDiscount;

  // --- Installation ---
  const packages = category === 'commercial'
    ? INSTALL_PACKAGES.commercial
    : INSTALL_PACKAGES.residential;
  const selectedPackage = installPackageId
    ? packages.find((p) => p.id === installPackageId) ?? null
    : null;

  const installBasePrice = selectedPackage ? selectedPackage.price : 0;

  // Bundle discount applies when wattage >= 5kW and package has bundlePrice
  const qualifiesForBundle = wattage >= BUNDLE_WATTAGE_THRESHOLD && selectedPackage?.bundlePrice != null;
  const installFinalPrice = qualifiesForBundle
    ? (selectedPackage!.bundlePrice as number)
    : installBasePrice;
  const installBundleSavings = installBasePrice - installFinalPrice;

  const monthlyFee = (selectedPackage && 'monthlyFee' in selectedPackage)
    ? (selectedPackage as any).monthlyFee ?? 0
    : 0;

  // --- Totals ---
  const dealSubtotal = equipmentSubtotal + installBasePrice;
  const totalSavings = multiUnitDiscount + installBundleSavings;
  const dealTotal = equipmentTotal + installFinalPrice;

  // --- Commission ---
  const commissionAmount = Math.round(dealTotal * commissionRate * 100) / 100;

  return {
    unitPrice,
    quantity,
    equipmentSubtotal,
    multiUnitDiscount,
    equipmentTotal,
    installPackageName: selectedPackage?.name ?? 'None',
    installBasePrice,
    installBundleSavings,
    installTotal: installFinalPrice,
    monthlyFee,
    dealSubtotal,
    totalSavings,
    dealTotal,
    commissionRate,
    commissionAmount,
  };
}

/**
 * Format a number as USD currency string.
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format a number as USD with cents.
 */
export function formatCurrencyExact(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}
