import { db } from "@/db";
import { getUserById } from "@/lib/data/user";
import { privateProcedure, router } from "@/server/trpc";
import { z } from "zod";


const getDetailsOutput = z.object({
	wallet: z.object({
		balance: z.number().nullish()
	}),
	bonus: z.object({
		dailyLimit: z.number().nullish()
	})
})

export const dashboardRouter = router({

	getDetails: privateProcedure.output(getDetailsOutput).query(async ({ ctx }) => {
		const { userId } = ctx


		const user = await getUserById(userId)

		const walletBalance = await db.wallet.findUnique({
			where: {
				userId: userId
			}
		})

		return {
			wallet: {
				balance: walletBalance?.balance
			},
			bonus: {
				dailyLimit: user?.dailyBonusLimit
			}
		}
	})
})