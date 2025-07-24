"use client";

import { useEffect, useRef } from "react";
import type { Root } from "react-dom/client";
import "swagger-ui-react/swagger-ui.css";
import "@/app/[locale]/api-docs/theme.css";

export default function SwaggerPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<Root | null>(null);
  const isLoadedRef = useRef<boolean>(false);

  useEffect(() => {
    // Prevent multiple initializations
    if (isLoadedRef.current) return;

    // Dynamically import and render Swagger UI to avoid SSR issues
    const loadSwaggerUI = async () => {
      try {
        const SwaggerUI = (await import("swagger-ui-react")).default;
        const { createRoot } = await import("react-dom/client");

        if (containerRef.current && !rootRef.current) {
          // Create root only once
          rootRef.current = createRoot(containerRef.current);
          rootRef.current.render(<SwaggerUI url="/api/openapi.json" />);
          isLoadedRef.current = true;
        }
      } catch (error) {
        console.error("Failed to load Swagger UI:", error);
      }
    };

    void loadSwaggerUI();

    return () => {
      // Cleanup: unmount React root
      if (rootRef.current) {
        rootRef.current.unmount();
        rootRef.current = null;
      }

      isLoadedRef.current = false;
    };
  }, []);

  return <div ref={containerRef} className="swagger-ui-container" />;
}
