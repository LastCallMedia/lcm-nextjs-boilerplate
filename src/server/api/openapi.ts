import { generateOpenApiDocument } from "trpc-to-openapi";
import { postRouter } from "./routers/post";

// Generate OpenAPI schema document
export const openApiDocument = generateOpenApiDocument(postRouter, {
  title: "LCM Boilerplate API",
  description: "OpenAPI compliant REST API built with tRPC",
  version: "1.0.0",
  baseUrl: "http://localhost:3000/api",
  docsUrl: "https://github.com/mcampa/trpc-to-openapi",
  tags: ["posts", "authentication"],
});
