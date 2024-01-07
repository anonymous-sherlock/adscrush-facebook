"use server";
import { db } from "@/db";
import { hash } from "bcrypt";
import { generateVerificationToken } from "../helpers/tokens";
import { getUserByEmail } from "../data/user";
import { z } from "zod";
import { registerSchema } from "@/schema/auth.schema";
import { sendVerificationEmail } from "../mail";

export async function register(values: z.infer<typeof registerSchema>) {
    const validatedFields = registerSchema.safeParse(values);
    if (!validatedFields.success) {
        return { error: "Invalid fields!" };
    }
    const { email, password, name } = validatedFields.data;
    const existingUser = await getUserByEmail(email);

    if (existingUser) {
        return { error: "Email already in use!" };
    }
    const hashPassword = await hash(password, 16);
    await db.user.create({
        data: {
            name: name,
            email: email,
            password: hashPassword,
        },
    });

    const verificationToken = await generateVerificationToken(email);
    await sendVerificationEmail(
        verificationToken.email,
        verificationToken.token,
    );
    return { success: "Confirmation email sent!" };

}