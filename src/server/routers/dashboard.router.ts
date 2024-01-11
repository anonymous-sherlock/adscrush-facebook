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
	}),
	totalRevenue: z.object({
		amount: z.number().nullish()
	}),
	withdrawal: z.object({
		amount: z.number().nullish()
	})
})

export const dashboardRouter = router({

	getDetails: privateProcedure.output(getDetailsOutput).query(async ({ ctx }) => {
		const { userId } = ctx


		const user = await getUserById(userId)

		const walletBalance = await db.wallet.findUnique({
			where: {
				userId: userId
			},
			include: {
				payments: {
					select: {
						amount: true,
						id: true
					}
				}
			}
		})

		return {
			wallet: {
				balance: walletBalance?.balance
			},
			bonus: {
				dailyLimit: user?.dailyBonusLimit
			},
			totalRevenue: {
				amount: (walletBalance?.payments.reduce((acc, payment) => acc + payment.amount, 0) ?? 0) + (walletBalance?.balance ?? 0)
			},
			withdrawal: {
				amount: walletBalance?.payments.reduce((acc, payment) => acc + payment.amount, 0) ?? 0
			}
		}
	})
})