import { db } from "@/db"
import { isAuthenticated } from "@/lib/helpers/authentication";
import { NextRequest, NextResponse } from "next/server"

async function handler(req: NextRequest, res: NextResponse) {
  try {
    if (!isAuthenticated(req)) {
      return new NextResponse('Authentication required', {
        status: 401,
        headers: { 'WWW-Authenticate': 'Basic' },
      });
    }

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
        })),
      });

      console.log('Wallets created successfully:', createWallet);
      return NextResponse.json({ success: true }, { status: 201 })
    } else {
      console.log('No users without a wallet found.');
      return NextResponse.json({ error: true }, { status: 404 })
    }
  } catch (error) {
    console.error('Error creating wallets:', error);
    return NextResponse.json({ error: true }, { status: 400 })
  }
}


export { handler as GET, handler as POST }
