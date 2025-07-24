"use client";

import { TypingIndicator } from "~/_components/posts/TypingIndicator";
import { api } from "~/trpc/react";
import NextRenderingDocsLink from "~/app/[locale]/posts/_components/next-docs-link";
import AllPostsClient from "~/app/[locale]/posts/client";
import { FormattedMessage } from "react-intl";

export default function Page() {
  // CSR: fetch posts on render, and update when the query is invalidated. Loading and error handled right in the UI
  const { data: posts, isLoading, isError, error } = api.post.getAll.useQuery();

  return (
    <div className="m-auto flex max-w-2xl flex-col gap-8">
      <h1 className="m-4 text-center text-2xl font-bold">
        <FormattedMessage id="posts.examples.csrPage.title" />
      </h1>
      <p>
        <FormattedMessage id="posts.examples.csrPage.description1" />
      </p>
      <p>
        <FormattedMessage id="posts.examples.csrPage.description2" />
      </p>
      <NextRenderingDocsLink />

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
    </div>
  );
}
