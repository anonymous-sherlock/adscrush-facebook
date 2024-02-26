import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function initDb() {
  const wallet = await prisma.wallet.findFirst({ where: { id: "clrojp9yv0000k7tmjvtdrl0e" } });
  if (!wallet) return;

  const startDate = new Date(2024, 0, 19); // Jan 15, 2024
  const endDate = new Date(2024, 1, 26);   // Feb 26, 2024
  let date = new Date(startDate); 

  while (date <= endDate) {
    const updateBonus = await prisma.bonus.create({
      data: {
        amount: 50,
        type: "Bonus",
        walletId: wallet.id,
        createdAt: date,
        updatedAt: date
      },
    });

    console.log(wallet.id, date);

    // Move to the next day
    date.setDate(date.getDate() + 1);
  }
  await prisma.$disconnect();
}

initDb();