import { NextRequest, NextResponse } from "next/server";
import twilio from "twilio";

const verifySid = "VA2aa4a21bb5c38db6503a040210ce914d";

async function handler(req: NextRequest, res: NextResponse) {
  const queryParams = req.nextUrl.searchParams;
  const otpCode: string = queryParams.get("code") ?? "";

  if (!otpCode) {
    return NextResponse.json(
      { success: false, message: "No Otp Code Found" },
      { status: 404 }
    );
  }
  try {
    const client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );

    const validVerification = await client.verify.v2
      .services(verifySid)
      .verificationChecks.create({ to: "+919870474181", code: otpCode });
    console.log(validVerification);
    return NextResponse.json(
      { success: true, message: "Phone verified" },
      { status: 200 }
    );
  } catch (error) {
    console.error(`Error sending SMS: ${error}`);
    return NextResponse.json(
      { success: false, message: "Failed to verify phone." },
      { status: 400 }
    );
  }
}

export { handler as GET, handler as POST };
