import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const invoice = await prisma.invoice.findUnique({
      where: { id: params.id },
      include: {
        items: true,
        quoteRequest: true,
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!invoice) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }

    return NextResponse.json(invoice);
  } catch (error) {
    console.error('Failed to fetch invoice:', error);
    return NextResponse.json(
      { error: 'Failed to fetch invoice' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();

    // Check if this is a full invoice edit (has items) or just payment status update
    if (data.items && Array.isArray(data.items)) {
      // Full invoice edit - update all fields including line items
      
      // Delete existing line items
      await prisma.invoiceItem.deleteMany({
        where: { invoiceId: params.id },
      });

      // Update invoice with new data and create new line items
      const invoice = await prisma.invoice.update({
        where: { id: params.id },
        data: {
          customerName: data.customerName,
          customerEmail: data.customerEmail,
          customerPhone: data.customerPhone,
          customerAddress: data.customerAddress || null,
          status: data.status,
          subtotal: data.subtotal,
          taxRate: data.taxRate,
          taxAmount: data.taxAmount,
          totalAmount: data.totalAmount,
          depositAmount: data.depositAmount || null,
          invoiceDate: data.invoiceDate ? new Date(data.invoiceDate) : undefined,
          dueDate: data.dueDate ? new Date(data.dueDate) : null,
          notes: data.notes || null,
          internalNotes: data.internalNotes || null,
          items: {
            create: data.items.map((item: any) => ({
              productSku: item.productSku || null,
              description: item.description,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              totalPrice: item.totalPrice,
            })),
          },
        },
        include: {
          items: true,
          quoteRequest: true,
        },
      });

      return NextResponse.json(invoice);
    } else {
      // Payment status update only
      const invoice = await prisma.invoice.update({
        where: { id: params.id },
        data: {
          status: data.status,
          depositPaid: data.depositPaid,
          depositPaidAt: data.depositPaidAt ? new Date(data.depositPaidAt) : null,
          balancePaid: data.balancePaid,
          balancePaidAt: data.balancePaidAt ? new Date(data.balancePaidAt) : null,
          paymentMethod: data.paymentMethod,
          paymentNotes: data.paymentNotes,
        },
        include: {
          items: true,
          quoteRequest: true,
        },
      });

      return NextResponse.json(invoice);
    }
  } catch (error) {
    console.error('Failed to update invoice:', error);
    return NextResponse.json(
      { error: 'Failed to update invoice' },
      { status: 500 }
    );
  }
}
