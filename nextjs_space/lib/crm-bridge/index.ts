/**
 * CRM Bridge — public API
 *
 * Re-exports types and sync utilities for RRG Solutions integration.
 *   import { buildCatalogSyncEnvelope, type SyncEnvelope } from '@/lib/crm-bridge';
 */

export type {
  SyncDirection,
  SyncEntityType,
  SyncEnvelope,
  SyncAck,
  SyncOutcome,
  CatalogSyncPayload,
  QuoteSyncPayload,
  QuoteSyncCustomer,
  OrderSyncPayload,
  CustomerSyncPayload,
  CommissionSyncPayload,
  InstallationSyncPayload,
  AddressPayload,
  WebhookRegistration,
  MasterAdminSummary,
  CrmSystemSummary,
  CrmBridgeConfig,
} from './types';

export {
  loadBridgeConfig,
  buildCatalogSyncEnvelope,
  buildQuoteSyncEnvelope,
  buildOrderSyncEnvelope,
  buildCustomerSyncEnvelope,
  buildCommissionSyncEnvelope,
  buildInstallationSyncEnvelope,
  verifyWebhookSignature,
  buildSyncAck,
} from './sync';
