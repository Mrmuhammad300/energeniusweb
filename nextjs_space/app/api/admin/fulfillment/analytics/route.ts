import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { hasPermission } from '@/lib/permissions';
import { UserRole } from '@prisma/client';

export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/fulfillment/analytics
 * Get analytics for fulfillment provider
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userRole = (session.user as any).role as UserRole;
    const fulfillmentProviderId = (session.user as any).fulfillmentProviderId;

    // Check permission
    if (!hasPermission(userRole, 'fulfillment:view_analytics')) {
      return NextResponse.json(
        { error: 'You do not have permission to view analytics' },
        { status: 403 }
      );
    }

    if (!fulfillmentProviderId) {
      return NextResponse.json(
        { error: 'No fulfillment provider profile found' },
        { status: 404 }
      );
    }

    // Get assigned products
    const provider = await prisma.fulfillmentProvider.findUnique({
      where: { id: fulfillmentProviderId },
      include: {
        assignedProducts: {
          where: { isActive: true },
        },
      },
    });

    if (!provider) {
      return NextResponse.json(
        { error: 'Fulfillment provider not found' },
        { status: 404 }
      );
    }

    const assignedSkus = provider.assignedProducts.map((p) => p.productSku);

    // Calculate analytics
    const [totalOrders, pendingOrders, shippedOrders, deliveredOrders] = await Promise.all([
      prisma.order.count({
        where: {
          items: {
            some: {
              productSku: { in: assignedSkus },
            },
          },
        },
      }),
      prisma.order.count({
        where: {
          items: {
            some: {
              productSku: { in: assignedSkus },
            },
          },
          fulfillmentStatus: 'pending',
        },
      }),
      prisma.order.count({
        where: {
          items: {
            some: {
              productSku: { in: assignedSkus },
            },
          },
          fulfillmentStatus: 'shipped',
        },
      }),
      prisma.order.count({
        where: {
          items: {
            some: {
              productSku: { in: assignedSkus },
            },
          },
          fulfillmentStatus: 'delivered',
        },
      }),
    ]);

    // Calculate average shipping days
    const totalShipped = provider.assignedProducts.reduce(
      (sum, p) => sum + p.totalOrdersShipped,
      0
    );
    const avgShippingDays = provider.assignedProducts.reduce(
      (sum, p) => sum + (p.averageShippingDays || 0) * p.totalOrdersShipped,
      0
    ) / (totalShipped || 1);

    return NextResponse.json({
      analytics: {
        totalOrders,
        pendingOrders,
        shippedOrders,
        deliveredOrders,
        totalProducts: provider.assignedProducts.length,
        totalShipped,
        averageShippingDays: Math.round(avgShippingDays * 10) / 10,
      },
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}
