import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db';

export const dynamic = 'force-dynamic';

// GET all orders
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const fulfillmentStatus = searchParams.get('fulfillmentStatus');
    const search = searchParams.get('search');

    const where: any = {};
    
    if (status && status !== 'all') {
      where.status = status;
    }
    
    if (fulfillmentStatus && fulfillmentStatus !== 'all') {
      where.fulfillmentStatus = fulfillmentStatus;
    }
    
    if (search) {
      where.OR = [
        { orderNumber: { contains: search, mode: 'insensitive' } },
        { customerName: { contains: search, mode: 'insensitive' } },
        { customerEmail: { contains: search, mode: 'insensitive' } },
        { invoiceNumber: { contains: search, mode: 'insensitive' } },
      ];
    }

    const orders = await prisma.order.findMany({
      where,
      include: {
        customer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            company: true,
          },
        },
        items: true,
        shipments: true,
      },
      orderBy: {
        orderDate: 'desc',
      },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

// POST - Create new order (typically from a paid invoice)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();

    // Validate required fields
    if (!data.customerName || !data.customerEmail || !data.customerPhone ||
        !data.shippingAddress || !data.shippingCity || !data.shippingState || !data.shippingZip ||
        !data.billingAddress || !data.billingCity || !data.billingState || !data.billingZip ||
        !data.items || data.items.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // If invoiceId is provided, check if an order already exists for this invoice
    if (data.invoiceId) {
      const existingOrder = await prisma.order.findUnique({
        where: { invoiceId: data.invoiceId },
      });

      if (existingOrder) {
        return NextResponse.json(
          { error: 'Order already exists for this invoice', order: existingOrder },
          { status: 409 }
        );
      }
    }

    // Generate order number
    const orderCount = await prisma.order.count();
    const orderNumber = `ORD-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${String(orderCount + 1).padStart(4, '0')}`;

    // Calculate totals
    const subtotal = data.items.reduce((sum: number, item: any) => sum + item.totalPrice, 0);
    const taxAmount = data.taxAmount || 0;
    const totalAmount = subtotal + taxAmount;

    // Create order with items
    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerId: data.customerId || null,
        invoiceId: data.invoiceId || null,
        invoiceNumber: data.invoiceNumber || null,
        status: data.status || 'pending',
        fulfillmentStatus: 'pending',
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        customerPhone: data.customerPhone,
        shippingAddress: data.shippingAddress,
        shippingCity: data.shippingCity,
        shippingState: data.shippingState,
        shippingZip: data.shippingZip,
        shippingCountry: data.shippingCountry || 'USA',
        billingAddress: data.billingAddress,
        billingCity: data.billingCity,
        billingState: data.billingState,
        billingZip: data.billingZip,
        billingCountry: data.billingCountry || 'USA',
        subtotal,
        taxAmount,
        totalAmount,
        expectedDelivery: data.expectedDelivery ? new Date(data.expectedDelivery) : null,
        customerNotes: data.customerNotes || null,
        internalNotes: data.internalNotes || null,
        items: {
          create: data.items.map((item: any) => ({
            productSku: item.productSku,
            productName: item.productName || item.description,
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.totalPrice,
            status: 'pending',
          })),
        },
      },
      include: {
        items: true,
        shipments: true,
      },
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}

// DELETE - Delete order
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      );
    }

    // Check order status before deletion
    const order = await prisma.order.findUnique({
      where: { id },
      include: { shipments: true },
    });

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    if (order.status === 'shipped' || order.status === 'delivered') {
      return NextResponse.json(
        { error: 'Cannot delete order that has already shipped or been delivered' },
        { status: 400 }
      );
    }

    // Delete order and related items/shipments (cascade)
    await prisma.order.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting order:', error);
    return NextResponse.json(
      { error: 'Failed to delete order' },
      { status: 500 }
    );
  }
}
