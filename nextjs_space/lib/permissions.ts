import { UserRole } from '@prisma/client';

/**
 * Permission definitions for each role
 * Based on the RBAC framework document
 */

export type Permission =
  // Customer & Lead Management
  | 'customers:view_all'
  | 'customers:view_own'
  | 'customers:create'
  | 'customers:edit'
  | 'customers:delete'
  | 'customers:export'
  
  // Quote Management
  | 'quotes:view_all'
  | 'quotes:view_own'
  | 'quotes:create'
  | 'quotes:edit'
  | 'quotes:delete'
  | 'quotes:assign'
  
  // Order Management
  | 'orders:view_all'
  | 'orders:view_own'
  | 'orders:view_assigned'
  | 'orders:create'
  | 'orders:edit'
  | 'orders:delete'
  | 'orders:update_status'
  | 'orders:update_fulfillment'
  
  // Invoice Management
  | 'invoices:view_all'
  | 'invoices:view_own'
  | 'invoices:create'
  | 'invoices:edit'
  | 'invoices:delete'
  | 'invoices:edit_pricing'
  
  // Product Management
  | 'products:view'
  | 'products:edit'
  | 'products:delete'
  
  // Support Tickets
  | 'support:view_all'
  | 'support:view_assigned'
  | 'support:create'
  | 'support:edit'
  | 'support:delete'
  
  // Marketing
  | 'marketing:view_contacts'
  | 'marketing:edit_campaigns'
  | 'marketing:manage_lists'
  | 'marketing:export'
  
  // Team Management
  | 'team:view'
  | 'team:invite'
  | 'team:edit'
  | 'team:delete'
  
  // Analytics
  | 'analytics:view_all'
  | 'analytics:view_own'
  | 'analytics:view_fulfillment'
  
  // System Settings
  | 'settings:view'
  | 'settings:edit'
  
  // Data Export
  | 'data:export'
  
  // Audit Logs
  | 'audit:view'
  
  // Fulfillment Provider Specific
  | 'fulfillment:view_assigned_orders'
  | 'fulfillment:update_shipment'
  | 'fulfillment:view_analytics';

/**
 * Role-based permission matrix
 */
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  SUPER_ADMIN: [
    // Full access to everything
    'customers:view_all',
    'customers:create',
    'customers:edit',
    'customers:delete',
    'customers:export',
    'quotes:view_all',
    'quotes:create',
    'quotes:edit',
    'quotes:delete',
    'quotes:assign',
    'orders:view_all',
    'orders:create',
    'orders:edit',
    'orders:delete',
    'orders:update_status',
    'orders:update_fulfillment',
    'invoices:view_all',
    'invoices:create',
    'invoices:edit',
    'invoices:delete',
    'invoices:edit_pricing',
    'products:view',
    'products:edit',
    'products:delete',
    'support:view_all',
    'support:create',
    'support:edit',
    'support:delete',
    'marketing:view_contacts',
    'marketing:edit_campaigns',
    'marketing:manage_lists',
    'marketing:export',
    'team:view',
    'team:invite',
    'team:edit',
    'team:delete',
    'analytics:view_all',
    'settings:view',
    'settings:edit',
    'data:export',
    'audit:view',
  ],
  
  SALES_REP: [
    // Own records only, no exports/deletes
    'customers:view_own',
    'customers:create',
    'quotes:view_own',
    'quotes:create',
    'quotes:edit',
    'orders:view_own',
    'invoices:view_own',
    'support:create',
    'analytics:view_own',
  ],
  
  OPERATIONS_MANAGER: [
    // View all, edit support items only
    'customers:view_all',
    'quotes:view_all',
    'quotes:edit',
    'orders:view_all',
    'orders:edit',
    'orders:update_status',
    'invoices:view_all',
    'support:view_all',
    'support:create',
    'support:edit',
    'analytics:view_all',
  ],
  
  MARKETING_SPECIALIST: [
    // View all contacts/leads, manage campaigns
    'customers:view_all',
    'quotes:view_all',
    'marketing:view_contacts',
    'marketing:edit_campaigns',
    'marketing:manage_lists',
    'marketing:export',
    'analytics:view_all',
  ],
  
  VIRTUAL_ASSISTANT: [
    // Restricted to assigned fields only
    'customers:view_own',
    'quotes:view_own',
    'support:view_assigned',
    'support:create',
  ],
  
  FULFILLMENT_PROVIDER: [
    // Track orders/products assigned to them
    'orders:view_assigned',
    'orders:update_fulfillment',
    'products:view',
    'fulfillment:view_assigned_orders',
    'fulfillment:update_shipment',
    'fulfillment:view_analytics',
  ],
};

/**
 * Check if a role has a specific permission
 */
export function hasPermission(role: UserRole, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

/**
 * Check if a role has any of the specified permissions
 */
export function hasAnyPermission(role: UserRole, permissions: Permission[]): boolean {
  return permissions.some((permission) => hasPermission(role, permission));
}

/**
 * Check if a role has all of the specified permissions
 */
export function hasAllPermissions(role: UserRole, permissions: Permission[]): boolean {
  return permissions.every((permission) => hasPermission(role, permission));
}

/**
 * Get all permissions for a role
 */
export function getRolePermissions(role: UserRole): Permission[] {
  return ROLE_PERMISSIONS[role] || [];
}

/**
 * Check if a role can export data
 */
export function canExportData(role: UserRole): boolean {
  return hasPermission(role, 'data:export');
}

/**
 * Check if a role can manage team members
 */
export function canManageTeam(role: UserRole): boolean {
  return hasAllPermissions(role, ['team:view', 'team:invite', 'team:edit']);
}

/**
 * Check if a role can access admin dashboard
 */
export function canAccessAdmin(role: UserRole): boolean {
  // All roles except FULFILLMENT_PROVIDER access standard admin
  return role !== 'FULFILLMENT_PROVIDER';
}

/**
 * Check if a role can access fulfillment dashboard
 */
export function canAccessFulfillment(role: UserRole): boolean {
  return role === 'FULFILLMENT_PROVIDER' || role === 'SUPER_ADMIN';
}

/**
 * Get human-readable role name
 */
export function getRoleName(role: UserRole): string {
  const roleNames: Record<UserRole, string> = {
    SUPER_ADMIN: 'Super Admin',
    SALES_REP: 'Sales Representative',
    OPERATIONS_MANAGER: 'Operations Manager',
    MARKETING_SPECIALIST: 'Marketing Specialist',
    VIRTUAL_ASSISTANT: 'Virtual Assistant',
    FULFILLMENT_PROVIDER: 'Fulfillment Provider',
  };
  return roleNames[role] || role;
}

/**
 * Get role description
 */
export function getRoleDescription(role: UserRole): string {
  const descriptions: Record<UserRole, string> = {
    SUPER_ADMIN: 'Full system control and disaster recovery',
    SALES_REP: 'Close deals without exposing the full database',
    OPERATIONS_MANAGER: 'Resolve issues without altering financial or system-level data',
    MARKETING_SPECIALIST: 'Run campaigns and manage segmentation without impacting sales pipelines',
    VIRTUAL_ASSISTANT: 'Execute tasks with zero risk to business intelligence',
    FULFILLMENT_PROVIDER: 'Track and fulfill orders for assigned products',
  };
  return descriptions[role] || '';
}
