"use client"
import { PayoutFormType, payoutFormSchema } from "@/schema/payment.schema"
import { Button } from "@/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/ui/card"
import { Input } from "@/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { catchError, cn } from "@/lib/utils"
import { trpc } from "@/app/_trpc/client"
import { toast } from "sonner"
import { Icons } from "../Icons"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import React, { useEffect, useState } from "react"
import { FormSuccess } from "../form-success"
import { FormError } from "../form-error"
import { checkPaymentMethod, getUserPayoutDetails } from "@/lib/actions/payment"
import { z } from "zod"

interface PayoutFormProps {
  className?: string
}

export function PayoutForm({ className }: PayoutFormProps) {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [data, setData] = useState<Awaited<ReturnType<typeof getUserPayoutDetails>>>();

  const [isPending, startTransition] = React.useTransition()

  const form = useForm<PayoutFormType>({
    resolver: zodResolver(payoutFormSchema),
    defaultValues: {
      amt: "",
    },
  })

  const { mutate: requestPayment, isLoading } = trpc.payment.requestPayout.useMutation({
    onSuccess(data) { toast.success(data.message) },
    onError(err) {
      setError(err.message)
      toast.error(err.message)
    }
  })


  useEffect(() => {

    (async () => {

      await getUserPayoutDetails().then((data) => {
        if (data) setData(data)
      })
    })()
  }, [])


  async function onSubmit(values: z.infer<typeof payoutFormSchema>) {
    console.log(values)
    startTransition(async () => {
      try {
        const data = await checkPaymentMethod({ method: values.paymentMethod })
        setError(data?.error);

        if (!data?.error) {
          requestPayment(values)
          // setSuccess(data.success);
        }
      } catch (err) {
        catchError(err);
      }

    })
  }


  return (
    <Form {...form} >
      <form onSubmit={form.handleSubmit(onSubmit)} className={cn("shrink-0 shadow-sm", className)}>
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Payout</CardTitle>
            <CardDescription>
              Request a payout from wallet.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex grow gap-6">
            <FormField
              control={form.control}
              name="paymentMethod"
              render={({ field }) => (
                <FormItem className="grow w-full">
                  <FormLabel>Payment Method</FormLabel>
                  <Select onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger >
                        <SelectValue placeholder="Select a payment method" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent >
                      {
                        data && data.map((paymentMethod) => (
                          <SelectItem value={paymentMethod.id} key={paymentMethod.id}>
                            {
                              paymentMethod.details && typeof paymentMethod.details === "object" && ("upiId" in paymentMethod.details && typeof paymentMethod.details.upiId === "string") && (
                                paymentMethod.details.upiId
                              )
                            }

                          </SelectItem>
                        ))
                      }
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="amt"
              render={({ field }) => (
                <FormItem className="">
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input placeholder="500.0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

          </CardContent>
          <CardFooter className="flex-col gap-2">
            <FormSuccess message={success} />
            <FormError message={error} />

            <Button className="w-full mb-2">
              {isLoading && (
                <Icons.spinner
                  className="mr-2 h-4 w-4 animate-spin"
                  aria-hidden="true"
                />
              )}
              Request Payout
              <span className="sr-only">Request a payout</span>
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form >
  )
}
