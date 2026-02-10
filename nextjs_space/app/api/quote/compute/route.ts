import { NextResponse } from 'next/server';
import { buildQuote } from '@/lib/engines/pricing';
import { isEnabled } from '@/lib/engines/feature-flags';
import type { QuoteBuildInput } from '@/lib/engines/types';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    if (!isEnabled('ENABLE_QUOTE_BUILDER')) {
      return NextResponse.json(
        { error: 'Quote builder is not yet enabled. Set FF_ENABLE_QUOTE_BUILDER=true to activate.' },
        { status: 403 }
      );
    }

    const body = (await request.json()) as QuoteBuildInput;

    if (!body.selected_lines || body.selected_lines.length === 0) {
      return NextResponse.json(
        { error: 'selected_lines[] is required and must not be empty' },
        { status: 400 }
      );
    }

    if (!body.actor?.role_id || !body.actor?.actor_id) {
      return NextResponse.json(
        { error: 'actor.role_id and actor.actor_id are required' },
        { status: 400 }
      );
    }

    const result = buildQuote(body);
    return NextResponse.json(result);
  } catch (error) {
    console.error('[quote/compute] Error:', error);
    return NextResponse.json(
      { error: 'Failed to build quote' },
      { status: 500 }
    );
  }
}
