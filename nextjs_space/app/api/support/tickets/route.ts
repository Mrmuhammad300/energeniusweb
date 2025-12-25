import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

// Generate unique ticket number
function generateTicketNumber(): string {
  const prefix = 'TKT';
  const timestamp = Date.now().toString().slice(-8);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `${prefix}-${timestamp}-${random}`;
}

// Create new support ticket
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      subject,
      category,
      priority,
      customerName,
      customerEmail,
      customerPhone,
      description,
      orderNumber,
      productSku
    } = body;

    // Validation
    if (!subject || !customerName || !customerEmail || !description) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Generate ticket number
    const ticketNumber = generateTicketNumber();

    // Create ticket
    const ticket = await prisma.supportTicket.create({
      data: {
        ticketNumber,
        subject,
        category: category || 'general',
        priority: priority || 'medium',
        customerName,
        customerEmail,
        customerPhone,
        description,
        orderNumber,
        productSku,
        status: 'open'
      }
    });

    return NextResponse.json({
      success: true,
      ticket: {
        id: ticket.id,
        ticketNumber: ticket.ticketNumber,
        status: ticket.status
      },
      message: 'Support ticket created successfully'
    });
  } catch (error) {
    console.error('Error creating support ticket:', error);
    return NextResponse.json(
      { error: 'Failed to create support ticket' },
      { status: 500 }
    );
  }
}

// Get tickets by email
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const ticketNumber = searchParams.get('ticketNumber');

    if (ticketNumber) {
      // Get specific ticket by number
      const ticket = await prisma.supportTicket.findUnique({
        where: { ticketNumber },
        include: {
          replies: {
            orderBy: { createdAt: 'asc' },
            where: { isInternal: false } // Only show non-internal replies to customers
          }
        }
      });

      if (!ticket) {
        return NextResponse.json(
          { error: 'Ticket not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({ ticket });
    }

    if (email) {
      // Get all tickets for this email
      const tickets = await prisma.supportTicket.findMany({
        where: { customerEmail: email },
        orderBy: { createdAt: 'desc' },
        take: 50
      });

      return NextResponse.json({ tickets });
    }

    return NextResponse.json(
      { error: 'Email or ticket number required' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error fetching tickets:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tickets' },
      { status: 500 }
    );
  }
}