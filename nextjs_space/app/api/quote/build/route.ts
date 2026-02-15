import { NextResponse } from 'next/server';
import {
  buildLineItem,
  computeQuoteTotals,
  computeCommission,
  evaluateApproval,
} from '@/lib/product-schema';
import type { QuoteLineItem } from '@/lib/product-schema';

export const dynamic = 'force-dynamic';

/**
 * POST /api/quote/build
 *
 * Builds a quote from a list of SKUs, computes totals, ITC savings,
 * commission, and evaluates approval guardrails.
 *
 * Request body:
 * {
 *   "items": [
 *     { "sku": "EG-NOMAD-20K", "quantity": 1, "discount_pct": 0.05 },
 *     { "sku": "INST-TURNKEY", "quantity": 1 },
 *     { "sku": "SVC-SITE-VERIFY", "quantity": 1 }
 *   ]
 * }
 *
 * Returns: line_items, totals, commission, approval
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const items: Array<{ sku: string; quantity: number; discount_pct?: number }> =
      body.items;

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'items must be a non-empty array of { sku, quantity }' },
        { status: 400 },
      );
    }

    const lineItems: QuoteLineItem[] = [];
    const errors: string[] = [];

    for (const item of items) {
      if (!item.sku || !item.quantity || item.quantity < 1) {
        errors.push(`Invalid item: ${JSON.stringify(item)}`);
        continue;
      }

      const lineItem = buildLineItem(item.sku, item.quantity, item.discount_pct);
      if (!lineItem) {
        errors.push(`Unknown SKU: ${item.sku}`);
        continue;
      }

      lineItems.push(lineItem);
    }

    if (lineItems.length === 0) {
      return NextResponse.json(
        { error: 'No valid line items', details: errors },
        { status: 400 },
      );
    }

    const totals = computeQuoteTotals(lineItems);
    const commission = computeCommission(lineItems);
    const approval = evaluateApproval(lineItems);

    return NextResponse.json({
      line_items: lineItems,
      totals,
      commission,
      approval,
      ...(errors.length > 0 ? { warnings: errors } : {}),
    });
  } catch (error) {
    console.error('Quote build error:', error);
    return NextResponse.json(
      { error: 'Failed to build quote' },
      { status: 500 },
    );
  }
}
