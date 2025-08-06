"use client";

import React from "react";
import { FormattedMessage } from "react-intl";
import { t } from "~/i18n/messages";

const PostClient = () => {
  return (
    <div>
      <h1 className="m-4 text-center text-2xl font-bold">
        <FormattedMessage id={t("posts.myPost")} />
      </h1>

      <FormattedMessage id={t("navigation.posts")} />
    </div>
  );
};

export default PostClient;
