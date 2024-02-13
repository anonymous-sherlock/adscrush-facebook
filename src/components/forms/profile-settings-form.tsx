"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { updateUserProfile } from "@/lib/actions/update-user";
import { ProfileFormValues, profileFormSchema } from "@/schema/user.schema";
import { Button } from "@/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/ui/form";
import { Input } from "@/ui/input";
import { isEqual } from "lodash";
import { useState, useTransition } from "react";
import { FormError } from "../form-error";
import { FormSuccess } from "../form-success";
import { Separator } from "../ui/separator";
import { Icons } from "../Icons";
import { useRouter } from "next/navigation";
import { catchError } from "@/lib/utils";
import { promise } from "zod";

interface ProfileSettingsForm {
  userDetails: {
    skype: string | undefined;
    phone: string | undefined;
    telegram: string | undefined;
    whatsapp: string | undefined;
    facebook: string | undefined;
    name: string | undefined;
    email: string | undefined;
  };
}
export function ProfileSettingsForm({ userDetails }: ProfileSettingsForm) {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const router = useRouter();

  const defaultValues: Partial<ProfileFormValues> = userDetails;
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    mode: "onChange",
    defaultValues: defaultValues,
  });

  function onSubmit(values: ProfileFormValues) {
    setError("");
    setSuccess("");
    startTransition(async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 10000));
        await updateUserProfile(values).then((data) => {
          if (data.error) setError(data.error);
          if (data.success) {
            setSuccess(data.success);
            router.refresh();
          }
        });
      } catch (err) {
        catchError(err);
      }
    });
  }
  const isFormUnchanged = isEqual(userDetails, form.watch());

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex flex-col md:grid grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="your name" {...field} disabled autoComplete="off" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Address</FormLabel>
                <FormControl>
                  <Input placeholder="your email" {...field} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input placeholder="your phone" {...field} autoComplete="off" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Separator className="my-4 col-span-2" />
          <FormField
            control={form.control}
            name="skype"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Skype</FormLabel>
                <FormControl>
                  <Input placeholder="Skype" {...field} autoComplete="off" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="telegram"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telegram</FormLabel>

                <FormControl>
                  <Input placeholder="Telegram" {...field} autoComplete="off" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="whatsapp"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Whatsapp</FormLabel>

                <FormControl>
                  <Input placeholder="Whatsapp" {...field} autoComplete="off" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="facebook"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Facebook</FormLabel>
                <FormControl>
                  <Input placeholder="Facebook" {...field} autoComplete="off" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormSuccess message={success} isCollapsible />
        <FormError message={error} />

        <Button type="submit" variant="secondary" disabled={isFormUnchanged || isPending}>
          {isPending && <Icons.spinner className=""/>}
          Update profile
        </Button>
      </form>
    </Form>
  );
}
