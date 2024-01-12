import { DEFAULT_BONUS_UPDATE_TIME } from "@/constants/bonus";
import { db } from "@/db";
import { NextRequest, NextResponse } from "next/server";

async function updateWalletBalances() {
  try {
    // Fetch all users from the database
    const users = await db.user.findMany({
      where: {
        onboarding: { status: "Verified" },
        OR: [
          { wallet: { bonusUpdated: null } },
          { wallet: { bonusUpdated: { lte: new Date(Date.now() - DEFAULT_BONUS_UPDATE_TIME) } } }
        ]
      }, include: { wallet: true }
    });

    if (!users || users.length === 0) {
      console.log('No verified users found.');
      return;
    }

    const updatedUser = await db.wallet.updateMany({
      where: {
        userId: {
          in: users.map((user) => user.id)
        },
      },
      data: {
        balance: {
          increment: users.map((user) => user.dailyBonusLimit || 50).reduce((acc, limit) => acc + limit, 0),
        },
        bonusUpdated: new Date()
      }
    })

    console.log('Wallet balances updated successfully');
  } catch (error) {
    console.error('Error updating wallet balances:', error);
  }
}

// Define a function to perform basic authentication
function isAuthenticated(req: NextRequest) {
  const authheader = req.headers.get('authorization') || req.headers.get('Authorization');

  if (!authheader) {
    return false;
  }

  const auth = Buffer.from(authheader.split(' ')[1], 'base64').toString().split(':');
  const user = auth[0];
  const pass = auth[1];

  if (user == "adscrush" && pass == "adscrush") {
    return true;
  } else {
    return false;
  }
}


export async function handler(req: NextRequest, res: NextResponse) {
  try {
    if (!isAuthenticated(req)) {
      return new NextResponse('Authentication required', {
        status: 401,
        headers: { 'WWW-Authenticate': 'Basic' },
      });
    }

    await updateWalletBalances()
  } catch (error) {
    console.log(error)
  }
  return NextResponse.json({ success: true })
}

export { handler as GET, handler as POST }


