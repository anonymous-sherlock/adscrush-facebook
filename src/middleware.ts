import { env } from "@/env.mjs";
import { DEFAULT_LOGIN_REDIRECT, ONBOARDING_REDIRECT, apiAuthPrefix, apiPrefix, authRoutes, publicRoutes } from "@routes";
import { withAuth } from "next-auth/middleware";

export default withAuth(
  // `withAuth` augments your `Request` with the user's token.
  function middleware(req) {
    const { nextUrl } = req;
    const isLoggedIn = !!req.nextauth.token;

    const isOnboarded = req.nextauth.token?.isOnboarded

    const isApiRoute = nextUrl.pathname.startsWith(apiPrefix);
    const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
    const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
    const isAuthRoute = authRoutes.includes(nextUrl.pathname);


    console.log("logged in : ", isLoggedIn)
    if (isApiAuthRoute) {
      return null;
    }

    if (isAuthRoute) {
      if (isLoggedIn) {
        return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
      }
      return null;
    }

    if (!isOnboarded && !nextUrl.pathname.startsWith(ONBOARDING_REDIRECT)) {
      if (!isPublicRoute && !isApiAuthRoute && !isAuthRoute && !isApiRoute) {
        return Response.redirect(new URL(ONBOARDING_REDIRECT, nextUrl));
      }
    }


    if (!isLoggedIn && !isPublicRoute) {
      let callbackUrl = nextUrl.pathname;
      if (nextUrl.search) {
        callbackUrl += nextUrl.search;
      }

      const encodedCallbackUrl = encodeURIComponent(callbackUrl);

      return Response.redirect(new URL(
        `/sign-in?callbackUrl=${encodedCallbackUrl}`,
        nextUrl
      ));
    }

    return null;
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        const pathname = req.nextUrl.pathname;

        const protectedRoutes = [
          ONBOARDING_REDIRECT,
          "/dashboard",

        ];
        if (!!token === false && protectedRoutes.includes(pathname)) {
          return false;
        }
        return true;
      },
    },

    pages: {
      signIn: "/sign-in",
    },
    secret: env.NEXTAUTH_SECRET,
  }
);
export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
