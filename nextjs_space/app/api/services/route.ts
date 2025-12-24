import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category'); // residential or commercial
    
    const where: any = {
      isActive: true,
      isPublic: true
    };
    
    if (category) {
      where.category = category;
    }
    
    const packages = await prisma.servicePackage.findMany({
      where,
      orderBy: {
        displayOrder: 'asc'
      }
    });
    
    return NextResponse.json(packages);
  } catch (error) {
    console.error('Error fetching service packages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch service packages' },
      { status: 500 }
    );
  }
}
