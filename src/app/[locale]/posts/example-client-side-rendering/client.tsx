"use client";

import { TypingIndicator } from "~/_components/posts/TypingIndicator";
import { api } from "~/trpc/react";
import AllPostsClient from "~/app/[locale]/posts/client";
import { FormattedMessage } from "react-intl";

export default function ExampleClientSideRendering() {
  const { data: posts, isLoading, isError, error } = api.post.getAll.useQuery();

  return (
    <>
      {isLoading ? (
        <div className="mb-4 text-center text-gray-500">
          <FormattedMessage id="posts.loading" />
        </div>
      ) : isError ? (
        <div className="mb-4 text-center text-red-500">
          <FormattedMessage id="posts.error" />{" "}
          {error?.message || "Unknown error"}
        </div>
      ) : (
        <AllPostsClient posts={posts ?? []} />
      )}
      <TypingIndicator channelId="landing" />
    </>
  );
}
