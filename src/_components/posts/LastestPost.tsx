"use client";

import { FormattedMessage } from "react-intl";
import { api } from "~/trpc/react";
import PostForm from "./PostForm";

export function LatestPost() {
  const [latestPost] = api.post.getLatest.useSuspenseQuery();

  return (
    <div className="w-full max-w-xs text-center">
      {latestPost ? (
        <p className="truncate">
          <FormattedMessage id="posts.title" />: {latestPost.name}
        </p>
      ) : (
        <div className="space-y-4">
          <p>
            <FormattedMessage id="posts.noPostsFound" />
          </p>
          <PostForm />
        </div>
      )}
    </div>
  );
}
