import { generateOpenApiDocument } from "trpc-to-openapi";
import { appRouter } from "~/server/api/root";

// Generate OpenAPI schema document
export const openApiDocument = generateOpenApiDocument(appRouter, {
  title: "LCM Boilerplate API",
  description: "OpenAPI compliant REST API built with tRPC",
  version: "1.0.0",
  baseUrl: "http://localhost:3000/api",
  docsUrl: "https://github.com/mcampa/trpc-to-openapi",
  tags: ["posts"],
});
