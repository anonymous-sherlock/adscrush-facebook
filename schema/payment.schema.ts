import { Payment_Method_Type } from "@prisma/client";
import { z } from "zod";

export const payoutFormSchema = z.object({
  amt: z.string().refine(
    (value) => {
      if (typeof value === "number") {
        return value >= 500;
      } else {
        const parsedNumber = Number(value);
        return !isNaN(parsedNumber) && parsedNumber >= 500;
      }
    },
    { message: "Mininum payout value is 500" }
  ),
  paymentMethod: z.string(),
});

const markasPrimary = z.boolean().default(false).optional();

export const upiFormSchema = z.object({
  upiId: z.string().min(1, { message: "Upi Id is required" }),
  primary: markasPrimary,
});

export const netbankingFormSchema = z.object({
  accountHolderName: z.string(),
  bankName: z.string(),
  branchName: z.string(),
  accountNumber: z.string(),
  ifscCode: z.string(),
  primary: markasPrimary,
});

export const paymentMethodsDetails = z.object({
  details: z.union([upiFormSchema, netbankingFormSchema]),
});

export type PayoutFormType = z.infer<typeof payoutFormSchema>;
export type UpiFormType = z.infer<typeof upiFormSchema>;
export type NetBankingFormType = z.infer<typeof netbankingFormSchema>;
