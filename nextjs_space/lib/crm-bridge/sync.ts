/**
 * CRM Bridge — Sync Utilities
 *
 * Provides functions to build sync envelopes, verify webhook signatures,
 * and prepare payloads for the RRG Solutions master CRM.
 *
 * NOTE: Actual HTTP transport (fetch calls to rrg-solutions.com) should be
 * wired up once the RRG API spec is finalized. These utilities handle
 * payload construction and signature verification only.
 */

import { randomUUID } from 'crypto';
import type {
  SyncEnvelope,
  SyncEntityType,
  SyncAck,
  CatalogSyncPayload,
  QuoteSyncPayload,
  OrderSyncPayload,
  CustomerSyncPayload,
  CommissionSyncPayload,
  InstallationSyncPayload,
  CrmBridgeConfig,
} from './types';
import { PRODUCT_SCHEMA } from '../product-schema/catalog';

// ---------------------------------------------------------------------------
// Default config (reads from env vars at runtime)
// ---------------------------------------------------------------------------

export function loadBridgeConfig(): CrmBridgeConfig {
  return {
    rrg_base_url: process.env.RRG_CRM_BASE_URL ?? 'https://rrg-solutions.com/api',
    rrg_api_key: process.env.RRG_CRM_API_KEY ?? '',
    webhook_secret: process.env.RRG_WEBHOOK_SECRET ?? '',
    catalog_sync_interval_min: 60,
    realtime_sync_enabled: !!process.env.RRG_REALTIME_SYNC,
    retry: {
      max_attempts: 4,
      backoff_base_ms: 2000,
      backoff_max_ms: 16000,
    },
  };
}

// ---------------------------------------------------------------------------
// Envelope builders
// ---------------------------------------------------------------------------

function createEnvelope<T>(
  entityType: SyncEntityType,
  action: 'create' | 'update' | 'delete' | 'upsert',
  payload: T,
): SyncEnvelope<T> {
  return {
    event_id: randomUUID(),
    timestamp: new Date().toISOString(),
    source: 'energenius',
    direction: 'energenius_to_rrg',
    entity_type: entityType,
    action,
    payload,
    idempotency_key: randomUUID(),
  };
}

/**
 * Build a full catalog sync envelope.
 * Sends the entire product catalog, installation packages, and services.
 */
export function buildCatalogSyncEnvelope(): SyncEnvelope<CatalogSyncPayload> {
  return createEnvelope('product', 'upsert', {
    schema_version: PRODUCT_SCHEMA.schema_version,
    products: PRODUCT_SCHEMA.catalog.products,
    installation_packages: PRODUCT_SCHEMA.installation_packages,
    professional_services: PRODUCT_SCHEMA.professional_services,
  });
}

export function buildQuoteSyncEnvelope(
  quote: QuoteSyncPayload,
  action: 'create' | 'update' = 'create',
): SyncEnvelope<QuoteSyncPayload> {
  return createEnvelope('quote', action, quote);
}

export function buildOrderSyncEnvelope(
  order: OrderSyncPayload,
  action: 'create' | 'update' = 'create',
): SyncEnvelope<OrderSyncPayload> {
  return createEnvelope('order', action, order);
}

export function buildCustomerSyncEnvelope(
  customer: CustomerSyncPayload,
  action: 'create' | 'update' = 'upsert',
): SyncEnvelope<CustomerSyncPayload> {
  return createEnvelope('customer', action, customer);
}

export function buildCommissionSyncEnvelope(
  commission: CommissionSyncPayload,
): SyncEnvelope<CommissionSyncPayload> {
  return createEnvelope('commission', 'create', commission);
}

export function buildInstallationSyncEnvelope(
  installation: InstallationSyncPayload,
  action: 'create' | 'update' = 'create',
): SyncEnvelope<InstallationSyncPayload> {
  return createEnvelope('installation', action, installation);
}

// ---------------------------------------------------------------------------
// Webhook signature verification
// ---------------------------------------------------------------------------

/**
 * Verify an incoming webhook from RRG using HMAC-SHA256.
 *
 * Usage in an API route:
 *   const isValid = await verifyWebhookSignature(rawBody, signatureHeader, config.webhook_secret);
 */
export async function verifyWebhookSignature(
  rawBody: string,
  signature: string,
  secret: string,
): Promise<boolean> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const sig = await crypto.subtle.sign('HMAC', key, encoder.encode(rawBody));
  const expected = Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

  return expected === signature;
}

// ---------------------------------------------------------------------------
// Sync acknowledgment builder
// ---------------------------------------------------------------------------

export function buildSyncAck(
  eventId: string,
  outcome: SyncAck['outcome'],
  remoteId?: string,
  message?: string,
): SyncAck {
  return {
    event_id: eventId,
    outcome,
    remote_id: remoteId,
    message,
    processed_at: new Date().toISOString(),
  };
}
