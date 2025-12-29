import { prisma } from './db';
import { headers } from 'next/headers';

type AuditAction =
  | 'exported_customers'
  | 'exported_orders'
  | 'exported_invoices'
  | 'deleted_order'
  | 'deleted_customer'
  | 'deleted_invoice'
  | 'updated_invoice'
  | 'updated_order_status'
  | 'updated_fulfillment_status'
  | 'created_invoice'
  | 'created_order'
  | 'viewed_reports'
  | 'viewed_customer_details'
  | 'invited_user'
  | 'deleted_user'
  | 'updated_user_role'
  | 'updated_settings'
  | 'assigned_fulfillment_provider';

type AuditActionType = 'create' | 'read' | 'update' | 'delete' | 'export';

interface CreateAuditLogParams {
  action: AuditAction;
  actionType: AuditActionType;
  userId: string;
  targetType: string;
  targetId?: string;
  targetLabel?: string;
  metadata?: Record<string, any>;
  success?: boolean;
  errorMessage?: string;
}

/**
 * Create an audit log entry
 */
export async function createAuditLog(params: CreateAuditLogParams) {
  try {
    const headersList = headers();
    const ipAddress = headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || 'unknown';
    const userAgent = headersList.get('user-agent') || 'unknown';

    await prisma.auditLog.create({
      data: {
        action: params.action,
        actionType: params.actionType,
        userId: params.userId,
        targetType: params.targetType,
        targetId: params.targetId,
        targetLabel: params.targetLabel,
        ipAddress,
        userAgent,
        metadata: params.metadata ? JSON.stringify(params.metadata) : null,
        success: params.success ?? true,
        errorMessage: params.errorMessage,
      },
    });
  } catch (error) {
    // Log to console but don't fail the operation
    console.error('Failed to create audit log:', error);
  }
}

/**
 * Log data export action
 */
export async function logExport(
  userId: string,
  targetType: string,
  recordCount: number,
  filters?: Record<string, any>
) {
  await createAuditLog({
    action: `exported_${targetType.toLowerCase()}` as AuditAction,
    actionType: 'export',
    userId,
    targetType,
    metadata: {
      recordCount,
      filters,
      exportedAt: new Date().toISOString(),
    },
  });
}

/**
 * Log deletion action
 */
export async function logDeletion(
  userId: string,
  targetType: string,
  targetId: string,
  targetLabel: string
) {
  await createAuditLog({
    action: `deleted_${targetType.toLowerCase()}` as AuditAction,
    actionType: 'delete',
    userId,
    targetType,
    targetId,
    targetLabel,
  });
}

/**
 * Log update action
 */
export async function logUpdate(
  userId: string,
  targetType: string,
  targetId: string,
  targetLabel: string,
  changes?: Record<string, any>
) {
  await createAuditLog({
    action: `updated_${targetType.toLowerCase()}` as AuditAction,
    actionType: 'update',
    userId,
    targetType,
    targetId,
    targetLabel,
    metadata: changes,
  });
}

/**
 * Log view action for sensitive data
 */
export async function logView(
  userId: string,
  targetType: string,
  targetId: string,
  targetLabel: string
) {
  await createAuditLog({
    action: 'viewed_customer_details',
    actionType: 'read',
    userId,
    targetType,
    targetId,
    targetLabel,
  });
}
