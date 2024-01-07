import { UserRole } from "@prisma/client";
import { DefaultSession } from "next-auth";
import { type Session, type User } from "next-auth";
import type { JWT } from "next-auth/jwt";

type UserId = string;

export type ExtendedUser = DefaultSession["user"] & {
  id: UserId;
  role: UserRole;
  isOAuth: boolean;
  isOnboarded: date
};

declare module "next-auth/jwt" {
  interface JWT {
    id: UserId;
    role: UserRole;
    isOAuth: boolean;
    isOnboarded: date;
  }
}

declare module "next-auth" {
  interface Session {
    user: ExtendedUser;
  }
}
