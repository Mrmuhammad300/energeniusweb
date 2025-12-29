import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { hasPermission } from '@/lib/permissions';
import prisma from '@/lib/db';

export const dynamic = 'force-dynamic';

// POST /api/installer/installations/[id]/update - Submit progress update
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
    if (!hasPermission(userRole, 'installations:update_progress')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const data = await request.json();

    // Validate required fields
    if (!data.title || !data.description) {
      return NextResponse.json(
        { error: 'Title and description are required' },
        { status: 400 }
      );
    }

    // Check if installation exists and is assigned to this installer
    const installation = await prisma.installation.findUnique({
      where: { id: params.id },
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

    // Create update
    const update = await prisma.installationUpdate.create({
      data: {
        installationId: params.id,
        updateType: data.updateType || 'progress',
        title: data.title,
        description: data.description,
        oldStatus: data.oldStatus || null,
        newStatus: data.newStatus || null,
        progressPercent: data.progressPercent || null,
        photoUrls: data.photoUrls || [],
        documentUrls: data.documentUrls || [],
        latitude: data.latitude || null,
        longitude: data.longitude || null,
        createdById: userId,
      },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    // Update installation if status or progress changed
    const installationUpdate: any = {};
    if (data.newStatus) {
      installationUpdate.status = data.newStatus;
      if (data.newStatus === 'in_progress' && !installation.actualStartTime) {
        installationUpdate.actualStartTime = new Date();
      }
    }
    if (data.progressPercent !== undefined) {
      installationUpdate.progress = data.progressPercent;
    }
    if (data.hasIssues !== undefined) {
      installationUpdate.hasIssues = data.hasIssues;
      if (data.issueDescription) {
        installationUpdate.issueDescription = data.issueDescription;
      }
    }

    if (Object.keys(installationUpdate).length > 0) {
      await prisma.installation.update({
        where: { id: params.id },
        data: installationUpdate,
      });
    }

    return NextResponse.json(update, { status: 201 });
  } catch (error: any) {
    console.error('Error creating installation update:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
