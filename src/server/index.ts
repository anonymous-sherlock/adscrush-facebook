import { inferReactQueryProcedureOptions } from "@trpc/react-query";
import { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import { onboardingRouter } from "./routers/onboarding.router";
import { userRouter } from "./routers/user.router";
import { router } from "./trpc";
import { dashboardRouter } from "./routers/dashboard.router";
import { adminRouter } from "./routers/admin.router";

export const appRouter = router({
  user: userRouter,
  onboarding: onboardingRouter,
  dashboard: dashboardRouter,
  admin: adminRouter
});

export type AppRouter = typeof appRouter;
export type ReactQueryOptions = inferReactQueryProcedureOptions<AppRouter>;
export type RouterInputs = inferRouterInputs<AppRouter>;
export type RouterOutputs = inferRouterOutputs<AppRouter>;
