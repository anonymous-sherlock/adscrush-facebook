"use client"
import { deletePaymentMethod } from '@/lib/actions/payment';
import { cn, formatAccountNumber } from '@/lib/utils';
import { paymentMethodDetails } from '@/schema/payment.schema';
import { Avatar } from '@nextui-org/react';
import { Payment_Method_Type, Prisma } from '@prisma/client';
import { Trash } from 'lucide-react';
import React from 'react';
import { toast } from 'sonner';
import { Icons } from '../Icons';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';

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
          <div className='font-semibold max-w-52 truncate'>{RenderPaymentMethod({ paymentMethod })}</div>
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
    return (
      <div className="flex items-center gap-2">
        <Avatar
          alt="Upi Id"
          className="flex-shrink-0 w-7 h-7"
          size="sm"
          src={`https://avatar.vercel.sh/fjksdffasdhfkasdhfkjgsadfht.png`}
        />
        <div className="flex flex-col items-start">
          <span>UPI ID</span>
          <span className="text-default-500 text-tiny">{parsedPaymentMethod.data.details.upiId}</span>
        </div>
      </div>
    )
  } else {
    return (
      <div className="flex items-center gap-2">
        <Avatar
          alt="Upi Id"
          className="flex-shrink-0 w-7 h-7"
          size="sm"
          src={`https://avatar.vercel.sh/a1b23456789.png`}
        />
        <div className="flex flex-col items-start">
          <span>{parsedPaymentMethod.data.details.accountHolderName}</span>
          <span className="text-default-500 text-tiny">{parsedPaymentMethod.data.details.bankName} - {formatAccountNumber(parsedPaymentMethod.data.details.accountNumber)}</span>
        </div>
      </div>
    )
  }
}

