"use client";

import { TypingIndicator } from "~/_components/posts/TypingIndicator";
import { api } from "../../../trpc/react";
import AllPostsClient from "../client";
import NextRenderingDocsLink from "../_components/next-docs-link";

export default function Page() {
  // CSR: fetch posts on render, and update when the query is invalidated. Loading and error handled right in the UI
  const { data: posts, isLoading, isError, error } = api.post.getAll.useQuery();

  return (
    <div className="m-auto flex max-w-2xl flex-col gap-8">
      <h1 className="m-4 text-center text-2xl font-bold">
        All Posts (CSR Example)
      </h1>
      <p>
        This page is client-side rendered, so posts can be fetched dynamically
        without a page refresh. This means you can see new posts appear as they
        are added, without needing to reload the page.
      </p>
      <p>
        CSR is good for content that changes often, especially when changed by
        user action. If you&apos;re using large/heavy queries or want to move
        work off of the client, SSR may be a better option.
      </p>
      <NextRenderingDocsLink />

      {isLoading ? (
        <div className="mb-4 text-center text-gray-500">Loading posts...</div>
      ) : isError ? (
        <div className="mb-4 text-center text-red-500">
          Error loading posts: {error?.message || "Unknown error"}
        </div>
      ) : (
        <AllPostsClient posts={posts ?? []} />
      )}

      <TypingIndicator channelId="landing" />
    </div>
  );
}
