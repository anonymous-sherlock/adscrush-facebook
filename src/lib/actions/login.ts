"use server";

import * as z from "zod";

import { getUserByEmail } from "@//lib/data/user";

import { generateVerificationToken } from "@/lib/helpers/tokens";
import {
    sendVerificationEmail
} from "@/lib/mail";
import { loginSchema } from "@/schema/auth.schema";


export const login = async (
    values: z.infer<typeof loginSchema>,
    callbackUrl?: string | null,
) => {
    const validatedFields = loginSchema.safeParse(values);

    if (!validatedFields.success) {
        return { error: "Invalid fields!" };
    }

    const { email, password } = validatedFields.data;

    const existingUser = await getUserByEmail(email);

    if (!existingUser || !existingUser.email || !existingUser.password) {
        return { error: "Email does not exist!" }
    }

    if (!existingUser.emailVerified) {
        const verificationToken = await generateVerificationToken(
            existingUser.email,
        );

        await sendVerificationEmail(
            verificationToken.email,
            verificationToken.token,
        );

        return { success: "Confirmation email sent!" };
    }

    return { canLogin: true }
};
