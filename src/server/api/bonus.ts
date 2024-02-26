import { db } from "@/db"

type BonusTrackingArgs = {

}
export class BonusTracking {

  constructor(opts?: BonusTrackingArgs) {

  }
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
  async getAll(userId: string) {
    try {
      const bonuses = await db.bonus.findMany({
        where: {
          wallet: {
            userId: userId
          }
        },
        orderBy: {
          createdAt: "desc"
        }
      })

      return bonuses
    } catch (error) {

    }
  }
}

export const bonus = new BonusTracking()