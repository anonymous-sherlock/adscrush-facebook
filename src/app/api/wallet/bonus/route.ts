import { db } from "@/db";
import { NextRequest, NextResponse } from "next/server";
import schedule from "node-schedule";

async function updateWalletBalances() {
  try {
    // Fetch all users from the database
    const users = await db.user.findMany(
      {
        where: {
          onboarding: {
            status: "Verified"
          }
        }, include: { wallet: true }
      });

    if (!users) { return null }
    await Promise.all(
      users.map(async (user) => {
        if (user.wallet?.id) {
          // Wallet exists, update balance
          await db.wallet.update({
            where: { id: user.wallet.id },
            data: {
              balance: {
                increment: 50,
              },
            },
          });
        } else {
          // Wallet doesn't exist, create a new wallet for the user
          const newWallet = await db.wallet.create({
            data: {
              balance: 50, // Set initial balance
              user: { connect: { id: user.id } },
            },
          });

          console.log(`Created wallet with id ${newWallet.id} for user ${user.id}`);
        }
      })
    );

    console.log('Wallet balances updated successfully');
  } catch (error) {
    console.error('Error updating wallet balances:', error);
  }
}

const job = schedule.scheduleJob('*/1 * * * *', updateWalletBalances);


async function handler(req: NextRequest, res: NextResponse) {
  return NextResponse.json({ success: true }, { status: 200 });
}
export { handler as GET, handler as POST };