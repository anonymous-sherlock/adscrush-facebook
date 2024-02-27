import { z } from "zod";

export const userFilterSchema = z.object({
    name: z.string().optional(),
    onboarded: z.coerce.boolean().optional(),
});

export type UserFilterValues = z.infer<typeof userFilterSchema>;