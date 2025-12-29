import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { hasPermission } from '@/lib/permissions';
import { logAuditAction } from '@/lib/audit';
import prisma from '@/lib/db';

export const dynamic = 'force-dynamic';

// GET /api/admin/installations/[id] - Get installation details
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userRole = (session.user as any).role;

    // Check permissions
    if (!hasPermission(userRole, 'installations:view_all')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const installation = await prisma.installation.findUnique({
      where: { id: params.id },
      include: {
        assignedInstaller: {
          select: {
            id: true,
            name: true,
            email: true,
            installerProfile: {
              select: {
                phone: true,
                companyName: true,
                specialization: true,
                serviceAreas: true,
              },
            },
          },
        },
        order: {
          select: {
            id: true,
            orderNumber: true,
            status: true,
          },
        },
        updates: {
          orderBy: { createdAt: 'desc' },
          include: {
            createdBy: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          include: {
            sender: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true,
              },
            },
          },
        },
      },
    });

    if (!installation) {
      return NextResponse.json(
        { error: 'Installation not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(installation);
  } catch (error: any) {
    console.error('Error fetching installation:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT /api/admin/installations/[id] - Update installation
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userRole = (session.user as any).role;
    const userId = (session.user as any).id;

    // Check permissions
    if (!hasPermission(userRole, 'installations:edit')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const data = await request.json();

    // Check if installation exists
    const existing = await prisma.installation.findUnique({
      where: { id: params.id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Installation not found' },
        { status: 404 }
      );
    }

    // Prepare update data
    const updateData: any = {};

    if (data.title !== undefined) updateData.title = data.title;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.progress !== undefined) updateData.progress = data.progress;
    if (data.priority !== undefined) updateData.priority = data.priority;
    if (data.scheduledDate !== undefined) {
      updateData.scheduledDate = data.scheduledDate ? new Date(data.scheduledDate) : null;
    }
    if (data.estimatedDuration !== undefined) {
      updateData.estimatedDuration = data.estimatedDuration;
    }
    if (data.requiresPermit !== undefined) {
      updateData.requiresPermit = data.requiresPermit;
    }
    if (data.permitNumber !== undefined) {
      updateData.permitNumber = data.permitNumber;
    }
    if (data.internalNotes !== undefined) {
      updateData.internalNotes = data.internalNotes;
    }

    // Update installation
    const installation = await prisma.installation.update({
      where: { id: params.id },
      data: updateData,
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
      action: 'update',
      targetType: 'installation',
      targetId: installation.id,
      details: `Updated installation ${installation.installationNumber}`,
      status: 'success',
    });

    return NextResponse.json(installation);
  } catch (error: any) {
    console.error('Error updating installation:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
