import { Payment_Status, Payment_Type, UserRole } from "@prisma/client";
import { z } from "zod";

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const PaymentListSchema = z.object({
  type: z.nativeEnum(Payment_Type),
  status:z.nativeEnum(Payment_Status),
  id: z.string(),
  createdAt: z.date(),
  amount: z.number(),
  txid: z.string()
});

export type PaymentListSchemaType = z.infer<typeof PaymentListSchema>;
