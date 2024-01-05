import VerficationEmail from "@/components/email/verify-account";
import { env } from "@/env.mjs";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationEmail = async (
    email: string,
    code: string
) => {

    await resend.emails.send({
        from: `Adscrush <security@${env.RESEND_DOMAIN}>`,
        to: email,
        subject: "reset your account password",
        html: "",
        react: VerficationEmail({ validationCode: code })
    });
};
