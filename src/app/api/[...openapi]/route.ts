import { createOpenApiFetchHandler } from "trpc-to-openapi";
import { appRouter } from "~/server/api/root";
import { createTRPCContext } from "~/server/api/trpc";

const handler = (req: Request) => {
  // Handle incoming OpenAPI requests
  return createOpenApiFetchHandler({
    endpoint: "/api",
    router: appRouter,
    createContext: async () => {
      // Use the same context creation logic as the main tRPC handler
      return createTRPCContext({
        headers: req.headers,
      });
    },
    req,
  });
};

export {
  handler as GET,
  handler as POST,
  handler as PUT,
  handler as PATCH,
  handler as DELETE,
  handler as OPTIONS,
  handler as HEAD,
};
