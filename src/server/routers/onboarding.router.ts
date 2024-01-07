import { db } from "@/db";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { privateProcedure, router } from "../trpc";


const accountSchema = z.object({
  id: z.string(),
  label: z.string(),
  value: z.string(),
});
const groupAccountSchema = z.object({
  label: z.string(),
  accounts: accountSchema,

});
export const onboardingRouter = router({
  getOnboardingName: privateProcedure.output(groupAccountSchema).query(async ({ ctx, input }) => {
    const onboarding = await db.onboarding.findFirst({
      where: {
        userId: ctx.userId
      },
      select: {
        name: true,
        id: true
      }
    })

    if (!onboarding) {
      throw new TRPCError({ code: "NOT_FOUND", message: "user not onboarded yet" })
    }

    return {
      label: "Facebook Account",
      accounts: {
        id: onboarding.id,
        label: onboarding.name,
        value: onboarding.name.toLowerCase().replace(" ", "-"),
      }
    }
  }),
  getAll: privateProcedure.query(async ({ ctx, input }) => {
    try {
      const onboarding = await db.onboarding.findFirst({
        where: {
          userId: ctx.userId
        },
        select: {
          name: true,
          id: true,
          createdAt: true,
          status: true,
          facebook_profile_link: true,
          facebook_username: true,
        }
      })

      return onboarding

    } catch (error) {
      console.log(error)
      return null

    }
  })
})