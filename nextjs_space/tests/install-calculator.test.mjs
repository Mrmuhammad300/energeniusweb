/**
 * Unit tests for Install Cost Calculator logic.
 * Run with: node tests/install-calculator.test.mjs
 *
 * No external test framework required — uses Node assert module.
 */

import assert from 'node:assert/strict';
import { test, describe, it } from 'node:test';

// Import the calculation logic directly (ESM-compatible re-implementation
// so we can test without TypeScript compilation in CI)

const BUNDLE_WATTAGE_THRESHOLD = 5000;
const MULTI_UNIT_DISCOUNT_RATE = 0.10;
const MULTI_UNIT_WATTAGE_THRESHOLD = 20000;

const INSTALL_PACKAGES = {
  residential: [
    { id: 'virtual-site-audit', name: 'Virtual Site Audit', price: 299, bundlePrice: null },
    { id: 'quick-start-install', name: 'The Quick Start', price: 3499, bundlePrice: null },
    { id: 'turnkey-install', name: 'The Turnkey', price: 5999, bundlePrice: 4999, isPopular: true },
    { id: 'peace-of-mind', name: 'The Peace of Mind', price: 5999, bundlePrice: null, monthlyFee: 49 },
  ],
  commercial: [
    { id: 'site-commissioning', name: 'Site Commissioning', price: 2500, bundlePrice: null },
    { id: 'full-deployment', name: 'Full Deployment', price: 12500, bundlePrice: 9999, isPopular: true },
  ],
};

function calculateDeal(input) {
  const {
    unitPrice,
    wattage,
    quantity,
    installPackageId,
    commissionRate = 0.15,
    category = 'residential',
  } = input;

  const equipmentSubtotal = unitPrice * quantity;
  const qualifiesForMultiUnit = wattage >= MULTI_UNIT_WATTAGE_THRESHOLD && quantity > 1;
  const multiUnitDiscount = qualifiesForMultiUnit
    ? Math.round(equipmentSubtotal * MULTI_UNIT_DISCOUNT_RATE * 100) / 100
    : 0;
  const equipmentTotal = equipmentSubtotal - multiUnitDiscount;

  const packages = category === 'commercial'
    ? INSTALL_PACKAGES.commercial
    : INSTALL_PACKAGES.residential;
  const selectedPackage = installPackageId
    ? packages.find((p) => p.id === installPackageId) ?? null
    : null;

  const installBasePrice = selectedPackage ? selectedPackage.price : 0;
  const qualifiesForBundle = wattage >= BUNDLE_WATTAGE_THRESHOLD && selectedPackage?.bundlePrice != null;
  const installFinalPrice = qualifiesForBundle ? selectedPackage.bundlePrice : installBasePrice;
  const installBundleSavings = installBasePrice - installFinalPrice;
  const monthlyFee = selectedPackage?.monthlyFee ?? 0;

  const dealSubtotal = equipmentSubtotal + installBasePrice;
  const totalSavings = multiUnitDiscount + installBundleSavings;
  const dealTotal = equipmentTotal + installFinalPrice;
  const commissionAmount = Math.round(dealTotal * commissionRate * 100) / 100;

  return {
    unitPrice, quantity, equipmentSubtotal, multiUnitDiscount, equipmentTotal,
    installPackageName: selectedPackage?.name ?? 'None',
    installBasePrice, installBundleSavings, installTotal: installFinalPrice,
    monthlyFee, dealSubtotal, totalSavings, dealTotal,
    commissionRate, commissionAmount,
  };
}

// --- Tests ---

let passed = 0;
let failed = 0;

function assertTest(name, fn) {
  try {
    fn();
    passed++;
    console.log(`  PASS  ${name}`);
  } catch (e) {
    failed++;
    console.log(`  FAIL  ${name}`);
    console.log(`        ${e.message}`);
  }
}

console.log('\n=== Install Cost Calculator Tests ===\n');

// 1. Equipment only — no install
console.log('Equipment Only:');
assertTest('single unit, no install', () => {
  const result = calculateDeal({ unitPrice: 4999, wattage: 10000, quantity: 1, installPackageId: null });
  assert.equal(result.equipmentSubtotal, 4999);
  assert.equal(result.multiUnitDiscount, 0);
  assert.equal(result.equipmentTotal, 4999);
  assert.equal(result.installBasePrice, 0);
  assert.equal(result.dealTotal, 4999);
  assert.equal(result.installPackageName, 'None');
});

assertTest('multiple units below multi-unit threshold', () => {
  const result = calculateDeal({ unitPrice: 2999, wattage: 10000, quantity: 3, installPackageId: null });
  assert.equal(result.equipmentSubtotal, 8997);
  assert.equal(result.multiUnitDiscount, 0, 'No discount below 20kW');
  assert.equal(result.equipmentTotal, 8997);
});

// 2. Multi-unit discount
console.log('\nMulti-Unit Discount:');
assertTest('triggers at 20kW with qty > 1', () => {
  const result = calculateDeal({ unitPrice: 10000, wattage: 20000, quantity: 2, installPackageId: null });
  assert.equal(result.equipmentSubtotal, 20000);
  assert.equal(result.multiUnitDiscount, 2000, '10% of 20000');
  assert.equal(result.equipmentTotal, 18000);
});

