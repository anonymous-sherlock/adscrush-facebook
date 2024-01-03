import { NextRequest, NextResponse } from "next/server";
import twilio from "twilio";

const verifySid = "VA2aa4a21bb5c38db6503a040210ce914d";

async function handler(req: NextRequest, res: NextResponse) {
  try {
    const client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );

    const message = await client.verify.v2
      .services(verifySid)
      .verifications.create({
      
        to: "+919870474181",
        channel: "sms",
      });
    console.log(`SMS sent with SID: ${message.sid}`);

    return NextResponse.json(
      { success: true, message: "SMS sent successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error(`Error sending SMS: ${error}`);
    return NextResponse.json(
      { success: false, message: "Failed to send SMS." },
      { status: 400 }
    );
  }
}

export { handler as GET, handler as POST };
