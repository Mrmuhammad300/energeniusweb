/**
 * CRM Bridge Types
 *
 * Defines the contract between the EnerGenius CRM (this app) and the
 * RRG Solutions CRM (rrg-solutions.com).  RRG acts as the "brain" /
 * master admin view that oversees both systems.
 *
 * Data flows:
 *   EnerGenius  ──sync──►  RRG (master)
 *   RRG (master) ──sync──►  EnerGenius
 *
 * All sync payloads use canonical_sku as the shared primary key so
 * product identity is unambiguous across both CRMs.
 */

import type {
  CatalogProduct,
  InstallationPackage,
  ProfessionalService,
  QuoteLineItem,
  QuoteTotals,
  ApprovalStatus,
  CatalogRole,
} from '../product-schema/types';

// ---------------------------------------------------------------------------
// Sync direction
// ---------------------------------------------------------------------------

export type SyncDirection = 'energenius_to_rrg' | 'rrg_to_energenius';
export type SyncEntityType =
  | 'product'
  | 'quote'
  | 'order'
  | 'customer'
  | 'invoice'
  | 'installation'
  | 'commission';

// ---------------------------------------------------------------------------
// Sync envelope — every payload to/from RRG is wrapped in this
// ---------------------------------------------------------------------------

export interface SyncEnvelope<T = unknown> {
  /** Unique event id (UUID v4) */
  event_id: string;
  /** ISO-8601 timestamp */
  timestamp: string;
  /** Which system originated this event */
  source: 'energenius' | 'rrg';
  direction: SyncDirection;
  entity_type: SyncEntityType;
  /** CRUD action */
  action: 'create' | 'update' | 'delete' | 'upsert';
  /** The actual payload */
  payload: T;
  /** Optional idempotency key for retry-safety */
  idempotency_key?: string;
}

// ---------------------------------------------------------------------------
// Catalog Sync Payloads
// ---------------------------------------------------------------------------

export interface CatalogSyncPayload {
  schema_version: string;
  products: CatalogProduct[];
  installation_packages: InstallationPackage[];
  professional_services: ProfessionalService[];
}

// ---------------------------------------------------------------------------
// Quote Sync Payload
// ---------------------------------------------------------------------------

export interface QuoteSyncPayload {
  /** Local quote ID in the originating system */
  source_quote_id: string;
  /** Mapped quote ID in the receiving system (set after first sync) */
  remote_quote_id?: string;
  customer: QuoteSyncCustomer;
  line_items: QuoteLineItem[];
  totals: QuoteTotals;
  approval_status: ApprovalStatus;
  approval_reasons: string[];
  commission_total: number;
  created_by: string;
  created_by_role: CatalogRole;
  created_at: string;
  updated_at: string;
}

export interface QuoteSyncCustomer {
  name: string;
  email: string;
  phone: string;
  company?: string;
  customer_type: 'residential' | 'commercial';
}

// ---------------------------------------------------------------------------
// Order Sync Payload
// ---------------------------------------------------------------------------

export interface OrderSyncPayload {
  source_order_id: string;
  remote_order_id?: string;
  source_quote_id?: string;
  order_number: string;
  customer: QuoteSyncCustomer;
  line_items: QuoteLineItem[];
  totals: QuoteTotals;
  status: string;
  fulfillment_status: string;
  order_date: string;
  updated_at: string;
}

// ---------------------------------------------------------------------------
// Customer Sync Payload
// ---------------------------------------------------------------------------

export interface CustomerSyncPayload {
  source_customer_id: string;
  remote_customer_id?: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  company?: string;
  customer_type: 'residential' | 'commercial';
  billing_address?: AddressPayload;
  shipping_address?: AddressPayload;
}

export interface AddressPayload {
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

// ---------------------------------------------------------------------------
// Commission Sync Payload
// ---------------------------------------------------------------------------

export interface CommissionSyncPayload {
  source_invoice_id: string;
  source_quote_id?: string;
  sales_rep_email: string;
  commission_rate: number;
  commission_amount: number;
  line_items: Array<{
    canonical_sku: string;
    unit_price: number;
    quantity: number;
    commission_pct: number;
    commission_amount: number;
  }>;
  paid_at?: string;
}

// ---------------------------------------------------------------------------
// Installation Sync Payload
// ---------------------------------------------------------------------------

export interface InstallationSyncPayload {
  source_installation_id: string;
  remote_installation_id?: string;
  installation_number: string;
  source_order_id?: string;
  customer: QuoteSyncCustomer;
  products: string[];                    // canonical_sku[]
  installation_package_sku?: string;
  professional_service_skus: string[];
  status: string;
  scheduled_date?: string;
  completed_at?: string;
  installer_email?: string;
}

// ---------------------------------------------------------------------------
// Webhook Registration (RRG registering for events from EnerGenius)
// ---------------------------------------------------------------------------

export interface WebhookRegistration {
  webhook_id: string;
  url: string;
  entity_types: SyncEntityType[];
  actions: Array<'create' | 'update' | 'delete'>;
  secret: string;           // HMAC-SHA256 secret for signature verification
  is_active: boolean;
  created_at: string;
}

// ---------------------------------------------------------------------------
// Sync Status (returned after processing a sync envelope)
// ---------------------------------------------------------------------------

export type SyncOutcome = 'accepted' | 'conflict' | 'rejected' | 'error';

export interface SyncAck {
  event_id: string;
  outcome: SyncOutcome;
  remote_id?: string;       // ID assigned in the receiving system
  message?: string;
  processed_at: string;
}

// ---------------------------------------------------------------------------
// Master Admin View — aggregated data RRG uses for its dashboard
// ---------------------------------------------------------------------------

export interface MasterAdminSummary {
  /** Snapshot timestamp */
  as_of: string;

  energenius: CrmSystemSummary;
  rrg: CrmSystemSummary;

  /** Combined metrics across both CRMs */
  combined: {
    total_revenue: number;
    total_orders: number;
    total_customers: number;
    total_active_quotes: number;
    total_pending_installations: number;
    total_commissions_paid: number;
  };
}

export interface CrmSystemSummary {
  system_name: string;
  base_url: string;
  last_sync_at: string;
  sync_healthy: boolean;

  metrics: {
    total_revenue: number;
    total_orders: number;
    total_customers: number;
    active_quotes: number;
    pending_installations: number;
    commissions_paid: number;
  };
}

// ---------------------------------------------------------------------------
// CRM Bridge Configuration
// ---------------------------------------------------------------------------

export interface CrmBridgeConfig {
  /** The RRG Solutions base URL */
  rrg_base_url: string;
  /** API key for authenticating with RRG */
  rrg_api_key: string;
  /** HMAC secret for webhook signature verification */
  webhook_secret: string;
  /** How often to push full catalog sync (in minutes) */
  catalog_sync_interval_min: number;
  /** Whether real-time event sync is enabled */
  realtime_sync_enabled: boolean;
  /** Retry config for failed syncs */
  retry: {
    max_attempts: number;
    backoff_base_ms: number;
    backoff_max_ms: number;
  };
}
