import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

interface CheckoutRequestBody {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  product: {
    id: string;
    name?: string;
    model?: string;
    sku: string;
    priceNumeric: number;
    imageUrl: string;
  };
  servicePackage: {
    id: string;
    name: string;
    price: number;
    priceMonthly: number | null;
    prerequisites: string[];
  } | null;
  prerequisitesAcknowledged: { [key: string]: boolean };
  termsAccepted: boolean;
}

// Generate unique order number
function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `ORD-${timestamp}-${random}`;
}

export async function POST(request: NextRequest) {
  try {
    const body: CheckoutRequestBody = await request.json();

    // Validate required fields
    if (
      !body.firstName ||
      !body.lastName ||
      !body.email ||
      !body.phone ||
      !body.address ||
      !body.city ||
      !body.state ||
      !body.zipCode ||
      !body.product ||
      !body.termsAccepted
    ) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate prerequisites if service package selected
    if (body.servicePackage && body.servicePackage.prerequisites.length > 0) {
      const allAcknowledged = Object.values(body.prerequisitesAcknowledged).every(
        (val) => val === true
      );
      if (!allAcknowledged) {
        return NextResponse.json(
          { error: 'All prerequisites must be acknowledged' },
          { status: 400 }
        );
      }
    }

    const customerName = `${body.firstName} ${body.lastName}`;
    const fullAddress = body.address;
    
    // Calculate totals
    const productTotal = body.product.priceNumeric;
    const serviceTotal = body.servicePackage?.price || 0;
    const subtotal = productTotal + serviceTotal;
    const taxAmount = 0; // Tax calculation to be implemented based on state
    const totalAmount = subtotal + taxAmount;

    // Create or update customer
    let customer;
    try {
      customer = await prisma.customer.upsert({
        where: { email: body.email },
        update: {
          firstName: body.firstName,
          lastName: body.lastName,
          phone: body.phone,
          shippingAddress: fullAddress,
          shippingCity: body.city,
          shippingState: body.state,
          shippingZip: body.zipCode,
        },
        create: {
          firstName: body.firstName,
          lastName: body.lastName,
          email: body.email,
          phone: body.phone,
          shippingAddress: fullAddress,
          shippingCity: body.city,
          shippingState: body.state,
          shippingZip: body.zipCode,
          billingAddress: fullAddress,
          billingCity: body.city,
          billingState: body.state,
          billingZip: body.zipCode,
        },
      });
    } catch (error) {
      console.error('Error creating/updating customer:', error);
      return NextResponse.json(
        { error: 'Failed to process customer information' },
        { status: 500 }
      );
    }

    // Generate order number
    const orderNumber = generateOrderNumber();

    // Get product name (use 'model' if 'name' is not available)
    const productName = body.product.name || body.product.model || 'Solar Generator';

    // Create Order
    let order;
    try {
      order = await prisma.order.create({
        data: {
          orderNumber,
          customerId: customer.id,
          customerName,
          customerEmail: body.email,
          customerPhone: body.phone,
          shippingAddress: fullAddress,
          shippingCity: body.city,
          shippingState: body.state,
          shippingZip: body.zipCode,
          billingAddress: fullAddress,
          billingCity: body.city,
          billingState: body.state,
          billingZip: body.zipCode,
          subtotal,
          taxAmount,
          totalAmount,
          status: 'pending', // Will be updated after payment
          fulfillmentStatus: 'pending',
          items: {
            create: [
              {
                productSku: body.product.sku,
                productName: productName,
                description: `${productName} - Solar Generator`,
                quantity: 1,
                unitPrice: body.product.priceNumeric,
                totalPrice: body.product.priceNumeric,
                status: 'pending',
              },
            ],
          },
        },
        include: {
          items: true,
        },
      });
    } catch (error) {
      console.error('Error creating order:', error);
      return NextResponse.json(
        { error: 'Failed to create order' },
        { status: 500 }
      );
    }

    // Create Service Purchase if package selected
    let servicePurchase = null;
    if (body.servicePackage) {
      try {
        // Convert prerequisites acknowledgments to array of strings
        const acknowledgedTerms = body.servicePackage.prerequisites.filter(
          (_, index) => body.prerequisitesAcknowledged[`prereq_${index}`] === true
        );

        servicePurchase = await prisma.servicePurchase.create({
          data: {
            servicePackageId: body.servicePackage.id,
            customerId: customer.id,
            customerName,
            customerEmail: body.email,
            customerPhone: body.phone,
            customerAddress: fullAddress,
            purchasePrice: body.servicePackage.price,
            subscriptionMonthly: body.servicePackage.priceMonthly,
            status: 'pending',
            paymentStatus: 'unpaid',
            acknowledgedTerms,
            subscriptionActive: body.servicePackage.priceMonthly ? false : false,
          },
        });
      } catch (error) {
        console.error('Error creating service purchase:', error);
        // Don't fail the entire checkout if service purchase fails
        // The order is already created, we can handle this manually
      }
    }

    // Return success response with order details
    return NextResponse.json(
      {
        success: true,
        orderId: order.id,
        orderNumber: order.orderNumber,
        servicePurchaseId: servicePurchase?.id,
        message: 'Order submitted successfully',
        nextSteps: {
          payment: 'Our team will contact you shortly with payment instructions',
          timeline: body.servicePackage
            ? 'Installation will be scheduled after payment confirmation'
            : 'Product will ship within 2-3 business days after payment',
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      {
        error: 'Failed to process checkout',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
