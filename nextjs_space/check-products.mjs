import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const products = await prisma.product.findMany({
    where: {
      OR: [
        { model: { contains: 'Guardian 3000' } },
        { model: { contains: 'Nomad 2000' } },
        { model: { contains: 'Nomad 1500' } },
        { model: { contains: 'Guardian 5000' } }
      ]
    },
    select: {
      model: true,
      wattage: true,
      batteryCapacity: true,
      continuousPower: true
    }
  });
  
  console.log(JSON.stringify(products, null, 2));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
