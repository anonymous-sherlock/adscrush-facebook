import { isAuthenticated } from "@/lib/helpers/authentication";
import { NextRequest, NextResponse } from "next/server";
import { updateWalletBalances } from "./core";

async function handler(req: NextRequest, res: NextResponse) {
  try {
    if (!isAuthenticated(req)) {
      return new NextResponse("Authentication required", {
        status: 401,
        headers: { "WWW-Authenticate": "Basic" },
      });
    }

    await updateWalletBalances();
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false });
  }
}

export { handler as GET, handler as POST };

