import { db } from "@/db"
import { endOfDay, endOfYear, startOfDay, startOfYear, subMonths } from "date-fns"


type BonusTrackingArgs = {

}

type BonusGetAllArgs = {
  userId?: string
  date?: { from: Date | undefined, to: Date | undefined },
}
export class BonusTracking {
  constructor(opts?: BonusTrackingArgs) { }

  async count(userId: string) {
    try {
      const bonuses = await db.bonus.count({
        where: {
          wallet: {
            userId: userId
          }
        }
      })
      return bonuses
    } catch (error) {
      console.log(error)
    }
  }
  async getAll({ date, userId }: BonusGetAllArgs) {
    try {
      const today = new Date();
      const lastOneMonth = startOfDay(subMonths(today, 1));
      const startDay = date?.from ? startOfDay(date.from) : lastOneMonth;
      const endDay = date?.to ? endOfDay(date.to) : endOfDay(today);

      const bonuses = await db.bonus.findMany({
        where: {
          wallet: {
            userId: userId,
          },
          createdAt: {
            gte: startDay,
            lte: endDay
          }
        },
        orderBy: { createdAt: "desc" }
      })
      return bonuses
    } catch (error) {
      return []
    }
  }

  async retrieveMonthlyBonuses(userId: string) {
    const bonusDataFromDatabase = await db.bonus.findMany({ where: { wallet: { userId: userId } } });
    const monthMap = new Map();
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    months.forEach(month => {
      monthMap.set(month, { month, total: 0 });
    });

    // Iterate over the bonus data to update the total for each month
    bonusDataFromDatabase.forEach(bonus => {
      const month = new Date(bonus.createdAt).getMonth(); // Assuming createdAt is a Date object
      const monthName = months[month]; // Convert month index to month name
      const existingBonus = monthMap.get(monthName);
      if (existingBonus) {
        existingBonus.total += bonus.amount; // Assuming bonus.amount is the bonus amount
      }
    });

    // Convert the map to an array of objects in the desired format
    const data: { month: string, total: number }[] = Array.from(monthMap.values());

    // Return the data or use it as needed
    return data;
  }

  async monthlyAnalysis(userId: string) {
    const today = new Date();
    const thisYearBonusData = await db.bonus.findMany({
      where: {
        wallet: { userId: userId },
        createdAt: {
          gte: startOfYear(today),
          lte: endOfYear(today)
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    const monthMap = new Map();
    const monthOrder = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    for (const bonus of thisYearBonusData) {
      const monthName = new Date(bonus.createdAt).toLocaleString('default', { month: 'long' });
      const monthData = monthMap.get(monthName) || {
        month: monthName,
        bonus: { total: 0 },
        referral: { total: 0 },
      };

      if (bonus.type === 'Bonus') {
        monthData.bonus.total += bonus.amount;
      } else if (bonus.type === 'Referral') {
        monthData.referral.total += bonus.amount;
      }
      monthMap.set(monthName, monthData);
    }

    const sortedData = Array.from(monthMap.values()).sort((a, b) => monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month));

    return sortedData;
  }


}

export const bonus = new BonusTracking()
