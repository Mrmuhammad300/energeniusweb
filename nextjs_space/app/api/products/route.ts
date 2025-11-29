import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

// Helper function to parse wattage from string
function parseWattage(continuousPower: string): number {
  // Extract number from strings like "400 Watts", "750W", "1,000 Watts", "10,000 Watts", etc.
  // Remove commas first, then extract the number
  const cleanedString = continuousPower.replace(/,/g, '');
  const match = cleanedString.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
}

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: {
        priceNumeric: 'asc',
      },
    })
    
    // Add numeric wattage field for calculator compatibility
    const productsWithWattage = products.map(product => ({
      ...product,
      wattageNumeric: parseWattage(product.continuousPower),
    }));
    
    return NextResponse.json(productsWithWattage)
  } catch (error) {
    console.error('Failed to fetch products:', error)
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}
