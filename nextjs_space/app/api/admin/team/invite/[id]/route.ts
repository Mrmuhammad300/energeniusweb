import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { hasPermission } from '@/lib/permissions';
import { createAuditLog } from '@/lib/audit';
import { UserRole } from '@prisma/client';

export const dynamic = 'force-dynamic';

/**
 * DELETE /api/admin/team/invite/[id]
 * Cancel invitation
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
    if (!hasPermission(userRole, 'team:invite')) {
      return NextResponse.json(
        { error: 'You do not have permission to cancel invitations' },
        { status: 403 }
      );
    }

    const invitation = await prisma.userInvitation.findUnique({
      where: { id: params.id },
    });

    if (!invitation) {
      return NextResponse.json(
        { error: 'Invitation not found' },
        { status: 404 }
      );
    }

    await prisma.userInvitation.update({
      where: { id: params.id },
      data: { status: 'cancelled' },
    });

    // Log the action
    await createAuditLog({
      action: 'deleted_user',
      actionType: 'delete',
      userId: (session.user as any).id,
      targetType: 'UserInvitation',
      targetId: params.id,
      targetLabel: invitation.email,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error cancelling invitation:', error);
    return NextResponse.json(
      { error: 'Failed to cancel invitation' },
      { status: 500 }
    );
  }
}
