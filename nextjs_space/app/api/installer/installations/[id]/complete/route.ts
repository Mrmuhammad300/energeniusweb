import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { hasPermission } from '@/lib/permissions';
import prisma from '@/lib/db';

export const dynamic = 'force-dynamic';

// POST /api/installer/installations/[id]/complete - Mark installation as completed
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
    if (!hasPermission(userRole, 'installations:complete')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const data = await request.json();

    // Check if installation exists and is assigned to this installer
    const installation = await prisma.installation.findUnique({
      where: { id: params.id },
      include: {
        assignedInstaller: {
          include: {
            installerProfile: true,
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

    if (installation.assignedInstallerId !== userId) {
      return NextResponse.json(
        { error: 'You are not assigned to this installation' },
        { status: 403 }
      );
    }

    // Update installation to completed
    const completed = await prisma.installation.update({
      where: { id: params.id },
      data: {
        status: 'completed',
        progress: 100,
        completedAt: new Date(),
        actualEndTime: new Date(),
        completionNotes: data.completionNotes || null,
        customerSignature: data.customerSignature || null,
        photoUrls: data.photoUrls || installation.photoUrls,
        documentUrls: data.documentUrls || installation.documentUrls,
      },
    });

    // Create completion update
    await prisma.installationUpdate.create({
      data: {
        installationId: params.id,
        updateType: 'status_change',
        title: 'Installation Completed',
        description: data.completionNotes || 'Installation has been marked as completed',
        oldStatus: installation.status,
        newStatus: 'completed',
        progressPercent: 100,
        photoUrls: data.photoUrls || [],
        documentUrls: data.documentUrls || [],
        createdById: userId,
      },
    });

    // Update installer profile metrics
    if (installation.assignedInstaller?.installerProfile) {
      const profileId = installation.assignedInstaller.installerProfile.id;
      const currentCompleted = installation.assignedInstaller.installerProfile.totalJobsCompleted;
      
      await prisma.installerProfile.update({
        where: { id: profileId },
        data: {
          totalJobsCompleted: currentCompleted + 1,
          availability: 'available', // Make installer available again
        },
      });
    }

    return NextResponse.json(completed);
  } catch (error: any) {
    console.error('Error completing installation:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
