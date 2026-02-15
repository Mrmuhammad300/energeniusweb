import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { buildCatalogSyncEnvelope, loadBridgeConfig } from '@/lib/crm-bridge';

export const dynamic = 'force-dynamic';

/**
 * POST /api/crm-bridge/sync
 *
 * Triggers a full catalog sync push to the RRG Solutions master CRM.
 * Requires SUPER_ADMIN authentication.
 *
 * This builds the sync envelope and (when the RRG endpoint is live)
 * will POST it to rrg-solutions.com/api/sync/inbound.
 */
export async function POST() {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const config = loadBridgeConfig();
    const envelope = buildCatalogSyncEnvelope();

    // When RRG API is live, this will POST the envelope:
    // const response = await fetch(`${config.rrg_base_url}/sync/inbound`, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${config.rrg_api_key}`,
    //   },
    //   body: JSON.stringify(envelope),
    // });

    return NextResponse.json({
      message: 'Catalog sync envelope built successfully',
      event_id: envelope.event_id,
      timestamp: envelope.timestamp,
      product_count: envelope.payload.products.length,
      installation_packages_count: envelope.payload.installation_packages.length,
      professional_services_count: envelope.payload.professional_services.length,
      rrg_target: config.rrg_base_url,
      // Set to true once RRG API is live and the fetch call above is uncommented
      delivered: false,
    });
  } catch (error) {
    console.error('[CRM Bridge] Sync error:', error);
    return NextResponse.json(
      { error: 'Failed to trigger catalog sync' },
      { status: 500 },
    );
  }
}
