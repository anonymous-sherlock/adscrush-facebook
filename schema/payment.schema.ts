import { Payment_Method_Type } from "@prisma/client";
import { z } from "zod";


export const payoutFormSchema = z.object({
    amt: z.string().refine((value) => {
        if (typeof value === 'number') {
            return value >= 500;
        } else {
            const parsedNumber = Number(value);
            return !isNaN(parsedNumber) && parsedNumber >= 500;
        }
    }, { message: 'Mininum payout value is 500' }),
    paymentMethod: z.nativeEnum(Payment_Method_Type)
});

export type PayoutFormType = z.infer<typeof payoutFormSchema>;