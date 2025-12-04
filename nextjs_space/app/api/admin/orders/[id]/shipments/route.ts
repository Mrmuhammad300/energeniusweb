import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db';

export const dynamic = 'force-dynamic';

// POST - Add shipment to order
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();

    // Validate required fields
    if (!data.carrier || !data.trackingNumber) {
      return NextResponse.json(
        { error: 'Carrier and tracking number are required' },
        { status: 400 }
      );
    }

    // Check if order exists
    const order = await prisma.order.findUnique({
      where: { id: params.id },
    });

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Create shipment
    const shipment = await prisma.shipment.create({
      data: {
        orderId: params.id,
        carrier: data.carrier,
        trackingNumber: data.trackingNumber,
        trackingUrl: data.trackingUrl || null,
        status: data.status || 'pending',
        shippedDate: data.shippedDate ? new Date(data.shippedDate) : null,
        estimatedDelivery: data.estimatedDelivery ? new Date(data.estimatedDelivery) : null,
        weight: data.weight || null,
        dimensions: data.dimensions || null,
        packageCount: data.packageCount || 1,
        notes: data.notes || null,
      },
    });

    // Update order fulfillment status to 'shipped' if not already
    if (order.fulfillmentStatus === 'pending' || order.fulfillmentStatus === 'processing') {
      await prisma.order.update({
        where: { id: params.id },
        data: {
          fulfillmentStatus: 'shipped',
          status: 'shipped',
        },
      });
    }

    return NextResponse.json(shipment, { status: 201 });
  } catch (error) {
    console.error('Error creating shipment:', error);
    return NextResponse.json(
      { error: 'Failed to create shipment' },
      { status: 500 }
    );
  }
}

// GET all shipments for an order
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const shipments = await prisma.shipment.findMany({
      where: { orderId: params.id },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(shipments);
  } catch (error) {
    console.error('Error fetching shipments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch shipments' },
      { status: 500 }
    );
  }
}
