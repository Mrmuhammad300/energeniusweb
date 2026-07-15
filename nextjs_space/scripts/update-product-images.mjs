// Non-destructive companion to scripts/seed.ts: pushes the current image_url
// from public/powerx_products.json into existing Product rows, matched by SKU.
// Unlike seed.ts, this never deletes or recreates rows, so it's safe to run
// after regenerating product images without disturbing orders/relations tied
// to existing product ids.
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const prisma = new PrismaClient();

async function main() {
  const productsPath = path.join(__dirname, '..', 'public', 'powerx_products.json');
  const data = JSON.parse(fs.readFileSync(productsPath, 'utf-8'));
  const items = [...data.generators, ...data.batteries];

  let updated = 0;
  let missing = 0;
  for (const item of items) {
    const result = await prisma.product.updateMany({
      where: { sku: item.sku },
      data: { imageUrl: item.image_url },
    });
    if (result.count > 0) {
      updated++;
    } else {
      missing++;
      console.log(`   No existing row for SKU ${item.sku} (skipped)`);
    }
  }

  console.log(`Updated imageUrl on ${updated} product(s); ${missing} SKU(s) had no matching row.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
