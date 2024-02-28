import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    DATABASE_URL: z.string().url(),

    GOOGLE_CLIENT_ID: z.string().min(1),
    GOOGLE_CLIENT_SECRET: z.string().min(1),

    FACEBOOK_CLIENT_ID: z.string().min(1),
    FACEBOOK_CLIENT_SECRET: z.string().min(1),

    NEXTAUTH_SECRET: z.string().min(1),
    NEXTAUTH_URL: z.string().min(1),

    GITHUB_ID: z.string().min(1),
    GITHUB_SECRET: z.string().min(1),

    CDN_API_KEY: z.string().min(1),
    CDN_UPLOAD_URL: z.string().min(1),

    RESEND_API_KEY: z.string().min(1),
    RESEND_DOMAIN: z.string(),
    EMAIL_FROM_ADDRESS: z.string().email(),
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    NEXT_PUBLIC_APP_URL: z.string().url(),

    NEXT_PUBLIC_VERCEL_URL: z.string().optional(),
    NEXT_PUBLIC_NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    DATABASE_URL: process.env.DATABASE_URL,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,

    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,

    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,

    FACEBOOK_CLIENT_ID: process.env.FACEBOOK_CLIENT_ID,
    FACEBOOK_CLIENT_SECRET: process.env.FACEBOOK_CLIENT_SECRET,

    GITHUB_ID: process.env.GITHUB_ID,
    GITHUB_SECRET: process.env.GITHUB_SECRET,

    CDN_API_KEY: process.env.CDN_API_KEY,
    CDN_UPLOAD_URL: process.env.CDN_UPLOAD_URL,

    RESEND_API_KEY: process.env.RESEND_API_KEY,
    RESEND_DOMAIN: process.env.RESEND_DOMAIN,
    EMAIL_FROM_ADDRESS: process.env.EMAIL_FROM_ADDRESS,

    NEXT_PUBLIC_VERCEL_URL: process.env.NEXT_PUBLIC_VERCEL_URL,
    NEXT_PUBLIC_NODE_ENV: process.env.NODE_ENV,
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
   * useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION || !!import.meta.vitetest,
  /**
   * Makes it so that empty strings are treated as undefined.
   * `SOME_VAR: z.string()` and `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true,
});
