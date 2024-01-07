import AccountRegistrationConfirmEmail from "@/components/email/account-registration-confirm-email";
import VerifyOnboardingEmail from "@/components/email/verify-onboarding-email";
import { env } from "@/env.mjs";
import { Resend } from "resend";

const resend = new Resend(env.RESEND_API_KEY);
const domain = env.NEXT_PUBLIC_APP_URL;


export const sendVerificationEmail = async (
    email: string,
    token: string
) => {
    const confirmLink = `${domain}/sso-callback?token=${token}`;

    await resend.emails.send({
        from: `Adscrush <onboarding@${env.RESEND_DOMAIN}>`,
        to: email,
        subject: "Confirm your email",
        html: "",
        react: AccountRegistrationConfirmEmail({ confirmLink: confirmLink })
    });
};


export const sendOnboardingVerificationEmail = async (
    email: string,
    code: string
) => {
    await resend.emails.send({
        from: `Adscrush <onboarding@${env.RESEND_DOMAIN}>`,
        to: email,
        subject: "Verify your account email",
        html: "",
        react: VerifyOnboardingEmail({ validationCode: code })
    });
};


