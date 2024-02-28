import { Onboarding_Status } from "@prisma/client";
import { z } from "zod";

export const userFilterSchema = z.object({
    name: z.string().optional(),
    onboarded: z.enum(["all", "onboarded", "not_onboarded"]).optional(),
});

export const accountsFilterSchema = z.object({
    q: z.string().optional(),
    status: z.enum(["All", ...Object.values(Onboarding_Status)]).optional()
});

export type UserFilterValues = z.infer<typeof userFilterSchema>;
export type AccountsFilterValues = z.infer<typeof accountsFilterSchema>;