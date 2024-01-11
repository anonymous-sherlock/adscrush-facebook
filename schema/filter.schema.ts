import { z } from "zod";

export const userFilterSchema = z.object({
    name: z.string().optional(),
});

export type UserFilterValues = z.infer<typeof userFilterSchema>;