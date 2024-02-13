import { db } from "@/db";
import { netbankingFormSchema, payoutFormSchema, upiFormSchema } from "@/schema/payment.schema";
import { privateProcedure, router } from "@/server/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

const paymentQuerySchema = z.object({
  limit: z.number().nullish().optional(),
});

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
    const { limit } = input;
    const payments = await db.payment.findMany({
      where: {
        userId: ctx.userId,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        userPayoutMethod: true,
      },
      take: limit ? limit : undefined,
    });

    return payments;
  }),

  getTotalPaymentCount: privateProcedure.query(async ({ ctx, input }) => {
    const paymentsCount = await db.payment.count({
      where: { userId: ctx.userId },
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
