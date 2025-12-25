import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

// Get all support tickets (admin only)
export async function GET(request: Request) {
  try {
    // Check authentication
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');
    const category = searchParams.get('category');

    // Build query
    const where: any = {};

    if (status && status !== 'all') {
      where.status = status;
    }

    if (priority && priority !== 'all') {
      where.priority = priority;
    }

    if (category && category !== 'all') {
      where.category = category;
    }

    // Get tickets
    const tickets = await prisma.supportTicket.findMany({
      where,
      orderBy: [
        { priority: 'desc' },
        { createdAt: 'desc' }
      ],
      take: 200
    });

    return NextResponse.json({ tickets });
  } catch (error) {
    console.error('Error fetching admin tickets:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tickets' },
      { status: 500 }
    );
  }
}

// Update ticket (admin only)
export async function PATCH(request: Request) {
  try {
    // Check authentication
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { ticketId, status, priority, assignedTo, internalNotes, resolution, resolvedBy } = body;

    if (!ticketId) {
      return NextResponse.json(
        { error: 'Ticket ID required' },
        { status: 400 }
      );
    }

    // Build update data
    const updateData: any = {};

    if (status) updateData.status = status;
    if (priority) updateData.priority = priority;
    if (assignedTo !== undefined) updateData.assignedTo = assignedTo;
    if (internalNotes !== undefined) updateData.internalNotes = internalNotes;
    if (resolution !== undefined) updateData.resolution = resolution;
    if (resolvedBy !== undefined) updateData.resolvedBy = resolvedBy;

    if (status === 'resolved' || status === 'closed') {
      updateData.resolvedAt = new Date();
      if (session.user?.name) {
        updateData.resolvedBy = session.user.name;
      }
    }

    // Update ticket
    const ticket = await prisma.supportTicket.update({
      where: { id: ticketId },
      data: updateData
    });

    return NextResponse.json({
      success: true,
      ticket,
      message: 'Ticket updated successfully'
    });
  } catch (error) {
    console.error('Error updating ticket:', error);
    return NextResponse.json(
      { error: 'Failed to update ticket' },
      { status: 500 }
    );
  }
}