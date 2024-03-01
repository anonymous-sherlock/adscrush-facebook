"use server"
import { getServerSession } from "next-auth";
import { authOptions } from "./auth.config";

export const getAuthSession = () => getServerSession(authOptions);

export const getCurrentUser = async () => {
    const session = await getAuthSession();
    return session?.user;
}


export const getCurrentRole = async () => {
    const session = await getAuthSession();
    return session?.user?.role;
};

export const getCurrentIsOnboarded = async () => {
    const session = await getAuthSession();
    return session?.user?.isOnboarded;
};