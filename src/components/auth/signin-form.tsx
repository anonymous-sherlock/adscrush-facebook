"use client"

import { useRouter, useSearchParams } from "next/navigation"
import * as React from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import type { z } from "zod"

import { Icons } from "@/components/Icons"
import { PasswordInput } from "@/components/auth/password-input"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { login } from "@/lib/actions/login"
import { loginSchema } from "@/schema/auth.schema"
import { DEFAULT_LOGIN_REDIRECT } from "@routes"
import { signIn } from "next-auth/react"
import { toast } from "sonner"
import { FormError } from "../form-error"
import { FormSuccess } from "../form-success"

type Inputs = z.infer<typeof loginSchema>

export function SignInForm() {
  const router = useRouter()
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");

  const urlError = searchParams.get("error") === "OAuthAccountNotLinked"
    ? "Email already in use with different provider!"
    : "";

  const [error, setError] = React.useState<string | undefined>("");
  const [success, setSuccess] = React.useState<string | undefined>("");
  const [loading, setLoading] = React.useState(false);


  // react-hook-form
  const form = useForm<Inputs>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(values: Inputs) {
    try {
      setLoading(true);
      await login(values).then(async (data) => {
        setError(data.error);
        setSuccess(data.success);
        // check if they can login
        if (data.canLogin) {
          const response = await signIn("credentials", {
            email: values.email,
            password: values.password,
            redirect: false
          })
          if (response) {
            if (response.error) {
              setError(response.error);
            } else {
              toast.message("Login Successful", {
                description: "Redirecting to dashboard..."
              })
              router.push(callbackUrl ? callbackUrl : DEFAULT_LOGIN_REDIRECT)
            }
          }
        }
      })
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false); // Set loading to false when the asynchronous operation is complete
    }
  }

  return (
    <Form {...form}>
      <form
        className="grid gap-4"
        onSubmit={(...args) => void form.handleSubmit(onSubmit)(...args)}
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="rodneymullen180@gmail.com"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <PasswordInput placeholder="**********" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormError message={error || urlError} />
        <FormSuccess message={success} />

        <Button type="submit" disabled={loading}>
          {loading && (
            <Icons.spinner
              className="mr-2 h-4 w-4 animate-spin"
              aria-hidden="true"
            />
          )}
          Sign in
          <span className="sr-only">Sign in</span>
        </Button>
      </form>
    </Form>
  )
}
