import { DEFAULT_BONUS_UPDATE_TIME } from "@/constants/bonus";
import { db } from "@/db";
import { startOfDay } from "date-fns";

const isProduction = process.env.NODE_ENV === 'production';
const BONUS_UPDATE_TIME = isProduction ? DEFAULT_BONUS_UPDATE_TIME : DEFAULT_BONUS_UPDATE_TIME


export async function updateWalletBalances() {
    try {
        // Fetch all users from the database
        const users = await db.user.findMany({
            where: {
                onboarding: { status: "Verified" },
                OR: [
                    { wallet: { bonusUpdated: null } },
                    { wallet: { bonusUpdated: { lte: new Date(Date.now() - BONUS_UPDATE_TIME) } } }
                ],
            },
            include: { wallet: true },
        });

        if (!users || users.length === 0) {
            console.log("No verified users found.");
            throw new Error("No verified users found")
        }
        const startDate = startOfDay(new Date())
        for (const user of users) {
            if (user.wallet) {
                const updatedWallet = await db.wallet.update({
                    where: { id: user.wallet.id },
                    data: {
                        balance: { increment: user.dailyBonusLimit },
                        bonusUpdated: startDate,
                    },
                });

                await db.bonus.create({
                    data: {
                        walletId: user.wallet.id,
                        amount: user.dailyBonusLimit,
                        updatedAt: startDate
                    },
                });
            }
        }

        console.log("Wallet balances updated successfully");
    } catch (error) {
        console.error("Error updating wallet balances:");
        throw error
    }
}
