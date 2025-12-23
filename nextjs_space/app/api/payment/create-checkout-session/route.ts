import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-12-15.clover',
});

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { invoiceId, paymentType } = await request.json();

    // Validate required fields
    if (!invoiceId || !paymentType) {
      return NextResponse.json(
        { error: 'Invoice ID and payment type are required' },
        { status: 400 }
      );
    }

    // Fetch invoice details
    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId },
      include: { items: true },
    });

    if (!invoice) {
      return NextResponse.json(
        { error: 'Invoice not found' },
        { status: 404 }
      );
    }

    // Calculate payment amount based on payment type
    let amount: number;
    let description: string;

    if (paymentType === 'deposit' && invoice.depositAmount) {
      amount = invoice.depositAmount;
      description = `Deposit payment for Invoice #${invoice.invoiceNumber}`;
    } else if (paymentType === 'balance') {
      const depositPaidAmount = invoice.depositAmount || 0;
      amount = invoice.totalAmount - depositPaidAmount;
      description = `Balance payment for Invoice #${invoice.invoiceNumber}`;
    } else if (paymentType === 'full_payment') {
      amount = invoice.totalAmount;
      description = `Full payment for Invoice #${invoice.invoiceNumber}`;
    } else {
      return NextResponse.json(
        { error: 'Invalid payment type' },
        { status: 400 }
      );
    }

    // Convert amount to cents for Stripe
    const amountInCents = Math.round(amount * 100);

    // Get dynamic origin from request headers
    const origin = request.headers.get('origin') || 'http://localhost:3000';

    // Create payment record in database
    const payment = await prisma.payment.create({
      data: {
        invoiceId,
        amount,
        currency: 'usd',
        status: 'pending',
        paymentType,
        customerEmail: invoice.customerEmail,
        customerName: invoice.customerName,
        description,
      },
    });

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: description,
              description: `Customer: ${invoice.customerName}`,
            },
            unit_amount: amountInCents,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${origin}/admin/invoices/${invoiceId}?payment_success=true`,
      cancel_url: `${origin}/admin/invoices/${invoiceId}?payment_cancelled=true`,
      customer_email: invoice.customerEmail,
      metadata: {
        invoiceId,
        invoiceNumber: invoice.invoiceNumber,
        paymentId: payment.id,
        paymentType,
      },
    });

    // Update payment record with Stripe session ID
    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        stripeCheckoutSessionId: session.id,
        stripePaymentIntentId: session.payment_intent as string,
      },
    });

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    });
  } catch (error: any) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create checkout session' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
