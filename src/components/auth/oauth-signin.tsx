"use client";

import { signIn } from "next-auth/react";
import { FcGoogle, } from "react-icons/fc";
import { Github } from "lucide-react";
import { FaSquareFacebook } from "react-icons/fa6";

import { useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { DEFAULT_LOGIN_REDIRECT } from "@routes";
import { Icons } from "../Icons";

export const OAuthSignIn = () => {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");

  const onClick = (provider: "google" | "facebook" | "github") => {
    signIn(provider, {
      callbackUrl: callbackUrl || DEFAULT_LOGIN_REDIRECT,
    });
  }

  return (
    <div className="flex items-center w-full gap-x-2">
      <Button
        size="lg"
        className="w-full"
        variant="outline"
        onClick={() => onClick("google")}
      >
        <FcGoogle className="h-5 w-5" />
      </Button>
      <Button
        size="lg"
        className="w-full"
        variant="outline"
        onClick={() => onClick("facebook")}
      >
        <FaSquareFacebook className="h-5 w-5" color="#316FF6" />
      </Button>
      <Button
        size="lg"
        className="w-full"
        variant="outline"
        onClick={() => onClick("github")}
      >
        <Github className="h-5 w-5" />

      </Button>
    </div>
  );
};
