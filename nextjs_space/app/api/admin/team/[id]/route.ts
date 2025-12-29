import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { hasPermission } from '@/lib/permissions';
import { createAuditLog } from '@/lib/audit';
import { UserRole } from '@prisma/client';

export const dynamic = 'force-dynamic';

/**
 * PUT /api/admin/team/[id]
 * Update team member
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userRole = (session.user as any).role as UserRole;

    // Check permission
    if (!hasPermission(userRole, 'team:edit')) {
      return NextResponse.json(
        { error: 'You do not have permission to edit team members' },
        { status: 403 }
      );
    }

    const { role, isActive, teamId } = await request.json();

    // Prevent self-demotion
    if (params.id === (session.user as any).id && role !== userRole) {
      return NextResponse.json(
        { error: 'You cannot change your own role' },
        { status: 400 }
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id: params.id },
      data: {
        ...(role && { role }),
        ...(typeof isActive === 'boolean' && { isActive }),
        ...(teamId !== undefined && { teamId }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
      },
    });

    // Log the action
    await createAuditLog({
      action: 'updated_user_role',
      actionType: 'update',
      userId: (session.user as any).id,
      targetType: 'User',
      targetId: params.id,
      targetLabel: updatedUser.email,
      metadata: { role, isActive },
    });

    return NextResponse.json({ user: updatedUser });
  } catch (error) {
    console.error('Error updating team member:', error);
    return NextResponse.json(
      { error: 'Failed to update team member' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/team/[id]
 * Deactivate team member
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userRole = (session.user as any).role as UserRole;

    // Check permission
    if (!hasPermission(userRole, 'team:delete')) {
      return NextResponse.json(
        { error: 'You do not have permission to delete team members' },
        { status: 403 }
      );
    }

    // Prevent self-deletion
    if (params.id === (session.user as any).id) {
      return NextResponse.json(
        { error: 'You cannot delete your own account' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: params.id },
      select: { email: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Deactivate instead of deleting
    await prisma.user.update({
      where: { id: params.id },
      data: { isActive: false },
    });

    // Log the action
    await createAuditLog({
      action: 'deleted_user',
      actionType: 'delete',
      userId: (session.user as any).id,
      targetType: 'User',
      targetId: params.id,
      targetLabel: user.email,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting team member:', error);
    return NextResponse.json(
      { error: 'Failed to delete team member' },
      { status: 500 }
    );
  }
}
