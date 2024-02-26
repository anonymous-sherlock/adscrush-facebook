import { Payment_Status, Payment_Type, UserRole } from "@prisma/client";
import { z } from "zod";

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const BonusListSchema = z.object({
  id: z.string(),
  amount: z.number(),
  walletId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date()
});

export type PaymentListSchemaType = z.infer<typeof BonusListSchema>;
