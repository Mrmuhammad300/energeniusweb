// ── Feature flags for phased rollout of SKU / pricing / quote engines ──

export interface FeatureFlag {
  id: string;
  default: boolean;
}

const FLAG_DEFINITIONS: FeatureFlag[] = [
  { id: 'ENABLE_ITC_VIEW', default: true },
  { id: 'ENABLE_DEALER_PORTAL', default: false },
  { id: 'ENABLE_QUOTE_BUILDER', default: false },
  { id: 'ENABLE_APPROVAL_ROUTING', default: false },
  { id: 'ENABLE_MULTI_UNIT_INSTALL_LOGIC', default: true },
];

// Runtime overrides via environment variables.
// e.g.  FF_ENABLE_DEALER_PORTAL=true  → flag is on
function envOverride(flagId: string): boolean | undefined {
  const envKey = `FF_${flagId}`;
  const val = process.env[envKey];
  if (val === 'true') return true;
  if (val === 'false') return false;
  return undefined;
}

const flagMap = new Map<string, boolean>();

for (const flag of FLAG_DEFINITIONS) {
  flagMap.set(flag.id, envOverride(flag.id) ?? flag.default);
}

/** Check whether a feature flag is enabled. */
export function isEnabled(flagId: string): boolean {
  const val = flagMap.get(flagId);
  if (val === undefined) {
    console.warn(`[feature-flags] Unknown flag: ${flagId}`);
    return false;
  }
  return val;
}

/** Return all flags as a plain object (useful for debug endpoints). */
export function allFlags(): Record<string, boolean> {
  const out: Record<string, boolean> = {};
  for (const [k, v] of flagMap) out[k] = v;
  return out;
}
