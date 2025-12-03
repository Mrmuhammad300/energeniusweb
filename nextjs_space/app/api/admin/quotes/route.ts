import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const where = status && status !== 'all' ? { status } : {};

    const quotes = await prisma.quoteRequest.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        invoices: {
          select: {
            id: true,
            invoiceNumber: true,
            status: true,
          },
        },
      },
    });

    return NextResponse.json(quotes);
  } catch (error) {
    console.error('Failed to fetch quotes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch quotes' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const { id, ...updateData } = data;

    if (!id) {
      return NextResponse.json(
        { error: 'Quote ID is required' },
        { status: 400 }
      );
    }

    // Only update fields that are provided
    const fieldsToUpdate: any = {};
    const allowedFields = ['name', 'email', 'phone', 'location', 'projectType', 'powerNeeds', 'timeline', 'message', 'status'];
    
    for (const field of allowedFields) {
      if (updateData[field] !== undefined) {
        fieldsToUpdate[field] = updateData[field];
      }
    }

    const quote = await prisma.quoteRequest.update({
      where: { id },
      data: fieldsToUpdate,
    });

    return NextResponse.json(quote);
  } catch (error) {
    console.error('Failed to update quote:', error);
    return NextResponse.json(
      { error: 'Failed to update quote' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Quote ID is required' },
        { status: 400 }
      );
    }

    // Check if there are any invoices linked to this quote
    const quote = await prisma.quoteRequest.findUnique({
      where: { id },
      include: { invoices: true },
    });

    if (!quote) {
      return NextResponse.json(
        { error: 'Quote not found' },
        { status: 404 }
      );
    }

    if (quote.invoices && quote.invoices.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete quote with linked invoices. Delete invoices first.' },
        { status: 400 }
      );
    }

    await prisma.quoteRequest.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Quote deleted successfully' });
  } catch (error) {
    console.error('Failed to delete quote:', error);
    return NextResponse.json(
      { error: 'Failed to delete quote' },
      { status: 500 }
    );
  }
}
