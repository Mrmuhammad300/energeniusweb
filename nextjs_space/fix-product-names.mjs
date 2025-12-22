import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Rename Guardian 3000 (30,000W) to Guardian 30K
  const guardian30k = await prisma.product.updateMany({
    where: {
      model: 'EnerGenius Guardian 3000',
      continuousPower: '30,000 Watts'
    },
    data: {
      model: 'EnerGenius Guardian 30K'
    }
  });
  console.log(`✅ Renamed Guardian 3000 (30,000W) to Guardian 30K: ${guardian30k.count} records`);

  // Rename Guardian 5000 (25,000W) to Guardian 25K
  const guardian25k = await prisma.product.updateMany({
    where: {
      model: 'EnerGenius Guardian 5000',
      continuousPower: '25,000 Watts'
    },
    data: {
      model: 'EnerGenius Guardian 25K'
    }
  });
  console.log(`✅ Renamed Guardian 5000 (25,000W) to Guardian 25K: ${guardian25k.count} records`);

  // Rename Nomad 2000 (20,000W) to Nomad 20K
  const nomad20k = await prisma.product.updateMany({
    where: {
      model: 'EnerGenius Nomad 2000',
      continuousPower: '20,000 Watts'
    },
    data: {
      model: 'EnerGenius Nomad 20K'
    }
  });
  console.log(`✅ Renamed Nomad 2000 (20,000W) to Nomad 20K: ${nomad20k.count} records`);

  // Rename Nomad 1500 (15,000W) to Nomad 15K
  const nomad15k = await prisma.product.updateMany({
    where: {
      model: 'EnerGenius Nomad 1500',
      continuousPower: '15,000 Watts'
    },
    data: {
      model: 'EnerGenius Nomad 15K'
    }
  });
  console.log(`✅ Renamed Nomad 1500 (15,000W) to Nomad 15K: ${nomad15k.count} records`);

  // Verify the changes
  console.log('\n📋 Updated Products:');
  const updatedProducts = await prisma.product.findMany({
    where: {
      OR: [
        { model: { contains: 'Guardian 30K' } },
        { model: { contains: 'Guardian 25K' } },
        { model: { contains: 'Nomad 20K' } },
        { model: { contains: 'Nomad 15K' } },
        { model: { contains: 'Guardian 3000' } },
        { model: { contains: 'Guardian 5000' } },
        { model: { contains: 'Nomad 2000' } },
        { model: { contains: 'Nomad 1500' } }
      ]
    },
    select: {
      model: true,
      continuousPower: true
    },
    orderBy: {
      model: 'asc'
    }
  });
  console.table(updatedProducts);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
