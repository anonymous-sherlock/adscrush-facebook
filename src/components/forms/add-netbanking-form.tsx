"use client"
import { trpc } from '@/app/_trpc/client';
import {
  Dialog,
  DialogContent,
  DialogTrigger
} from "@/components/ui/dialog";
import { cn } from '@/lib/utils';
import { NetBankingFormType, netbankingFormSchema } from '@/schema/payment.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Icons } from '../Icons';
import { FormError } from '../form-error';
import { FormSuccess } from '../form-success';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Checkbox } from '../ui/checkbox';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';

interface AddNetbankingFormProps {
  className?: string
}

export function AddNetbankingForm({ className }: AddNetbankingFormProps) {
  const [open, setOpen] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const router = useRouter()

  const form = useForm<NetBankingFormType>({
    resolver: zodResolver(netbankingFormSchema),
    defaultValues: {
      accountHolderName: "",
      accountNumber: "",
      bankName: "",
      branchName: "",
      ifscCode: "",
      primary: false

    },
  })
  const { mutate: addNetbanking, isLoading } = trpc.payment.addPaymentMethod.useMutation({
    onMutate() {
      setSuccess("")
      setError("")
    },
    onError(error) {
      setError(error.message)
    },
    onSuccess(data) {
      setSuccess(data.message)
      form.reset()
      router.refresh()
      setTimeout(() => {
        setOpen(false)
        setSuccess("")
        setError("")
      }, 1000);
    },
  })
  async function onSubmit(values: NetBankingFormType) {
    addNetbanking(values)
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className={cn('bg-secondary flex', className)}>Add Netbanking</Button>
      </DialogTrigger>
      <DialogContent>
        <Form {...form} >
          <form onSubmit={form.handleSubmit(onSubmit)} className={cn("shrink-0")}>
            <Card className="w-full border-none shadow-none">
              <CardHeader className='p-0'>
                <CardTitle className='text-xl'>Add Netbanking Payment</CardTitle>
                <CardDescription>
                  Add a netbanking payment method for payout.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-2 grow gap-5 p-0 pt-4">
                <FormField
                  control={form.control}
                  name="accountHolderName"
                  render={({ field }) => (
                    <FormItem className="grow w-full col-span-2">
                      <FormLabel className='text-foreground'>Account Holder Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="accountNumber"
                  render={({ field }) => (
                    <FormItem className="grow w-full">
                      <FormLabel className='text-foreground'>Account Number</FormLabel>
                      <FormControl>
                        <Input placeholder="2452********4521" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="bankName"
                  render={({ field }) => (
                    <FormItem className="grow w-full">
                      <FormLabel className='text-foreground'>Bank Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Axis" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="branchName"
                  render={({ field }) => (
                    <FormItem className="grow w-full">
                      <FormLabel className='text-foreground'>Branch Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Noida" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="ifscCode"
                  render={({ field }) => (
                    <FormItem className="grow w-full">
                      <FormLabel className='text-foreground'>IFSC Code</FormLabel>
                      <FormControl>
                        <Input placeholder="UTIB****049" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="primary"
                  render={({ field }) => (
                    <FormItem className="col-span-2 flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          Make this payment method primary
                        </FormLabel>

                      </div>
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter className="flex-col gap-2 p-0 pt-4">
                <FormSuccess message={success} />
                <FormError message={error} />

                <Button className="w-full mb-2"
                  disabled={isLoading}>
                  {isLoading && (
                    <Icons.spinner
                      className="mr-2 h-4 w-4 animate-spin"
                      aria-hidden="true"
                    />
                  )}
                  Add Details
                  <span className="sr-only">Add Details</span>
                </Button>
              </CardFooter>
            </Card>
          </form>
        </Form >
      </DialogContent>
    </Dialog>
  )
}
