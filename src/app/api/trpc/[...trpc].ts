import type { NextApiRequest, NextApiResponse } from "next";
import { createOpenApiNextHandler } from "trpc-to-openapi";
import { appRouter } from "~/server/api/routers/openapi-router";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  // Handle incoming OpenAPI requests
  return createOpenApiNextHandler({
    router: appRouter,
    createContext,
  })(req, res);
};

export default handler;
