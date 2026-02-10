import { NextResponse } from 'next/server';
import {
  verifyWebhookSignature,
  buildSyncAck,
  loadBridgeConfig,
} from '@/lib/crm-bridge';
import type { SyncEnvelope } from '@/lib/crm-bridge';

export const dynamic = 'force-dynamic';

/**
 * POST /api/crm-bridge/webhook
 *
 * Receives inbound sync events from the RRG Solutions master CRM.
 * Verifies HMAC-SHA256 signature before processing.
 *
 * Headers:
 *   X-RRG-Signature: <hex-encoded HMAC-SHA256 of the raw body>
 *
 * Body: SyncEnvelope<T>
 */
export async function POST(request: Request) {
  try {
    const config = loadBridgeConfig();
    const signature = request.headers.get('x-rrg-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing X-RRG-Signature header' },
        { status: 401 },
      );
    }

    const rawBody = await request.text();

    if (config.webhook_secret) {
      const valid = await verifyWebhookSignature(rawBody, signature, config.webhook_secret);
      if (!valid) {
        return NextResponse.json(
          { error: 'Invalid signature' },
          { status: 401 },
        );
      }
    }

    const envelope: SyncEnvelope = JSON.parse(rawBody);

    // Validate envelope structure
    if (!envelope.event_id || !envelope.entity_type || !envelope.action || !envelope.payload) {
      return NextResponse.json(
        buildSyncAck(envelope.event_id ?? 'unknown', 'rejected', undefined, 'Invalid envelope structure'),
        { status: 400 },
      );
    }

    // Route to entity-specific handlers
    // TODO: Implement entity-specific processing once RRG API spec is finalized
    console.log(`[CRM Bridge] Received ${envelope.action} for ${envelope.entity_type} from ${envelope.source}`, {
      event_id: envelope.event_id,
      entity_type: envelope.entity_type,
      action: envelope.action,
    });

    const ack = buildSyncAck(
      envelope.event_id,
      'accepted',
      undefined,
      `Received ${envelope.entity_type} ${envelope.action}`,
    );

    return NextResponse.json(ack);
  } catch (error) {
    console.error('[CRM Bridge] Webhook error:', error);
    return NextResponse.json(
      { error: 'Failed to process webhook' },
      { status: 500 },
    );
  }
}
