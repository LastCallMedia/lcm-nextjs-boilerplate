import { adminRouter } from "~/server/api/routers/admin";
import { postRouter } from "~/server/api/routers/post";
import { termsRouter } from "~/server/api/routers/terms";
import { typingRouter } from "~/server/api/routers/typing";
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postRouter,
  admin: adminRouter,
  typing: typingRouter,
  terms: termsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