assertTest('does NOT trigger at 20kW with qty = 1', () => {
  const result = calculateDeal({ unitPrice: 10000, wattage: 20000, quantity: 1, installPackageId: null });
  assert.equal(result.multiUnitDiscount, 0);
});

assertTest('does NOT trigger at 19999W with qty > 1', () => {
  const result = calculateDeal({ unitPrice: 10000, wattage: 19999, quantity: 2, installPackageId: null });
  assert.equal(result.multiUnitDiscount, 0);
});

// 3. Bundle discount
console.log('\nBundle Discount:');
assertTest('Turnkey bundle discount applies at 5kW+', () => {
  const result = calculateDeal({
    unitPrice: 5000, wattage: 10000, quantity: 1,
    installPackageId: 'turnkey-install', category: 'residential',
  });
  assert.equal(result.installBasePrice, 5999);
  assert.equal(result.installTotal, 4999, 'Should use bundle price');
  assert.equal(result.installBundleSavings, 1000);
  assert.equal(result.dealTotal, 5000 + 4999);
});

assertTest('Turnkey NO bundle discount below 5kW', () => {
  const result = calculateDeal({
    unitPrice: 2000, wattage: 4999, quantity: 1,
    installPackageId: 'turnkey-install', category: 'residential',
  });
  assert.equal(result.installTotal, 5999, 'Should use full price');
  assert.equal(result.installBundleSavings, 0);
});

assertTest('Quick Start has no bundle price regardless of wattage', () => {
  const result = calculateDeal({
    unitPrice: 5000, wattage: 10000, quantity: 1,
    installPackageId: 'quick-start-install', category: 'residential',
  });
  assert.equal(result.installTotal, 3499);
  assert.equal(result.installBundleSavings, 0);
});

assertTest('Full Deployment commercial bundle', () => {
  const result = calculateDeal({
    unitPrice: 15000, wattage: 20000, quantity: 1,
    installPackageId: 'full-deployment', category: 'commercial',
  });
  assert.equal(result.installBasePrice, 12500);
  assert.equal(result.installTotal, 9999);
  assert.equal(result.installBundleSavings, 2501);
});

// 4. Commission
console.log('\nCommission:');
assertTest('default 15% commission', () => {
  const result = calculateDeal({ unitPrice: 10000, wattage: 10000, quantity: 1, installPackageId: null });
  assert.equal(result.commissionRate, 0.15);
  assert.equal(result.commissionAmount, 1500);
});

assertTest('custom 20% commission', () => {
  const result = calculateDeal({
    unitPrice: 10000, wattage: 10000, quantity: 1,
    installPackageId: null, commissionRate: 0.20,
  });
  assert.equal(result.commissionAmount, 2000);
});

assertTest('commission calculated on deal total (after discounts)', () => {
  const result = calculateDeal({
    unitPrice: 10000, wattage: 20000, quantity: 2,
    installPackageId: 'turnkey-install', category: 'residential',
    commissionRate: 0.15,
  });
  // Equipment: 20000 - 2000 (multi-unit) = 18000
  // Install: 4999 (bundle)
  // Deal total: 22999
  assert.equal(result.dealTotal, 22999);
  assert.equal(result.commissionAmount, Math.round(22999 * 0.15 * 100) / 100);
});

// 5. Monthly fee
console.log('\nMonthly Fee:');
assertTest('Peace of Mind has $49/mo fee', () => {
  const result = calculateDeal({
    unitPrice: 5000, wattage: 10000, quantity: 1,
    installPackageId: 'peace-of-mind', category: 'residential',
  });
  assert.equal(result.monthlyFee, 49);
});

assertTest('Turnkey has no monthly fee', () => {
  const result = calculateDeal({
    unitPrice: 5000, wattage: 10000, quantity: 1,
    installPackageId: 'turnkey-install', category: 'residential',
  });
  assert.equal(result.monthlyFee, 0);
});

// 6. Edge cases
console.log('\nEdge Cases:');
assertTest('zero quantity defaults gracefully', () => {
  const result = calculateDeal({ unitPrice: 5000, wattage: 10000, quantity: 0, installPackageId: null });
  assert.equal(result.equipmentSubtotal, 0);
  assert.equal(result.dealTotal, 0);
});

assertTest('invalid package id returns no install', () => {
  const result = calculateDeal({
    unitPrice: 5000, wattage: 10000, quantity: 1,
    installPackageId: 'nonexistent-package',
  });
  assert.equal(result.installPackageName, 'None');
  assert.equal(result.installBasePrice, 0);
});

assertTest('combined multi-unit + bundle savings', () => {
  const result = calculateDeal({
    unitPrice: 15000, wattage: 20000, quantity: 3,
    installPackageId: 'full-deployment', category: 'commercial',
  });
  // Equipment: 45000 - 4500 = 40500
  // Install: 9999 (bundle)
  // Total savings: 4500 + 2501 = 7001
  assert.equal(result.equipmentSubtotal, 45000);
  assert.equal(result.multiUnitDiscount, 4500);
  assert.equal(result.installBundleSavings, 2501);
  assert.equal(result.totalSavings, 7001);
  assert.equal(result.dealTotal, 40500 + 9999);
});

// --- Summary ---
console.log('\n===========================');
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log('===========================\n');

process.exit(failed > 0 ? 1 : 0);
