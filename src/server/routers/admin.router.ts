import { db } from "@/db";
import { adminProcedure, router } from "@/server/trpc";
import { z } from "zod";

const getUserCardDetailsOutputs = z.object({

})
export const adminRouter = router({
    getUserCardDetails: adminProcedure.query(async ({ ctx }) => {
        const users = await db.user.findMany({
            where: {
                id: {
                    not: ctx.userId
                }
            },
            select: {
                id: true,
                name: true,
                isOnboarded: true
            }
        })


        return users
    })
})