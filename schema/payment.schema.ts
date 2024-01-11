import { z } from "zod";

const stringOrNumberSchema = z.string().refine((data) => {
    const parsedNumber = Number(data);
    return !isNaN(parsedNumber) && typeof parsedNumber === 'number';
}, { message: 'Value must be a number' });

export const payoutFormSchema = z.object({
    amt: z.string().refine((value) => {
        if (typeof value === 'number') {
            return value >= 500;
        } else {
            const parsedNumber = Number(value);
            return !isNaN(parsedNumber) && parsedNumber >= 500;
        }
    }, { message: 'Mininum payout value is 500' })
});

export type PayoutFormType = z.infer<typeof payoutFormSchema>;