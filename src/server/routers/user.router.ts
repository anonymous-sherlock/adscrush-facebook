import { db } from "@/db";
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
      },
    });

    return {
      success: true,
      message: "User created successfully",
      user: {
        id: newUser.id,
        email: newUser.email,
      },
    };
  }),

});

export type UserRouter = typeof userRouter;
