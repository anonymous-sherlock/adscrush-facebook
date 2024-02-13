"use client"
import Image from 'next/image'
import React from 'react'

import { deletePaymentMethod } from '@/lib/actions/payment'
import { cn } from '@/lib/utils'
import UPI_logo from "@/public/icons/upi-logo.png"
import { paymentMethodDetails } from '@/schema/payment.schema'
import { Payment_Method_Type, Prisma } from '@prisma/client'
import { Trash } from 'lucide-react'
import { toast } from 'sonner'
import { Icons } from '../Icons'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Card, CardContent } from '../ui/card'

type PaymentMethodsCardProps = {
  paymentMethod: {
    id: string;
    methodType: Payment_Method_Type;
    details: Prisma.JsonValue;
    primary: boolean;
    createdAt: Date;
    updatedAt: Date;
    userPrefrenceId: string
  }

}
export function PaymentMethodsCard({ paymentMethod }: PaymentMethodsCardProps) {
  const [isPending, startTransition] = React.useTransition()

  async function handlePayoutDelete() {
    startTransition(async () => {
      await deletePaymentMethod({ id: paymentMethod.id }).then((data) => {
        if (data.error) {
          return toast.error(data.error)
        } else {
          return toast.success(data.success)
        }
      })
    })
  }
  return (
    <Card className='p-4 shadow-sm'>
      <CardContent className='p-0 flex justify-between items-center'>
        <div className='flex items-center gap-2'>
          <Image src={UPI_logo.src} width={50} height={50} alt='payment logo' />
          <p className='font-semibold max-w-44 truncate'>{RenderPaymentMethod({ paymentMethod })}</p>
          {
            paymentMethod.primary ?
              <Badge
                className={cn(
                  "pointer-events-none rounded-sm px-2 py-0.5 font-semibold",
                  paymentMethod.primary
                    ? "border-green-600/20 bg-blue-100/80 text-blue-700"
                    : ""
                )}
              >
                {paymentMethod.primary ? "Primary" : null}
              </Badge> : null
          }
        </div>
        <div className='flex gap-2'>
          <Button variant="destructive" onClick={handlePayoutDelete} disabled={isPending}>
            {isPending ? (
              <Icons.spinner
                className="mr-2 h-4 w-4 animate-spin"
                aria-hidden="true"
              />
            ) :
              <Trash className='w-4 h-4' />
            }
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
interface RenderPaymentMethodProps {
  paymentMethod: any
}
function RenderPaymentMethod({ paymentMethod }: RenderPaymentMethodProps) {
  const parsedPaymentMethod = paymentMethodDetails.safeParse(paymentMethod);
  if (!parsedPaymentMethod.success) return null
  if ("upiId" in parsedPaymentMethod.data.details) {
    return parsedPaymentMethod.data.details.upiId
  } else {
    return (
      parsedPaymentMethod.data.details.accountHolderName  
    )
  }
}

