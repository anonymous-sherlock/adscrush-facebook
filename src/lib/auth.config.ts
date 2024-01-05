import { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import FacebookProvider from "next-auth/providers/facebook";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";

import { db } from "@/db";
import { env } from "@/env.mjs";
import { AuthError } from "@/lib/exceptions/authError";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { compare } from "bcrypt";

function getGoogleCredentials(): { clientId: string; clientSecret: string } {
  const clientId = env.GOOGLE_CLIENT_ID;
  const clientSecret = env.GOOGLE_CLIENT_SECRET;
  if (!clientId || clientId.length === 0) {
    throw new Error("Missing GOOGLE_CLIENT_ID");
  }

  if (!clientSecret || clientSecret.length === 0) {
    throw new Error("Missing GOOGLE_CLIENT_SECRET");
  }

  return { clientId, clientSecret };
}

export const authOptions: NextAuthOptions = {
  secret: env.NEXTAUTH_SECRET,
  adapter: PrismaAdapter(db),
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    GoogleProvider({
      clientId: getGoogleCredentials().clientId,
      clientSecret: getGoogleCredentials().clientSecret,
    }),
    GitHubProvider({
      clientId: env.GITHUB_ID,
      clientSecret: env.GITHUB_SECRET
    }),
    FacebookProvider({
      clientId: env.FACEBOOK_CLIENT_ID,
      clientSecret: env.FACEBOOK_CLIENT_SECRET,
    }),

    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          type: "email",
        },
        password: {
          type: "password",
        },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new AuthError("Email and password required", false);
        }
        const user = await db.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) {
          throw new AuthError("Invalid Credentials", false);
        }
        if (!user.password) {
          throw new AuthError(
            "You have not signed up using your email. Please try social login.",
            false
          );
        }

        const isValidPassword = await compare(
          credentials.password,
          user.password
        );
        if (!isValidPassword) {
          throw new AuthError("Invalid email or password", false);
        }
        return user;
      },
    }),
  ],
  callbacks: {
    async session({ token, session }) {
      if (token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.image = token.picture;
        session.user.role = token.role;
        session.user.isOnboarded = token.isOnboarded
      }
      return session;
    },
    async jwt({ token, user, trigger, session, profile, account }) {
      const dbUser = await db.user.findFirst({
        where: {
          email: token.email!,
        },
      });
      if (trigger === "update") {
        // console.log("updated", session)
        return { ...token, ...session.user };
      }

      if (!dbUser) {
        token.id = user!.id;
        return token;
      }

      return {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        picture: dbUser.image,
        role: dbUser.role,
        isOnboarded: dbUser.isOnboarded
      };
    },
    async redirect({ url, baseUrl }) {
      try {
        const callbacksUrl = new URL(url).searchParams.get("callbackUrl");
        if (callbacksUrl) {
          return `${baseUrl}${callbacksUrl}`;
        }
      } catch (error) {
        console.error("Invalid URL:", url);
        return baseUrl;
      }
      const dashboardUrl = `${baseUrl}/dashboard`;
      return dashboardUrl;
    },
  },
  debug: env.NODE_ENV === "development" ? true : false,
};
