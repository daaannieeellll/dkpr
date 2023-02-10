import { createTRPCRouter } from "./trpc";
import { authRouter } from "./routers/auth";
import { exampleRouter } from "./routers/example";
import { msgraphRouter } from "./routers/msgraph";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  auth: authRouter,
  example: exampleRouter,
  msgraph: msgraphRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
