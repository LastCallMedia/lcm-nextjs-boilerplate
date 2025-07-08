import { initTRPC } from "@trpc/server";
import { type OpenApiMeta } from "trpc-to-openapi";
import { z } from "zod";

const t = initTRPC.meta<OpenApiMeta>().create();

export const appRouter = t.router({
  sayHello: t.procedure
    .meta({ openapi: { method: "GET", path: "/say-hello" } })
    .input(z.object({ name: z.string() }))
    .output(z.object({ greeting: z.string() }))
    .query(({ input }) => {
      return { greeting: `Hello ${input.name}!` };
    }),
});

import { generateOpenApiDocument } from "trpc-to-openapi";

// eslint-disable-next-line @typescript-eslint/require-await
export const createContext = async ({
  req,
  res,
}: CreateNextContextOptions): Promise<Context> => {
  const requestId = uuid();
  res.setHeader("x-request-id", requestId);

  let user: User | null = null;

  try {
    if (req.headers.authorization) {
      const token = req.headers.authorization.split(" ")[1];
      const userId = jwt.verify(token, jwtSecret) as string;
      if (userId) {
        user = database.users.find((_user) => _user.id === userId) ?? null;
      }
    }
  } catch (cause) {
    console.error(cause);
  }

  return { user, requestId };
};

export const openApiDocument = generateOpenApiDocument(appRouter, {
  title: "tRPC OpenAPI",
  version: "1.0.0",
  baseUrl: "http://localhost:3000",
});
