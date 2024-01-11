import { db } from "@/db"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest, res: NextResponse) {

  try {
    const usersWithoutWallet = await db.user.findMany({
      where: {
        wallet: null,
        onboarding: {
          status: "Verified"
        }
      }
    });

    if (usersWithoutWallet.length > 0) {
      const createWallet = await db.wallet.createMany({
        data: usersWithoutWallet.map(user => ({
          userId: user.id
          // Add other properties for wallet creation if needed
        })),
      });

      console.log('Wallets created successfully:', createWallet);
    } else {
      console.log('No users without a wallet found.');
    }
  } catch (error) {
    console.error('Error creating wallets:', error);
  }

  return NextResponse.json({ success: true })
}