import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { hasPermission } from '@/lib/permissions';
import { logAuditAction } from '@/lib/audit';
import prisma from '@/lib/db';

export const dynamic = 'force-dynamic';

// POST /api/admin/installations/[id]/assign - Assign installer to job
export async function POST(
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
    if (!hasPermission(userRole, 'installations:assign_installer')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { installerId } = await request.json();

    if (!installerId) {
      return NextResponse.json(
        { error: 'Installer ID is required' },
        { status: 400 }
      );
    }

    // Check if installation exists
    const installation = await prisma.installation.findUnique({
      where: { id: params.id },
    });

    if (!installation) {
      return NextResponse.json(
        { error: 'Installation not found' },
        { status: 404 }
      );
    }

    // Check if installer exists and has INSTALLER role
    const installer = await prisma.user.findUnique({
      where: { id: installerId },
      include: {
        installerProfile: true,
      },
    });

    if (!installer || installer.role !== 'INSTALLER') {
      return NextResponse.json(
        { error: 'Invalid installer' },
        { status: 400 }
      );
    }

    // Check if installer is available
    if (installer.installerProfile?.availability === 'off_duty') {
      return NextResponse.json(
        { error: 'Installer is currently off duty' },
        { status: 400 }
      );
    }

    // Assign installer
    const updated = await prisma.installation.update({
      where: { id: params.id },
      data: {
        assignedInstallerId: installerId,
        assignedAt: new Date(),
        status: 'assigned',
      },
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
              },
            },
          },
        },
      },
    });

    // Create installation update
    await prisma.installationUpdate.create({
      data: {
        installationId: params.id,
        updateType: 'status_change',
        title: 'Installer Assigned',
        description: `Installer ${installer.name} has been assigned to this installation`,
        oldStatus: installation.status,
        newStatus: 'assigned',
        createdById: userId,
      },
    });

    // Log audit
    await logAuditAction({
      userId,
      action: 'update',
      targetType: 'installation',
      targetId: installation.id,
      details: `Assigned installer ${installer.name} to installation ${installation.installationNumber}`,
      status: 'success',
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error('Error assigning installer:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
