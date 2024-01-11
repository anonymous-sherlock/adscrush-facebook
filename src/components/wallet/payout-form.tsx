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
import { cn } from "@/lib/utils"
import { trpc } from "@/app/_trpc/client"
import { toast } from "sonner"
import { Icons } from "../Icons"

interface PayoutFormProps {
  className?: string
}

export function PayoutForm({ className }: PayoutFormProps) {

  const form = useForm<PayoutFormType>({
    resolver: zodResolver(payoutFormSchema),
    defaultValues: {
      amt: ""
    },
  })

  const { mutate: requestPayment, isLoading } = trpc.payment.requestPayout.useMutation({
    onSuccess(data) {
      toast.success(data.message)
    },
    onError(err) {
      toast.error(err.message)
    }
  })
  async function onSubmit(values: PayoutFormType) {

    requestPayment(values)
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
          <CardContent className="grid gap-6">
            <FormField
              control={form.control}
              name="amt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input placeholder="1000.0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

          </CardContent>
          <CardFooter>
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
