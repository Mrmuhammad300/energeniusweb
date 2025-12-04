import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db';

export const dynamic = 'force-dynamic';

// GET single team member by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const teamMember = await prisma.teamMember.findUnique({
      where: { id: params.id },
      include: {
        user: {
          select: {
            email: true,
            name: true,
            role: true,
          },
        },
      },
    });

    if (!teamMember) {
      return NextResponse.json(
        { error: 'Team member not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(teamMember);
  } catch (error) {
    console.error('Error fetching team member:', error);
    return NextResponse.json(
      { error: 'Failed to fetch team member' },
      { status: 500 }
    );
  }
}

// PATCH - Update team member
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only admins can update team members
    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email! },
    });

    if (currentUser?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const data = await request.json();

    // Check if team member exists
    const existingMember = await prisma.teamMember.findUnique({
      where: { id: params.id },
    });

    if (!existingMember) {
      return NextResponse.json(
        { error: 'Team member not found' },
        { status: 404 }
      );
    }

    // If email is being changed, check if new email is already in use
    if (data.email && data.email !== existingMember.email) {
      const emailExists = await prisma.teamMember.findUnique({
        where: { email: data.email },
      });

      if (emailExists) {
        return NextResponse.json(
          { error: 'Email already in use by another team member' },
          { status: 409 }
        );
      }
    }

    const teamMember = await prisma.teamMember.update({
      where: { id: params.id },
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        role: data.role,
        department: data.department,
        status: data.status,
        hireDate: data.hireDate ? new Date(data.hireDate) : existingMember.hireDate,
        terminationDate: data.terminationDate ? new Date(data.terminationDate) : null,
        notes: data.notes,
      },
    });

    return NextResponse.json(teamMember);
  } catch (error) {
    console.error('Error updating team member:', error);
    return NextResponse.json(
      { error: 'Failed to update team member' },
      { status: 500 }
    );
  }
}
