export const dynamic = 'force-dynamic';

import { Toaster } from "@/components/ui/sonner"
import type { Metadata } from 'next';
import { DM_Sans } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import { env } from "@/env.mjs";
import Providers from "../../providers";
import { UiProvider } from "providers/next-ui";

const inter = DM_Sans({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Adscrush",
  description: "Rent your account",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (

    <html lang="en" className="light" suppressHydrationWarning>
      <Providers >
        <body className={cn('bg-background grainy', inter.className)}>
          <UiProvider >
            {children}
          </UiProvider>
          <Toaster richColors closeButton />
        </body>
      </Providers>
    </html>
  );
}
