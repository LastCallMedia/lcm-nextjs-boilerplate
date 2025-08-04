"use client";

import { FormattedMessage } from "react-intl";
import { t } from "~/i18n/messages";
import PostForm from "~/_components/posts/PostForm";
import { api } from "~/trpc/react";

export function LatestPost() {
  const [latestPost] = api.post.getLatest.useSuspenseQuery();

  return (
    <div className="w-full max-w-xs text-center">
      {latestPost ? (
        <p className="truncate">
          <FormattedMessage id={t("posts.title")} />: {latestPost.name}
        </p>
      ) : (
        <div className="space-y-4">
          <p>
            <FormattedMessage id={t("posts.noPostsFound")} />
          </p>
          <PostForm />
        </div>
      )}
    </div>
  );
}
