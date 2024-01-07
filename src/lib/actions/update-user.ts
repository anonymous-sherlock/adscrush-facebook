"use server";

import { db } from "@/db";
import { getCurrentUser } from "../auth";


export const updateUser = async () => {
    const user = await getCurrentUser()
    try {
        const updatedUser = await db.user.update({
            where: {
                id: user?.id
            },
            data: {
                isOnboarded: new Date()
            }
        })
        return { success: "updated user !" };
    } catch (error) {
        return { error: "update failed" }
    }

}

