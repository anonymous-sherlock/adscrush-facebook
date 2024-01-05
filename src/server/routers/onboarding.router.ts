import { FBOnboardingSchema } from "@/schema/onboarding.schema";
import { privateProcedure, router } from "../trpc";
import { z } from "zod";
import { db } from "@/db";


const accountSchema = z.object({
  id: z.string(),
  label: z.string(),
  value: z.string(),
});
const groupAccountSchema = z.object({
  label: z.string(),
  accounts: z.array(accountSchema),

});
export const onboardingRouter = router({
  getAllOnboardingName: privateProcedure.output(z.array(groupAccountSchema)).query(async ({ ctx, input }) => {
    const onboardings = await db.onboarding.findMany({
      where: {
        userId: ctx.userId
      },
      select: {
        name: true,
        id: true
      }
    })


    return [
      {
        label: "Facebook Account",
        accounts: onboardings.map((acc) => ({
          id: acc.id,
          label: acc.name,
          value: acc.name.toLowerCase().replace(" ", "-"),
        })),
      },
    ];

  }),
  getAll: privateProcedure.query(async ({ ctx, input }) => {
    try {
      const onboardings = await db.onboarding.findMany({
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

      return onboardings

    } catch (error) {
      console.log(error)
      return null

    }


  })
})