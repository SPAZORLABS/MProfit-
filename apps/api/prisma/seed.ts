import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');
  
  // Clean up existing data to ensure idempotent seed
  await prisma.taxLot.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.holding.deleteMany();
  await prisma.portfolio.deleteMany();
  await prisma.user.deleteMany();
  await prisma.tenant.deleteMany();
  await prisma.asset.deleteMany();

  console.log('Cleared existing data.');

  // Create default tenant required for the system
  await prisma.tenant.create({
    data: {
      name: 'Default Tenant',
      slug: 'default',
    }
  });

  console.log('Fresh seed complete. Only default tenant created. No demo data exists.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
