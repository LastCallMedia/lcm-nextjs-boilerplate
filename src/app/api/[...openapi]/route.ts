import { createOpenApiNextHandler } from "trpc-to-openapi";
import { openApiRouter } from "~/server/api/routers/openapi-router";

const handler = createOpenApiNextHandler({
  router: openApiRouter,
  createContext: async () => ({}),
});

export { handler as GET, handler as POST };
