import { db } from "@/db";
import { getCurrentUser } from "@/lib/auth";
import { endOfDay, startOfDay, subMonths } from "date-fns";


type PaymentTrackingArgs = {
  userId?: string;
}
type PaymentGetAllArgs = {
  userId?: string
  date?: { from: Date | undefined, to: Date | undefined },
  limit?: number
}
export class PaymentTracking {
  private userId: string;

  constructor(private readonly opts?: PaymentTrackingArgs) {
    this.init()
    this.userId = this.opts?.userId || "";

  }
  private async init() {
    const currentUser = await getCurrentUser();
    this.userId = currentUser?.id ?? ""
  }
  async count(userId?: string) {
    try {
      const targetUserId = userId || this.userId;
      const paymentsCount = await db.payment.count({ where: { userId: targetUserId }, });
      return paymentsCount
    } catch (error) {
      console.log(error)
    }
  }
  async getAll({ userId, date, limit }: PaymentGetAllArgs) {
    try {
      const targetUserId = userId || this.userId;
      const today = new Date();
      const lastOneMonth = startOfDay(subMonths(today, 1));
      const startDay = date?.from ? startOfDay(date.from) : lastOneMonth;
      const endDay = date?.to ? endOfDay(date.to) : endOfDay(today);

      const payments = await db.payment.findMany({
        where: {
          userId: targetUserId,
          createdAt: {
            gte: startDay,
            lte: endDay
          }
        },
        orderBy: { createdAt: "desc" },
        include: { userPayoutMethod: true, },
        take: limit ? limit : undefined,
      })

      return payments
    } catch (error) {
      return []
    }
  }
}

export const payment = new PaymentTracking()