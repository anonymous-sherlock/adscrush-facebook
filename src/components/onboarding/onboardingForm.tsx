"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { FBOnboardingSchema } from "@/schema/onboarding.schema";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select";
import { Separator } from "../ui/separator";
import { DobPickerForm } from "./Dob";


type OnboardingFormProps = {


};

export function OnboardingForm({ }: OnboardingFormProps) {

  const [open, setOpen] = useState(false);

  const router = useRouter()



  const form = useForm<z.infer<typeof FBOnboardingSchema>>({
    resolver: zodResolver(FBOnboardingSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      aadharCard: "",
      alternativeID: "",
      fbPassword: "",
      fbProfileLink: "",
      fbUsername: "",
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof FBOnboardingSchema>) {
    console.log(values)
  }

  return (

    <Card className="p-6 w-full max-w-3xl bg-white mx-auto">
      <CardContent className="mt-2 w-full p-0">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            method="post"
            className="flex flex-col items-start gap-6 space-y-4"
          >
            <div className="flex w-full flex-col gap-6">

              <div className="flex flex-col md:grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-card-foreground" >Name as per Govt. ID Card</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* email */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="abc@examle.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* phone */}
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="7895687458" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex flex-1 justify-center items-center gap-2">
                  <FormItem className="w-full">
                    <FormLabel>Verfication code</FormLabel>
                    <FormControl>
                      <Input placeholder="789586" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>

                  <Button type="button" className="m-0 self-end text-sm shrink-0" variant="secondary">Send Code</Button>
                </div>
              </div>

              <div className="flex flex-col md:grid grid-cols-2 gap-4">
                {/* Facebook Username */}
                <FormField
                  control={form.control}
                  name="fbUsername"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Facebook Username</FormLabel>
                      <FormControl>
                        <Input placeholder="andi45" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="fbPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Facebook Password</FormLabel>
                      <FormControl>
                        <Input placeholder="******" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* target gender */}
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Target Gender</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl className="capitalize">
                          <SelectTrigger className="w-full capitalize h-11">
                            <SelectValue
                              placeholder="Select a Gender"
                              className="lowercase"
                            />
                          </SelectTrigger>
                        </FormControl>

                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Sselect a Gender</SelectLabel>
                            <Separator className="my-2" />
                            {["Male", "Female", "Other"].map((value) => (
                              <SelectItem
                                key={value}
                                value={value}
                                className="capitalize"
                              >
                                {value}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DobPickerForm />

              </div>

              {/* Facebook profile link */}
              <FormField
                control={form.control}
                name="fbProfileLink"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Facebook Profile Link</FormLabel>
                    <FormControl>
                      <Input placeholder="https://www.facebook.com/profile.php?id=6789518979465" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

            </div>
            <Button
              type="submit"
              className={cn("w-full col-span-1 mt-4")}

            >
              Continue
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>

  );
}
