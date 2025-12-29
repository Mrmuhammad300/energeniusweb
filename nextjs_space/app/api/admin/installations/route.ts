import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { hasPermission } from '@/lib/permissions';
import { logAuditAction } from '@/lib/audit';
import prisma from '@/lib/db';

export const dynamic = 'force-dynamic';

// GET /api/admin/installations - List all installations
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userRole = (session.user as any).role;
    const userId = (session.user as any).id;

    // Check permissions
    if (!hasPermission(userRole, 'installations:view_all')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const assignedInstallerId = searchParams.get('assignedInstallerId');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const skip = (page - 1) * limit;

    // Build filter
    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (assignedInstallerId) {
      where.assignedInstallerId = assignedInstallerId;
    }

    // For sales reps, show installations they created
    if (userRole === 'SALES_REP') {
      where.assignedBy = userId;
    }

    const [installations, total] = await Promise.all([
      prisma.installation.findMany({
        where,
        include: {
          assignedInstaller: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          order: {
            select: {
              id: true,
              orderNumber: true,
            },
          },
          updates: {
            orderBy: { createdAt: 'desc' },
            take: 1,
          },
          messages: {
            where: { isRead: false },
            select: { id: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.installation.count({ where }),
    ]);

    return NextResponse.json({
      installations,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error('Error fetching installations:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/admin/installations - Create new installation
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userRole = (session.user as any).role;
    const userId = (session.user as any).id;

    // Check permissions
    if (!hasPermission(userRole, 'installations:create')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const data = await request.json();

    // Validate required fields
    if (
      !data.title ||
      !data.description ||
      !data.customerName ||
      !data.customerEmail ||
      !data.customerPhone ||
      !data.installationAddress ||
      !data.products ||
      !data.productNames ||
      !data.jobType
    ) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Generate installation number
    const date = new Date();
    const dateStr = date.toISOString().split('T')[0].replace(/-/g, '');
    const count = await prisma.installation.count({
      where: {
        installationNumber: {
          startsWith: `INS-${dateStr}`,
        },
      },
    });
    const installationNumber = `INS-${dateStr}-${String(count + 1).padStart(4, '0')}`;

    // Create installation
    const installation = await prisma.installation.create({
      data: {
        installationNumber,
        title: data.title,
        description: data.description,
        orderId: data.orderId || null,
        invoiceId: data.invoiceId || null,
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        customerPhone: data.customerPhone,
        installationAddress: data.installationAddress,
        products: data.products,
        productNames: data.productNames,
        assignedBy: userId,
        scheduledDate: data.scheduledDate ? new Date(data.scheduledDate) : null,
        estimatedDuration: data.estimatedDuration || null,
        priority: data.priority || 'normal',
        jobType: data.jobType,
        requiresPermit: data.requiresPermit || false,
        permitNumber: data.permitNumber || null,
        internalNotes: data.internalNotes || null,
      },
      include: {
        assignedInstaller: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    // Log audit
    await logAuditAction({
      userId,
      action: 'create',
      targetType: 'installation',
      targetId: installation.id,
      details: `Created installation ${installationNumber}`,
      status: 'success',
    });

    return NextResponse.json(installation, { status: 201 });
  } catch (error: any) {
    console.error('Error creating installation:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
