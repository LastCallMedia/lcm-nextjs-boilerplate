"use client";

import { ExternalLink } from "lucide-react";
import { FormattedMessage } from "react-intl";
import { Button } from "~/_components";
import { t } from "~/i18n/messages";

export default function NextRenderingDocsLink() {
  return (
    <Button asChild variant="secondary">
      <a
        target="_blank"
        href="https://nextjs.org/docs/app/getting-started/server-and-client-components#when-to-use-server-and-client-components"
      >
        <FormattedMessage id={t("posts.nextDocsLink.title")} />
        <ExternalLink />
      </a>
    </Button>
  );
}
