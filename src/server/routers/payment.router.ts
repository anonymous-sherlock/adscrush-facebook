import { db } from "@/db";
import { netbankingFormSchema, payoutFormSchema, upiFormSchema } from "@/schema/payment.schema";
import { privateProcedure, router } from "@/server/trpc";
import { TRPCError } from "@trpc/server";
import { endOfDay, startOfDay, subMonths } from "date-fns";
import { z } from "zod";

const paymentQuerySchema = z.object({
  limit: z.number().nullish().optional(),
  userId: z.string().nullish().optional(),
  date: z.object({
    from: z.date().optional(),
    to: z.date().optional()
  })
});
const getTotalPaymentCountSchema = z.object({
  userId: z.string().nullish().optional()
}).optional();

export const paymentRouter = router({
  requestPayout: privateProcedure.input(payoutFormSchema).mutation(async ({ ctx, input }) => {
    const amt = parseInt(input.amt);

    const wallet = await db.wallet.findUnique({
      where: {
        userId: ctx.userId,
      },
    });
    if (!wallet)
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "user wallet not found",
      });
    if (wallet?.balance < amt)
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Amount should be less than or equal to available Balance",
      });

    const [updatedPayment, updatedWallet] = await db.$transaction([
      db.payment.create({
        data: {
          amount: amt,
          userId: ctx.userId,
          walletId: wallet.id,
          payoutId: input.paymentMethod,
        },
      }),
      db.wallet.update({
        where: { id: wallet.id },
        data: {
          balance: {
            decrement: amt,
          },
        },
      }),
    ]);
    return {
      success: true,
      message: "payment request sent.",
    };
  }),

  getAll: privateProcedure.input(paymentQuerySchema).query(async ({ ctx, input }) => {
    const limit = input?.limit;
    let userId = input?.userId || ctx.userId
    const date = input?.date
    const today = new Date();
    const lastOneMonth = startOfDay(subMonths(today, 1))

    const startDay = date?.from ? startOfDay(date.from) : lastOneMonth
    const endDay = date?.to ? endOfDay(date?.to) : endOfDay(startDay)


    const payments = await db.payment.findMany({
      where: {
        userId: userId,
        createdAt: {
          gte: startDay,
          lte: endDay
        }
      },
      orderBy: { createdAt: "desc", },
      include: { userPayoutMethod: true, },
      take: limit ? limit : undefined,
    });
    return payments;
  }),

  getTotalPaymentCount: privateProcedure.input(getTotalPaymentCountSchema).query(async ({ ctx, input }) => {
    let userId = input?.userId || ctx.userId
    const paymentsCount = await db.payment.count({
      where: { userId },
    });
    return paymentsCount;
  }),

  addPaymentMethod: privateProcedure.input(z.union([upiFormSchema, netbankingFormSchema])).mutation(async ({ ctx, input }) => {
    try {
      const { primary, ...details } = input;
      const result = await db.$transaction(async (prisma) => {
        const existingPaymentMethod = await prisma.userPaymentMethod.findUnique({ where: { details: details } });
        if (existingPaymentMethod) throw new TRPCError({ code: "CONFLICT", message: "payment method already in use" });

        const newPaymentMethod = await prisma.userPaymentMethod.create({
          data: {
            UserPrefrence: {
              connectOrCreate: {
                create: {
                  userId: ctx.userId,
                },
                where: {
                  userId: ctx.userId,
                },
              },
            },
            methodType: "upiId" in details ? "UPI" : "NETBANKING",
            primary: input.primary,
            details: details,
          },
        });

        if (input.primary) {
          await prisma.userPaymentMethod.updateMany({
            where: {
              userPrefrenceId: newPaymentMethod.userPrefrenceId,
              primary: true,
              id: {
                not: newPaymentMethod.id,
              },
            },
            data: {
              primary: false,
            },
          });
        }
        return {
          message: `${"upiId" in details ? "Upi" : "Netbanking"} Added Successfully`,
        };
      });

      return result;
    } catch (error) {
      console.log(error);
      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Something went wrong." });
    }
  }),
});
