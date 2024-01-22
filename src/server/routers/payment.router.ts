import { db } from "@/db";
import { payoutFormSchema, upiFormSchema } from "@/schema/payment.schema";
import { privateProcedure, router } from "@/server/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

const paymentQuerySchema = z.object({
  limit: z.number().nullish().optional(),
});

export const paymentRouter = router({
  requestPayout: privateProcedure
    .input(payoutFormSchema)
    .mutation(async ({ ctx, input }) => {
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

  getAll: privateProcedure
    .input(paymentQuerySchema)
    .query(async ({ ctx, input }) => {
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
  addUPI: privateProcedure
    .input(upiFormSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const result = await db.$transaction(async (prisma) => {
          const existingUpi = await prisma.userPaymentMethod.findUnique({
            where: {
              details: input,
            },
          });

          if (existingUpi) {
            throw new TRPCError({
              code: "CONFLICT",
              message: "UPI id Already in use",
            });
          }

          const newUpi = await prisma.userPaymentMethod.create({
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
              methodType: "UPI",
              primary: input.primary,
              details: { upiId: input.upiId },
            },
          });

          if (input.primary) {
            await prisma.userPaymentMethod.updateMany({
              where: {
                userPrefrenceId: newUpi.userPrefrenceId,
                primary: true,
                id: {
                  not: newUpi.id,
                },
              },
              data: {
                primary: false,
              },
            });
          }

          return {
            message: "UPI Added Successfully",
          };
        });

        return result;
      } catch (error) {
        console.log(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong.",
        });
      }
    }),
});
