import { getAuthSession } from "@/lib/auth";
import { inferReactQueryProcedureOptions } from "@trpc/react-query";
import { TRPCError, inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import { publicProcedure, router } from "./trpc";
import { userRouter } from "./routers/user.router";

export const appRouter = router({
  user: userRouter
});

export type AppRouter = typeof appRouter;
export type ReactQueryOptions = inferReactQueryProcedureOptions<AppRouter>;
export type RouterInputs = inferRouterInputs<AppRouter>;
export type RouterOutputs = inferRouterOutputs<AppRouter>;
