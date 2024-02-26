import { db } from "@/db"
import { getCurrentUser } from "@/lib/auth";

type AdminApiArgs = {
    userId: string
}
export class AdminApi {
    private currentUserId: string | undefined;

    constructor(opts?: AdminApiArgs) {
        getCurrentUser().then((data) => {
            this.currentUserId = data?.id;
        });
    }
    async userCount() {
        try {
            const userCount = await db.user.count({ where: { id: { not: this.currentUserId, }, }, })
            return userCount;
        } catch (err) {
            return null
        }
    }
}

export const admin = new AdminApi()