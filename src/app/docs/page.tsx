import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";

export default function SwaggerPage() {
  // Serve Swagger UI with our OpenAPI schema
  return <SwaggerUI url="/api/openapi.json" />;
}
