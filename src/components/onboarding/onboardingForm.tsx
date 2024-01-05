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
import { addDetails, validateOtp } from "@/lib/actions/onboarding";
import useFileUpload from "@/lib/hooks/useFileUpload";
import { catchError, cn } from "@/lib/utils";
import { FBOnboardingSchema } from "@/schema/onboarding.schema";
import { FileWithPreview } from "@/types";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select";
import { Separator } from "../ui/separator";
import { AadharUploader } from "./AadharUploader";
import { AlternateIdUploader } from "./AlternateIdUploader";
import { DobPickerForm } from "./Dob";
import { toast } from "sonner";
import { FormError } from "../form-error";
import { Icons } from "../Icons";
import { Check, Send } from "lucide-react";


type OnboardingFormProps = {


};

export function OnboardingForm({ }: OnboardingFormProps) {
  const [aadhaarFiles, setAadhaarFiles] = React.useState<FileWithPreview[] | null>(null)
  const [alternateIdFiles, setAlternateIdFiles] = React.useState<FileWithPreview[] | null>(null)
  const [emailVerified, setEmailVerified] = useState<boolean>(false)

  const [otp, setOtp] = useState<string>("")
  const [otpSent, setOtpSent] = useState<boolean>(false)

  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [timer, setTimer] = useState<number | null>(null);


  const router = useRouter()

  const { upload } = useFileUpload({
    endpoint: "documentsUploader"
  })

  const [isPending, startTransition] = React.useTransition()
  const [isSendingCode, startSendingCodeTransition] = React.useTransition()

  const form = useForm<z.infer<typeof FBOnboardingSchema>>({
    resolver: zodResolver(FBOnboardingSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      primaryID: {
        IDname: "Aadhaar ID"
      },
      alternativeID: {},
      fbPassword: "",
      fbProfileLink: "",
      fbUsername: "",
      gender: "Male"
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof FBOnboardingSchema>) {
    startTransition(async () => {
      setError("");
      setSuccess("");

      if (!emailVerified) {
        setError("Email not verified")
        return
      }
      try {
        if (!aadhaarFiles || !alternateIdFiles) throw new Error("No documents provided")

        const [primaryImages, alternateIdImages] = await Promise.all([
          upload({ files: aadhaarFiles }),
          upload({ files: alternateIdFiles })
        ]);

        if (!primaryImages?.data.files || !alternateIdImages?.data.files) {
          throw new Error("Files Upload failed")
        }

        const { primaryID, alternativeID, ...valuesWithoutFiles } = values;

        // Assuming addDetails returns a Promise
        addDetails({
          ...valuesWithoutFiles,
          emailVerified: emailVerified,
          alternateIdName: values.alternativeID.IDname,
          primaryIdName: values.primaryID.IDname,
          aadhaarFiles: primaryImages?.data.files,
          alternateIdFiles: alternateIdImages?.data.files
        }).then((data) => {
          setError(data?.error);
          setSuccess(data?.success);
        });

      } catch (err) {
        catchError(err);
      }
    })
  }


  // Start the timer when the component mounts
  useEffect(() => {
    if (timer !== null) {
      const interval = setInterval(() => {
        setTimer((prevTimer) => (prevTimer !== null ? prevTimer - 1 : null));
      }, 1000);

      // Clear the interval when the component unmounts or when the timer reaches 0
      return () => {
        clearInterval(interval);
        if (timer === 0) {
          setTimer(null);
        }
      };
    }
  }, [timer]);

  async function handleEmailVerification() {
    setError("");
    setSuccess("");
    const email = form.getValues("email")
    startSendingCodeTransition(async () => {
      const parsedEmail = FBOnboardingSchema.shape.email.safeParse(email)
      if (!parsedEmail.success) {
        return setError("Email is not valid")
      }

      await new Promise((resolve) => setTimeout(resolve, 2500));
      setTimer(30);
      setOtpSent(true)

    })
  }

  async function handleOtpValidation() {
    validateOtp({
      email: form.getValues("email"),
      otp: otp
    }).then((data) => {
      if (data?.success) {
        setEmailVerified(true)
      }

    })
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

                {/* phone */}
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-card-foreground">Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="7895687458" {...field} />
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
                      <FormLabel className="text-card-foreground">Email</FormLabel>
                      <FormControl>
                        <Input placeholder="abc@examle.com" {...field} disabled={emailVerified} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex flex-1 justify-center items-end gap-2">
                  <FormItem className="w-full">
                    <FormLabel className="text-card-foreground">Verfication code</FormLabel>
                    <FormControl>
                      <Input placeholder="DJZ-TLX" value={otp} onChange={({ target }) => setOtp(target.value)} disabled={emailVerified || !otpSent} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                  {emailVerified || !otpSent ? null : (
                    <Button
                      type="button"
                      className="m-0 self-end text-sm shrink-0"
                      variant="secondary"
                      onClick={handleOtpValidation}
                      disabled={emailVerified}
                    >
                      <Check className="h-4 w-4 text-green-500" />
                    </Button>
                  )}


                  {
                    !emailVerified ?
                      <Button type="button" className="m-0 self-end text-sm shrink-0" variant="secondary"
                        onClick={handleEmailVerification}
                        disabled={isSendingCode || timer !== null}
                      >
                        {timer !== null ? (
                          `${timer}s`
                        ) : isSendingCode ? (
                          <>
                            <Icons.spinner className="h-4 w-4 animate-spin" aria-hidden="true" />                      </>
                        ) : (
                          <Send className="h-4 w-4 text-primary" />
                        )}

                      </Button> : null
                  }
                </div>
              </div>

              <div className="flex flex-col md:grid grid-cols-2 gap-4">
                {/* Facebook Username */}
                <FormField
                  control={form.control}
                  name="fbUsername"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-card-foreground">Facebook Username</FormLabel>
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
                      <FormLabel className="text-card-foreground">Facebook Password</FormLabel>
                      <FormControl>
                        <Input placeholder="******" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* gender */}
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-card-foreground">Gender</FormLabel>
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
                    <FormLabel className="text-card-foreground">Facebook Profile Link</FormLabel>
                    <FormControl>
                      <Input placeholder="https://www.facebook.com/profile.php?id=6789518979465" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <AadharUploader files={aadhaarFiles} setFiles={setAadhaarFiles} />
              <AlternateIdUploader files={alternateIdFiles} setFiles={setAlternateIdFiles} />

            </div>
            <FormError message={error} />
            <Button
              type="submit"
              className={cn("w-full col-span-1 mt-4")}
              disabled={isPending}
            >
              {isPending && (
                <Icons.spinner
                  className="mr-2 h-4 w-4 animate-spin"
                  aria-hidden="true"
                />
              )}
              Continue
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>

  );
}
