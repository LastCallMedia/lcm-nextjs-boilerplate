import { generateOpenApiDocument } from "trpc-to-openapi";

import { openApiRouter } from "./routers/openapi-router";

// Generate OpenAPI schema document
export const openApiDocument = generateOpenApiDocument(openApiRouter, {
  title: "LCM Boilerplate Posts API",
  description: "OpenAPI compliant REST API for posts management",
  version: "1.0.0",
  baseUrl: "http://localhost:3000/api",
  docsUrl: "https://github.com/mcampa/trpc-to-openapi",
  tags: ["posts"],
});
