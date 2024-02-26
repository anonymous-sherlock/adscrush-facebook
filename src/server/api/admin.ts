import { db } from "@/db"
import { getCurrentUser } from "@/lib/auth";

type AdminApiArgs = {
    userId: string
}
export class AdminApi {
    private currentUserId: string | undefined;

    constructor(opts?: AdminApiArgs) {
        this.init();
    }
    private async init() {
        const currentUser = await getCurrentUser();
        this.currentUserId = currentUser?.id;
    }
    async userCount() {
        try {
            const userCount = await db.user.count({ where: { id: { not: this.currentUserId, }, }, })
            return userCount;
        } catch (err) {
            return null
        }
    }

    async getUsersList(name?: string) {
        try {
            const users = await db.user.findMany({
                where: {
                    name: { contains: name },
                    id: { not: this.currentUserId }
                },
                select: {
                    id: true,
                    name: true,
                    isOnboarded: true
                },
                orderBy: { isOnboarded: { sort: 'asc', nulls: 'last' } }
            })
            return users
        } catch (error) {

        }
    }
}

export const admin = new AdminApi()