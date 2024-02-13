"use client"
import { trpc } from '@/app/_trpc/client';
import {
    Dialog,
    DialogContent,
    DialogTrigger
} from "@/components/ui/dialog";
import { cn } from '@/lib/utils';
import { UpiFormType, upiFormSchema } from '@/schema/payment.schema';
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

interface AddUpiFormProps {
    className?: string
}

export function AddUpiForm({ className }: AddUpiFormProps) {
    const [open, setOpen] = useState<boolean>(false);
    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");
    const router = useRouter()

    const form = useForm<UpiFormType>({
        resolver: zodResolver(upiFormSchema),
        defaultValues: {
            upiId: "",
        },
    })
    const { mutate: addUPI, isLoading } = trpc.payment.addPaymentMethod.useMutation({
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
    async function onSubmit(values: UpiFormType) {
        addUPI(values)
    }
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className={cn('bg-secondary flex', className)}>Add UPI ID</Button>
            </DialogTrigger>
            <DialogContent>
                <Form {...form} >
                    <form onSubmit={form.handleSubmit(onSubmit)} className={cn("shrink-0")}>
                        <Card className="w-full border-none shadow-none">
                            <CardHeader>
                                <CardTitle className='text-xl'>Add UPI Payment</CardTitle>
                                <CardDescription>
                                    Add a UPI payment method for payout.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className=" grow gap-6">
                                <FormField
                                    control={form.control}
                                    name="upiId"
                                    render={({ field }) => (
                                        <FormItem className="grow w-full">
                                            <FormLabel>UPI ID</FormLabel>
                                            <FormControl>
                                                <Input placeholder="example@okaxis" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="primary"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-start space-x-3 mt-4 space-y-0 rounded-md border p-4">
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
                            <CardFooter className="flex-col gap-2">
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
                                    Add UPI ID
                                    <span className="sr-only">Add UPI ID</span>
                                </Button>
                            </CardFooter>
                        </Card>
                    </form>
                </Form >
            </DialogContent>
        </Dialog>
    )
}
