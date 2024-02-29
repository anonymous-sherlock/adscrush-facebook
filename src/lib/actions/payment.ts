"use server";
import { db } from "@/db";
import {
  paymentMethodDetails,
  payoutFormSchema,
} from "@/schema/payment.schema";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getCurrentUser } from "../auth";
import { Payment_Status } from "@prisma/client";
import { resolve } from "path";

interface checkPaymentMethodType {
  method: z.infer<typeof payoutFormSchema.shape.paymentMethod>;
}

export async function checkPaymentMethod({ method }: checkPaymentMethodType) {
  const user = await getCurrentUser();
  const parserData = payoutFormSchema.shape.paymentMethod.safeParse(method);
  if (!parserData.success) {
    return {
      error: parserData.error.message ?? "Bad Request",
    };
  }

  const paymentMethod = parserData.data;

  try {
    const userPaymentMethod = await db.userPrefrence.findMany({
      where: {
        userId: user?.id,
        paymentMethod: {
          some: {
            id: paymentMethod,
            details: {
              not: undefined,
            },
          },
        },
      },
      select: {
        paymentMethod: true,
      },
    });

    if (userPaymentMethod.length === 0) {
      return {
        error: `${paymentMethod} payment method not added`,
      };
    }
    return {
      success: "Successfully",
    };
  } catch (error) {
    console.log(error);
    return {
      error: "Somehing Went Wrong",
    };
  }
}

interface deletePaymentMethodType {
  id: string;
}

export async function deletePaymentMethod({ id }: deletePaymentMethodType) {
  try {
    await db.$transaction(async (prisma) => {
      const existingPaymentMethod = await prisma.userPaymentMethod.findFirst({
        where: {
          id: id,
        },
      });

      if (!existingPaymentMethod) {
        throw new Error("No payment method found");
      }

      const isPrimary = existingPaymentMethod.primary;

      await prisma.userPaymentMethod.delete({
        where: { id },
      });

      // If the deleted method was primary, find the first remaining method and set it as primary
      if (isPrimary) {
        const remainingPaymentMethod = await prisma.userPaymentMethod.findFirst(
          {
            where: {
              id: {
                not: {
                  equals: existingPaymentMethod.id,
                },
              },
              primary: false,
            },
          }
        );

        if (remainingPaymentMethod) {
          await prisma.userPaymentMethod.update({
            where: { id: remainingPaymentMethod.id },
            data: {
              primary: true,
            },
          });
        }
      }

      revalidatePath("/settings/payout");
    });

    return {
      success: "Payout method deleted successfully",
    };
  } catch (error) {
    console.error(error);
    return {
      error: "Something went wrong",
    };
  } finally {
    await db.$disconnect();
  }
}

export async function getUserPayoutDetails() {
  const user = await getCurrentUser();
  const payoutMethods = await db.userPaymentMethod.findMany({
    where: {
      UserPrefrence: {
        userId: user?.id,
      },
    },
    select: {
      id: true,
      details: true,
      primary: true,
    },
  });


  return payoutMethods;
}



interface changePaymentStatusType {
  id: string;
  status: Payment_Status
}

export async function changePaymentStatus({ id, status }: changePaymentStatusType) {
  // const existingPayment = await db.payment.findFirst({
  //   where: { id },
  //   select: { id: true, status: true, amount: true, walletId: true },
  // });

  // if (!existingPayment) {
  //   throw new Error("Payment not found");
  // }
  // if (existingPayment.status === "PAID" && status === "CANCELLED") {
  //   await db.$transaction([
  //     db.payment.update({
  //       where: { id: existingPayment.id },
  //       data: {
  //         wallet: {
  //           update: {
  //             balance: { increment: existingPayment.amount }
  //           }
  //         },
  //       },
  //     })
  //   ])
  // }
  // if (existingPayment.status === "CANCELLED" && status === "PAID") {
  //   await db.$transaction([
  //     db.payment.update({
  //       where: { id: existingPayment.id },
  //       data: {
  //         wallet: {
  //           update: {
  //             balance: { decrement: existingPayment.amount }
  //           }
  //         },
  //       },
  //     })
  //   ])
  // }

  // const [updatedPayment] = await db.$transaction([
  //   db.payment.update({ where: { id: id }, data: { status: status } })
  // ])

  // return {
  //   success: "Payment status changed successfully",
  //   status: updatedPayment.status
  // }
}