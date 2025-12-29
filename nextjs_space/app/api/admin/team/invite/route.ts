import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { hasPermission } from '@/lib/permissions';
import { createAuditLog } from '@/lib/audit';
import { UserRole } from '@prisma/client';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

/**
 * POST /api/admin/team/invite
 * Send invitation to new team member
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userRole = (session.user as any).role as UserRole;

    // Check permission
    if (!hasPermission(userRole, 'team:invite')) {
      return NextResponse.json(
        { error: 'You do not have permission to invite team members' },
        { status: 403 }
      );
    }

    const { email, role, message, fulfillmentProvider } = await request.json();

    // Validate inputs
    if (!email || !role) {
      return NextResponse.json(
        { error: 'Email and role are required' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Check if there's already a pending invitation
    const existingInvitation = await prisma.userInvitation.findFirst({
      where: {
        email,
        status: 'pending',
        expiresAt: {
          gt: new Date(),
        },
      },
    });

    if (existingInvitation) {
      return NextResponse.json(
        { error: 'An active invitation already exists for this email' },
        { status: 400 }
      );
    }

    // Generate secure token
    const token = crypto.randomBytes(32).toString('hex');

    // Set expiration to 7 days from now
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    // Create invitation
    const invitation = await prisma.userInvitation.create({
      data: {
        email,
        role: role as UserRole,
        token,
        invitedBy: (session.user as any).id,
        inviterName: session.user.name || session.user.email || 'EnerGenius Admin',
        expiresAt,
        message,
      },
    });

    // Log the action
    await createAuditLog({
      action: 'invited_user',
      actionType: 'create',
      userId: (session.user as any).id,
      targetType: 'UserInvitation',
      targetId: invitation.id,
      targetLabel: email,
      metadata: { role, fulfillmentProvider },
    });

    // TODO: Send email with invitation link
    // const invitationLink = `${process.env.NEXTAUTH_URL}/admin/team/accept-invitation?token=${token}`;

    return NextResponse.json({
      success: true,
      invitation: {
        id: invitation.id,
        email: invitation.email,
        role: invitation.role,
        expiresAt: invitation.expiresAt,
        // Return the token only in development for testing
        ...(process.env.NODE_ENV === 'development' && { token }),
      },
    });
  } catch (error) {
    console.error('Error creating invitation:', error);
    return NextResponse.json(
      { error: 'Failed to create invitation' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/admin/team/invite
 * List all invitations
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userRole = (session.user as any).role as UserRole;

    // Check permission
    if (!hasPermission(userRole, 'team:view')) {
      return NextResponse.json(
        { error: 'You do not have permission to view invitations' },
        { status: 403 }
      );
    }

    const invitations = await prisma.userInvitation.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ invitations });
  } catch (error) {
    console.error('Error fetching invitations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch invitations' },
      { status: 500 }
    );
  }
}
