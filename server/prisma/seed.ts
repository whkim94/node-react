import { PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient().$extends(withAccelerate());

async function main() {
  // Create demo user
  const hashedPassword = await bcrypt.hash('demo123', 10);
  const user = await prisma.user.upsert({
    where: { email: 'demo@example.com' },
    update: {},
    create: {
      email: 'demo@example.com',
      name: 'Demo User',
      password: hashedPassword,
      invoices: {
        create: [
          {
            vendorName: 'Amazon',
            amount: 0.0,
            dueDate: new Date('2023-10-31'),
            description: 'Rental',
            paid: true,
          },
          {
            vendorName: 'Sysco',
            amount: 228.75,
            dueDate: new Date('2023-10-31'),
            description: 'Rental',
            paid: false,
          },
          {
            vendorName: 'US Foods',
            amount: 0.0,
            dueDate: new Date('2023-10-31'),
            description: 'Rental',
            paid: true,
          },
          {
            vendorName: 'Retal Inc',
            amount: 0.0,
            dueDate: new Date('2023-10-31'),
            description: 'Rental',
            paid: true,
          },
          {
            vendorName: 'Fiber Optics',
            amount: 150.0,
            dueDate: new Date('2023-10-31'),
            description: 'Rental',
            paid: false,
          },
          {
            vendorName: 'Ikea',
            amount: 0.0,
            dueDate: new Date('2023-10-31'),
            description: 'Rental',
            paid: true,
          },
          {
            vendorName: 'Costco',
            amount: 0.0,
            dueDate: new Date('2023-10-31'),
            description: 'Rental',
            paid: true,
          },
          {
            vendorName: 'Office Depot',
            amount: 0.0,
            dueDate: new Date('2023-10-31'),
            description: 'Rental',
            paid: true,
          },
          {
            vendorName: 'Sysco',
            amount: 350.0,
            dueDate: new Date('2023-10-31'),
            description: 'Rental',
            paid: false,
          },
        ],
      },
    },
  });

  console.log({ user });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
