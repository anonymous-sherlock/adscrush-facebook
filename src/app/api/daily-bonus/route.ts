import { db } from "@/db";
import { NextRequest, NextResponse } from "next/server";
import { RecurrenceRule, scheduleJob } from "node-schedule";

async function updateWalletBalances() {
  try {
    // Fetch all users from the database
    const users = await db.user.findMany({ where: { onboarding: { status: "Verified" } }, include: { wallet: true } });

    if (!users || users.length === 0) {
      console.log('No verified users found.');
      return;
    }
    const updatedUser = await db.wallet.updateMany({
      where: {
        userId: {
          in: users.map((user) => user.id)
        }
      },
      data: {
        balance: {
          increment: users.map((user) => user.dailyBonusLimit || 50).reduce((acc, limit) => acc + limit, 0),
        },
      }
    })

    console.log('Wallet balances updated successfully');
  } catch (error) {
    console.error('Error updating wallet balances:', error);
  }
}

const job = scheduleJob('* * * * *', updateWalletBalances);

export async function GET(req: NextRequest, res: NextResponse) {
  return NextResponse.json({ success: true })
}