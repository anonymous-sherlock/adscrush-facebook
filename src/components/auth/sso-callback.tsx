"use client"

import * as React from "react";

import { SSOCallbackPageProps } from "@/app/(auth)/sso-callback/page";
import { newVerification } from "@/lib/actions/new-account-verification";
import { Loader2 } from "lucide-react";
import { FormError } from "../form-error";
import { FormSuccess } from "../form-success";
import { authPages } from "@routes";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function SSOCallback({ searchParams: { token } }: SSOCallbackPageProps) {
    const router = useRouter()
    const [error, setError] = React.useState<string | undefined>();
    const [success, setSuccess] = React.useState<string | undefined>();
    const [loading, setLoading] = React.useState(true);

    const onSubmit = React.useCallback(() => {
        if (success || error) return;
        if (!token) {
            setError("Missing token!");
            return;
        }
        newVerification(token).then((data) => {
            setSuccess(data.success)
            setError(data.error)

            if (data.success) {
                router.push(authPages.login)
                return toast.success(data.success)
            }
        }).catch(() => {
            setError("Something went wrong!");
        }).finally(() => {
            setLoading(false);
        })

    }, [token, success, error, router]);

    React.useEffect(() => {
        onSubmit();
    }, [onSubmit]);

    return (
        <div
            role="status"
            aria-label="Loading"
            aria-describedby="loading-description"
            className="flex items-center justify-center rounded-lg border bg-card text-card-foreground shadow-sm w-full py-20 px-4 mx-auto max-[375px]:ml-2">
            <div className='w-full flex justify-center'>
                <div className='flex flex-col items-center gap-2'>
                    {loading && !error && (
                        <>
                            <Loader2 className="h-8 w-8 animate-spin text-zinc-800" />
                            <h3 className="font-semibold text-xl text-center">
                                Setting up your account...
                            </h3>
                            <p className="text-center">You will be redirected automatically.</p>
                            {
                                success && <FormSuccess message={"Email verified"} classname="my-2 justify-center" />
                            }
                        </>
                    )}
                    {error && !success && (
                        <>
                            <h3 className="max-w-screen-sm mx-auto font-roboto font-bold text-3xl leading-tight text-center text-gray-700 mb-4">
                                Woops! <br /> Something went wrong :{"("}
                            </h3>
                            <p className="max-w-screen-md mx-auto font-roboto text-base font-normal leading-relaxed text-center text-gray-700 mb-6">
                                Have you tried sign in and sign off again?
                            </p>
                            <FormError message={error} classname="justify-center" />
                            <div className="text-sm text-foreground mt-5">
                                Go Back to{" "}
                                <Link
                                    aria-label="Sign in"
                                    href={authPages.login}
                                    className="text-primary underline-offset-4 transition-colors hover:underline"
                                >
                                    Sign in
                                </Link>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}
