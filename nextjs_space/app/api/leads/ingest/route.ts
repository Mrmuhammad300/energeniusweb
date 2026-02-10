import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import type { LeadIngestInput } from '@/lib/engines/types';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as LeadIngestInput;

    if (!body.name || !body.email || !body.source) {
      return NextResponse.json(
        { error: 'name, email, and source are required fields' },
        { status: 400 }
      );
    }

    // Map the lead into a QuoteRequest (existing model) so it appears in the
    // admin CRM pipeline without a schema migration.
    const quoteRequest = await prisma.quoteRequest.create({
      data: {
        name: body.name,
        email: body.email,
        phone: body.phone ?? '',
        location: body.state ?? '',
        projectType: body.customer_type ?? 'residential',
        powerNeeds: body.estimated_watts
          ? `${body.estimated_watts}W estimated`
          : 'Unknown',
        timeline: 'Not specified',
        message: body.notes ?? null,
        status: 'new',
        interestedProducts: body.recommended_sku ? [body.recommended_sku] : [],
        leadSource: body.source,
      },
    });

    return NextResponse.json({
      lead_id: quoteRequest.id,
      status: 'created',
    });
  } catch (error) {
    console.error('[leads/ingest] Error:', error);
    return NextResponse.json(
      { error: 'Failed to ingest lead' },
      { status: 500 }
    );
  }
}
