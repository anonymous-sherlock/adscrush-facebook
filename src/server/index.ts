import { getAuthSession } from "@/lib/auth";
import { inferReactQueryProcedureOptions } from "@trpc/react-query";
import { TRPCError, inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import { publicProcedure, router } from "./trpc";

export const appRouter = router({
  authCallback: publicProcedure.query(async ({ }) => {
    const session = await getAuthSession();
    if (!session) throw new TRPCError({ code: "UNAUTHORIZED" });
    const { user } = session;
    if (!user.id || !user.email) throw new TRPCError({ code: "UNAUTHORIZED" });

    return { success: true };
  }),

});

export type AppRouter = typeof appRouter;
export type ReactQueryOptions = inferReactQueryProcedureOptions<AppRouter>;
export type RouterInputs = inferRouterInputs<AppRouter>;
export type RouterOutputs = inferRouterOutputs<AppRouter>;
