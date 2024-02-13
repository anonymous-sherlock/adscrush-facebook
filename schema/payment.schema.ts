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
  upiId: z.string().min(3, { message: "Invalid Upi Id" }).regex(
    /^[a-zA-Z0-9.-]{2,256}@[a-zA-Z][a-zA-Z]{2,64}$/
  ),
  primary: markasPrimary,
});

export const netbankingFormSchema = z.object({
  accountHolderName: z.string().min(1, "Account holder name is required"),
  bankName: z.string().min(1, "Bank name is required"),
  branchName: z.string().min(1, "Branch name is required"),
  accountNumber: z
    .string()
    .min(1, "Account number is required")
    .max(17, "Invalid account number")
    .refine((value) => /^\d{10,}$/g.test(value), {
      message: "Invalid account number",
    }),
  ifscCode: z.string().min(1, "ifsc code is required").min(11, "Invalid ifsc code").max(14, "Invalid ifsc code"),
  primary: markasPrimary,
});

export const paymentMethodDetails = z.object({
  details: z.union([upiFormSchema, netbankingFormSchema]),
});

export type PayoutFormType = z.infer<typeof payoutFormSchema>;
export type UpiFormType = z.infer<typeof upiFormSchema>;
export type NetBankingFormType = z.infer<typeof netbankingFormSchema>;
export type PaymentMethodsDetails = z.infer<typeof paymentMethodDetails>;
