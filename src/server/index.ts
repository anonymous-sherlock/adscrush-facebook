import { inferReactQueryProcedureOptions } from "@trpc/react-query";
import { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import { onboardingRouter } from "./routers/onboarding.router";
import { userRouter } from "./routers/user.router";
import { router } from "./trpc";

export const appRouter = router({
  user: userRouter,
  onboarding: onboardingRouter
});

export type AppRouter = typeof appRouter;
export type ReactQueryOptions = inferReactQueryProcedureOptions<AppRouter>;
export type RouterInputs = inferRouterInputs<AppRouter>;
export type RouterOutputs = inferRouterOutputs<AppRouter>;
