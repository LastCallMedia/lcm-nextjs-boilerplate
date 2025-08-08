"use client";

import React from "react";
import { FormattedMessage } from "react-intl";
import { t } from "~/i18n/messages";

export function PostClient() {
  return (
    <div>
      <h1 className="m-4 text-center text-2xl font-bold">
        <FormattedMessage
          id={t("navigation.posts")}
          defaultMessage="Post Client"
        />
      </h1>

      <FormattedMessage id={t("navigation.posts")} />
    </div>
  );
}
