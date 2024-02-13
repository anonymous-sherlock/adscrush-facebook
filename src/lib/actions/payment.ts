"use server";

import { db } from "@/db";
import {
  paymentMethodDetails,
  payoutFormSchema,
} from "@/schema/payment.schema";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getCurrentUser } from "../auth";

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
    },
  });

  const parsedData = z.array(paymentMethodDetails).safeParse(payoutMethods);

  if (!parsedData.success) {
    return null;
  }
  return payoutMethods;
}
