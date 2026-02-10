import { NextResponse } from 'next/server';
import { computeAssessment } from '@/lib/engines/assessment';
import type { AssessmentInput } from '@/lib/engines/types';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as AssessmentInput;

    if (!body.method) {
      return NextResponse.json(
        { error: 'method is required (sqft | acreage | devices | direct)' },
        { status: 400 }
      );
    }

    const result = computeAssessment(body);
    return NextResponse.json(result);
  } catch (error) {
    console.error('[assessment/compute] Error:', error);
    return NextResponse.json(
      { error: 'Failed to compute assessment' },
      { status: 500 }
    );
  }
}
