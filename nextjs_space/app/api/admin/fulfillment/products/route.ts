import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { hasPermission } from '@/lib/permissions';
import { UserRole } from '@prisma/client';

export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/fulfillment/products
 * Get products assigned to fulfillment provider
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
        { error: 'You do not have permission to view assigned products' },
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
    const assignments = await prisma.fulfillmentProductAssignment.findMany({
      where: {
        fulfillmentProviderId,
        isActive: true,
      },
    });

    // Get full product details
    const products = await prisma.product.findMany({
      where: {
        sku: {
          in: assignments.map((a) => a.productSku),
        },
      },
    });

    // Merge assignment data with product data
    const enrichedProducts = products.map((product) => {
      const assignment = assignments.find((a) => a.productSku === product.sku);
      return {
        ...product,
        assignment: {
          totalOrdersShipped: assignment?.totalOrdersShipped || 0,
          averageShippingDays: assignment?.averageShippingDays || null,
          lastShipmentDate: assignment?.lastShipmentDate || null,
        },
      };
    });

    return NextResponse.json({ products: enrichedProducts });
  } catch (error) {
    console.error('Error fetching assigned products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}
