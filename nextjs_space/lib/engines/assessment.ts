// ── Assessment compute engine ─────────────────────────────────────────────────
// Convert sqft / acreage / devices / direct watts into estimated load, then
// delegate to the SKU recommendation engine for product matching.

import type { AssessmentInput, AssessmentOutput } from './types';
import { SIZING_CONSTANTS } from './catalog';
import { recommendSkus } from './sku-recommendation';

export function computeAssessment(input: AssessmentInput): AssessmentOutput {
  const {
    method,
    square_feet,
    acreage,
    devices,
    direct_watts,
    coverage_tier = 'whole',
    customer_type = 'commercial',
    overage_buffer_pct = 0.10,
  } = input;

  const warnings: string[] = [];
  let estimatedWatts = 0;

  const coverageMult =
    SIZING_CONSTANTS.coverage_multipliers[coverage_tier] ??
    SIZING_CONSTANTS.coverage_multipliers.whole;

  switch (method) {
    case 'sqft': {
      if (!square_feet || square_feet <= 0) {
        warnings.push('square_feet is required for sqft method.');
        break;
      }
      estimatedWatts = square_feet * SIZING_CONSTANTS.watts_per_sqft * coverageMult;
      break;
    }

    case 'acreage': {
      if (!acreage || acreage <= 0) {
        warnings.push('acreage is required for acreage method.');
        break;
      }
      estimatedWatts = acreage * SIZING_CONSTANTS.watts_per_acre * coverageMult;
      break;
    }

    case 'devices': {
      if (!devices || Object.keys(devices).length === 0) {
        warnings.push('devices map is required for devices method.');
        break;
      }
      for (const [deviceName, watts] of Object.entries(devices)) {
        const libraryWatts = SIZING_CONSTANTS.device_library[deviceName];
        // If device exists in library, use library value; otherwise treat the
        // value as custom wattage.
        const w = libraryWatts ?? watts;
        estimatedWatts += w;
      }
      // Apply startup surge multiplier for devices
      estimatedWatts *= SIZING_CONSTANTS.startup_surge_multiplier;
      break;
    }

    case 'direct': {
      if (!direct_watts || direct_watts <= 0) {
        warnings.push('direct_watts is required for direct method.');
        break;
      }
      estimatedWatts = direct_watts;
      break;
    }

    default:
      warnings.push(`Unknown assessment method: ${method}`);
  }

  // Apply safety buffer
  estimatedWatts = Math.ceil(estimatedWatts * (1 + SIZING_CONSTANTS.safety_buffer_pct));

  // Recommended kW (round up to nearest integer kW)
  const recommendedKw = Math.ceil(estimatedWatts / 1000);

  // Get SKU recommendations
  const recoResult = recommendSkus({
    estimated_watts: estimatedWatts,
    customer_type,
    overage_buffer_pct,
  });

  return {
    estimated_watts: estimatedWatts,
    recommended_kw: recommendedKw,
    recommended_skus: recoResult.recommended,
    warnings: [...warnings, ...recoResult.warnings],
  };
}
