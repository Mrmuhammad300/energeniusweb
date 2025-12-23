import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-12-15.clover',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature')!;

    let event: Stripe.Event;

    try {
      // Verify webhook signature
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
      console.error('⚠️  Webhook signature verification failed:', err.message);
      return NextResponse.json(
        { error: `Webhook Error: ${err.message}` },
        { status: 400 }
      );
    }

    console.log('✅ Webhook event received:', event.type);

    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session);
        break;

      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent);
        break;

      case 'payment_intent.payment_failed':
        await handlePaymentIntentFailed(event.data.object as Stripe.PaymentIntent);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: error.message || 'Webhook processing failed' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  try {
    const metadata = session.metadata;
    if (!metadata || !metadata.paymentId || !metadata.invoiceId) {
      console.error('Missing metadata in checkout session');
      return;
    }

    const { paymentId, invoiceId, paymentType } = metadata;

    // Retrieve payment intent for detailed information
    const paymentIntent = await stripe.paymentIntents.retrieve(
      session.payment_intent as string,
      { expand: ['latest_charge'] }
    );

    // Extract payment method details from the latest charge
    let paymentMethodDetails: any = {};
    if (paymentIntent.latest_charge && typeof paymentIntent.latest_charge === 'object') {
      const charge = paymentIntent.latest_charge as Stripe.Charge;
      paymentMethodDetails = charge.payment_method_details;
    }

    // Update payment record
    await prisma.payment.update({
      where: { id: paymentId },
      data: {
        status: 'succeeded',
        stripePaymentIntentId: session.payment_intent as string,
        paymentMethod: paymentMethodDetails?.card ? 'card' : paymentMethodDetails?.type || 'unknown',
        last4: paymentMethodDetails?.card?.last4 || null,
        brand: paymentMethodDetails?.card?.brand || null,
        paidAt: new Date(),
        stripeMetadata: JSON.stringify(session),
      },
    });

    // Update invoice payment status
    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId },
    });

    if (invoice) {
      const updateData: any = {};

      if (paymentType === 'deposit') {
        updateData.depositPaid = true;
        updateData.depositPaidAt = new Date();
        updateData.paymentMethod = paymentMethodDetails?.card?.brand || 'card';
        updateData.status = 'sent'; // Deposit paid, awaiting balance
      } else if (paymentType === 'balance') {
        updateData.balancePaid = true;
        updateData.balancePaidAt = new Date();
        updateData.status = 'paid'; // Fully paid
      } else if (paymentType === 'full_payment') {
        updateData.depositPaid = true;
        updateData.depositPaidAt = new Date();
        updateData.balancePaid = true;
        updateData.balancePaidAt = new Date();
        updateData.paymentMethod = paymentMethodDetails?.card?.brand || 'card';
        updateData.status = 'paid'; // Fully paid
      }

      await prisma.invoice.update({
        where: { id: invoiceId },
        data: updateData,
      });
    }

    console.log('✅ Payment processed successfully:', paymentId);
  } catch (error) {
    console.error('Error handling checkout session completed:', error);
    throw error;
  }
}

async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  try {
    // Find payment by payment intent ID
    const payment = await prisma.payment.findFirst({
      where: { stripePaymentIntentId: paymentIntent.id },
    });

    if (!payment) {
      console.log('Payment not found for payment intent:', paymentIntent.id);
      return;
    }

    // Retrieve the full payment intent with charges expanded
    const fullPaymentIntent = await stripe.paymentIntents.retrieve(
      paymentIntent.id,
      { expand: ['latest_charge'] }
    );

    // Extract payment method details from the latest charge
    let paymentMethodDetails: any = {};
    if (fullPaymentIntent.latest_charge && typeof fullPaymentIntent.latest_charge === 'object') {
      const charge = fullPaymentIntent.latest_charge as Stripe.Charge;
      paymentMethodDetails = charge.payment_method_details;
    }

    // Update payment record
    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: 'succeeded',
        paymentMethod: paymentMethodDetails?.card ? 'card' : paymentMethodDetails?.type || 'unknown',
        last4: paymentMethodDetails?.card?.last4 || null,
        brand: paymentMethodDetails?.card?.brand || null,
        paidAt: new Date(),
        stripeMetadata: JSON.stringify(paymentIntent),
      },
    });

    console.log('✅ Payment intent succeeded:', paymentIntent.id);
  } catch (error) {
    console.error('Error handling payment intent succeeded:', error);
    throw error;
  }
}

async function handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
  try {
    // Find payment by payment intent ID
    const payment = await prisma.payment.findFirst({
      where: { stripePaymentIntentId: paymentIntent.id },
    });

    if (!payment) {
      console.log('Payment not found for payment intent:', paymentIntent.id);
      return;
    }

    // Update payment record
    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: 'failed',
        failedAt: new Date(),
        stripeMetadata: JSON.stringify(paymentIntent),
      },
    });

    console.log('❌ Payment intent failed:', paymentIntent.id);
  } catch (error) {
    console.error('Error handling payment intent failed:', error);
    throw error;
  }
}
