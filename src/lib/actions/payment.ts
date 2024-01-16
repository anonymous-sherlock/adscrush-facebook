"use server"

import { db } from "@/db"
import { getCurrentUser } from "../auth"
import { PayoutFormType, payoutFormSchema } from "@/schema/payment.schema"
import { z } from "zod"


interface checkPaymentMethodType {
  method: z.infer<typeof payoutFormSchema.shape.paymentMethod>
}

export async function checkPaymentMethod(
  { method }: checkPaymentMethodType
) {
  const user = await getCurrentUser()
  const parserData = payoutFormSchema.shape.paymentMethod.safeParse(method)
  if (!parserData.success) {
    return {
      error: parserData.error.message ?? "Bad Request",
    }
  }

  const paymentMethod = parserData.data

  try {
    const userPaymentMethod = await db.userPrefrence.findMany({
      where: {
        userId: user?.id,
        paymentMethod: {
          some: {
            details: {
              not: undefined
            },
            methodType: paymentMethod
          }
        }
      },
      select: {
        paymentMethod: true
      }
    })

    if (userPaymentMethod.length === 0) {
      return {
        error: `${paymentMethod} payment method not added`
      }
    }
    return {
      success: "Successfully",
    }
  } catch (error) {
    console.log(error)
    return {
      error: "Somehing Went Wrong"
    }
  }

}