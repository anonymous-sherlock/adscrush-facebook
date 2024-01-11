import { db } from "@/db";
import { generateVerificationToken } from "@/lib/helpers/tokens";
import { sendVerificationEmail } from "@/lib/mail";
import { authSchema } from "@/schema/auth.schema";
import { publicProcedure, router } from "@/server/trpc";
import { TRPCError } from "@trpc/server";
import { hash } from "bcrypt";

export const userRouter = router({
  add: publicProcedure.input(authSchema).mutation(async ({ input }) => {
    const { email, password } = input;
    const existingUser = await db.user.findUnique({
      where: {
        email: email,
      },
    });
    if (existingUser) {
      throw new TRPCError({
        code: "CONFLICT",
        message: "User with this email already exist",
      });
    }
    const hashPassword = await hash(password, 16);
    const newUser = await db.user.create({
      data: {
        email: email,
        password: hashPassword,
        wallet: {
          create: {}
        }
      },
    });

    const verificationToken = await generateVerificationToken(email);
    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token,
    );
    return {
      success: true,
      message: "Confirmation email sent!",
      user: {
        id: newUser.id,
        email: newUser.email,
      },
    };
  }),

});

export type UserRouter = typeof userRouter;
