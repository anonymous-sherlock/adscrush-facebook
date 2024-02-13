import { TRPCError } from "@trpc/server";
import { type ClassValue, clsx } from "clsx";
import { env } from "process";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";
import { z } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(
  price: number | string,
  options: {
    currency?: "INR" | "USD" | "EUR" | "GBP" | "BDT";
    notation?: Intl.NumberFormatOptions["notation"];
    decimal?: boolean | number;
  } = {}
) {
  const { currency = "INR", notation = "standard", decimal = false } = options; // Change here

  const numericPrice = typeof price === "string" ? parseFloat(price) : price;

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    notation,
    maximumFractionDigits: !decimal ? 0 : Number(decimal),
  }).format(numericPrice);
}

export function formatDate(
  date: Date | string | number,
  options: Intl.DateTimeFormatOptions = {
    month: "long",
    day: "numeric",
    year: "numeric",
  }
) {
  return new Intl.DateTimeFormat("en-IN", {
    ...options,
  }).format(new Date(date));
}

export function toSentenceCase(str: string) {
  return str
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase());
}

export function absoluteUrl(path: string) {
  if (typeof window !== "undefined") return path;
  if (env.NEXT_PUBLIC_VERCEL_URL)
    return `https://${env.NEXT_PUBLIC_VERCEL_URL}${path}`;
  return `http://localhost:${process.env.PORT ?? 3000}${path}`;
}

export function formatBytes(
  bytes: number,
  decimals = 0,
  sizeType: "accurate" | "normal" = "normal"
) {
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const accurateSizes = ["Bytes", "KiB", "MiB", "GiB", "TiB"];
  if (bytes === 0) return "0 Byte";
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(decimals)} ${
    sizeType === "accurate" ? accurateSizes[i] ?? "Bytest" : sizes[i] ?? "Bytes"
  }`;
}

export function catchError(err: unknown) {
  if (err instanceof z.ZodError) {
    const errors = err.issues.map((issue) => {
      return issue.message;
    });
    return toast(errors.join("\n"));
  } else if (err instanceof Error) {
    return toast(err.message);
  } else if (err instanceof TRPCError) {
    return toast(err.message);
  } else {
    return toast("Something went wrong, please try again later.");
  }
}

export function isArrayOfFile(files: unknown): files is File[] {
  const isArray = Array.isArray(files);
  if (!isArray) return false;
  return files.every((file) => file instanceof File);
}

// utils/generateVerificationCode.ts
export const generateVerifyCode = (): string => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let code = "";
  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    code += characters.charAt(randomIndex);
  }
  // Insert hyphen after every 3 characters
  code = code.substring(0, 3) + "-" + code.substring(3);
  return code;
};

type ServerFunction<T> = () => Promise<T>;
export async function wrapServerCall<T>(
  serverFunction: ServerFunction<T>
): Promise<T | null> {
  try {
    return await serverFunction();
  } catch (error) {
    console.error(error);
    return null;
  }
}

export function formatAccountNumber(
  accountNumber: string,
  visibleInitialDigits: number = 4,
  visibleLastDigits: number = 4
): string {
  const totalDigits = accountNumber.length;

  // If the account number is shorter than the visible digits, show the entire number
  if (totalDigits <= visibleInitialDigits + visibleLastDigits) {
    return accountNumber;
  }

  const hiddenDigits = totalDigits - visibleInitialDigits - visibleLastDigits;

  // Show the initial part, replace the middle part with asterisks, and show some last digits
  const initialPart = accountNumber.slice(0, visibleInitialDigits);
  const hiddenPart = "*".repeat(hiddenDigits);
  const lastPart = accountNumber.slice(-visibleLastDigits);

  return `${initialPart}${hiddenPart}${lastPart}`;
}
