import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { hasPermission } from '@/lib/permissions';
import { UserRole } from '@prisma/client';

export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/fulfillment/orders
 * Get orders assigned to fulfillment provider
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
    if (!hasPermission(userRole, 'fulfillment:view_assigned_orders')) {
      return NextResponse.json(
        { error: 'You do not have permission to view fulfillment orders' },
        { status: 403 }
      );
    }

    if (!fulfillmentProviderId) {
      return NextResponse.json(
        { error: 'No fulfillment provider profile found' },
        { status: 404 }
      );
    }

    // Get assigned products for this provider
    const provider = await prisma.fulfillmentProvider.findUnique({
      where: { id: fulfillmentProviderId },
      include: {
        assignedProducts: {
          where: { isActive: true },
          select: { productSku: true },
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

    // Get orders containing assigned products
    const orders = await prisma.order.findMany({
      where: {
        items: {
          some: {
            productSku: {
              in: assignedSkus,
            },
          },
        },
      },
      include: {
        items: {
          where: {
            productSku: {
              in: assignedSkus,
            },
          },
        },
        shipments: true,
      },
      orderBy: {
        orderDate: 'desc',
      },
    });

    return NextResponse.json({ orders });
  } catch (error) {
    console.error('Error fetching fulfillment orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}
