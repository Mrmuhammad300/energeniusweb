import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { hasPermission } from '@/lib/permissions';
import prisma from '@/lib/db';

export const dynamic = 'force-dynamic';

// GET /api/installer/installations - Get assigned installations
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userRole = (session.user as any).role;
    const userId = (session.user as any).id;

    // Check permissions
    if (!hasPermission(userRole, 'installations:view_assigned')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    // Build filter - only show installations assigned to this installer
    const where: any = {
      assignedInstallerId: userId,
    };

    if (status) {
      where.status = status;
    }

    const installations = await prisma.installation.findMany({
      where,
      include: {
        order: {
          select: {
            id: true,
            orderNumber: true,
          },
        },
        updates: {
          orderBy: { createdAt: 'desc' },
          take: 3,
          include: {
            createdBy: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        messages: {
          where: {
            OR: [
              { senderId: userId },
              { receiverRole: 'installer' },
            ],
          },
          orderBy: { createdAt: 'desc' },
          take: 5,
          include: {
            sender: {
              select: {
                id: true,
                name: true,
                role: true,
              },
            },
          },
        },
      },
      orderBy: [
        { scheduledDate: 'asc' },
        { createdAt: 'desc' },
      ],
    });

    return NextResponse.json({ installations });
  } catch (error: any) {
    console.error('Error fetching installer installations:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
