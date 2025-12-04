import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db';

export const dynamic = 'force-dynamic';

// Helper function to replace template variables
function replaceVariables(template: string, data: Record<string, any>): string {
  let result = template;
  
  for (const [key, value] of Object.entries(data)) {
    const regex = new RegExp(`{{${key}}}`, 'g');
    result = result.replace(regex, String(value || ''));
  }
  
  return result;
}

// Helper function to format order items for email
function formatOrderItems(items: any[]): string {
  return items.map(item => 
    `- ${item.quantity}x ${item.productName} (SKU: ${item.productSku}) - $${item.totalPrice.toFixed(2)}`
  ).join('\n');
}

// POST - Generate email for order using template
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { templateName } = await request.json();

    if (!templateName) {
      return NextResponse.json(
        { error: 'Template name is required' },
        { status: 400 }
      );
    }

    // Fetch order with all details
    const order = await prisma.order.findUnique({
      where: { id: params.id },
      include: {
        items: true,
        shipments: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
        },
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Fetch email template
    const template = await prisma.emailTemplate.findUnique({
      where: { name: templateName },
    });

    if (!template) {
      return NextResponse.json(
        { error: 'Email template not found' },
        { status: 404 }
      );
    }

    if (!template.isActive) {
      return NextResponse.json(
        { error: 'Email template is not active' },
        { status: 400 }
      );
    }

    // Prepare data for template variables
    const latestShipment = order.shipments[0];
    const templateData = {
      orderNumber: order.orderNumber,
      orderDate: order.orderDate.toLocaleDateString(),
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      customerPhone: order.customerPhone,
      shippingAddress: order.shippingAddress,
      shippingCity: order.shippingCity,
      shippingState: order.shippingState,
      shippingZip: order.shippingZip,
      shippingCountry: order.shippingCountry,
      billingAddress: order.billingAddress,
      billingCity: order.billingCity,
      billingState: order.billingState,
      billingZip: order.billingZip,
      billingCountry: order.billingCountry,
      items: formatOrderItems(order.items),
      subtotal: `$${order.subtotal.toFixed(2)}`,
      taxAmount: `$${order.taxAmount.toFixed(2)}`,
      totalAmount: `$${order.totalAmount.toFixed(2)}`,
      status: order.status,
      fulfillmentStatus: order.fulfillmentStatus,
      expectedDelivery: order.expectedDelivery?.toLocaleDateString() || 'TBD',
      // Shipment data (if available)
      carrier: latestShipment?.carrier || 'N/A',
      trackingNumber: latestShipment?.trackingNumber || 'N/A',
      trackingUrl: latestShipment?.trackingUrl || 'N/A',
      estimatedDelivery: latestShipment?.estimatedDelivery?.toLocaleDateString() || 'TBD',
    };

    // Generate email content
    const emailSubject = replaceVariables(template.subject, templateData);
    const emailBody = replaceVariables(template.body, templateData);

    return NextResponse.json({
      to: templateName === 'powerx_order_notification' ? 'orders@powerxgenerators.com' : order.customerEmail,
      subject: emailSubject,
      body: emailBody,
      template: template.name,
      category: template.category,
    });
  } catch (error) {
    console.error('Error generating email:', error);
    return NextResponse.json(
      { error: 'Failed to generate email' },
      { status: 500 }
    );
  }
}
