import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-12-15.clover',
});

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { amount, customerEmail, customerName, orderId } = await request.json();

    // Validate required fields
    if (!amount || !customerEmail) {
      return NextResponse.json(
        { error: 'Amount and customer email are required' },
        { status: 400 }
      );
    }

    // Convert amount to cents for Stripe
    const amountInCents = Math.round(amount * 100);

    console.log('[API] Creating payment intent with amount:', amountInCents, 'cents');
    
    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: 'usd',
      receipt_email: customerEmail,
      metadata: {
        customerName: customerName || '',
        orderId: orderId || '',
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    console.log('[API] Payment intent created:', {
      id: paymentIntent.id,
      status: paymentIntent.status,
      amount: paymentIntent.amount,
      client_secret: paymentIntent.client_secret,
      hasClientSecret: !!paymentIntent.client_secret
    });

    if (!paymentIntent.client_secret) {
      console.error('[API] ERROR: Payment intent created but client_secret is null/undefined!');
      console.error('[API] Full paymentIntent object:', JSON.stringify(paymentIntent, null, 2));
      return NextResponse.json(
        { error: 'Payment intent created but missing client secret. This may indicate a Stripe configuration issue.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error: any) {
    console.error('Error creating payment intent:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create payment intent' },
      { status: 500 }
    );
  }
}
