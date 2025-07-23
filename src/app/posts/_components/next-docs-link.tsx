import { ExternalLink } from "lucide-react";
import { Button } from "../../../_components";

export default function NextRenderingDocsLink() {
  return (
    <Button asChild variant="secondary">
      <a
        target="_blank"
        href="https://nextjs.org/docs/app/getting-started/server-and-client-components#when-to-use-server-and-client-components"
      >
        NextJS Client vs Server Rendering
        <ExternalLink />
      </a>
    </Button>
  );
}
