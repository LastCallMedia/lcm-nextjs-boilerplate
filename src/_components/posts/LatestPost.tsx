"use client";

import PostForm from "~/_components/posts/PostForm";
import { api } from "~/trpc/react";

export function LatestPost() {
  const [latestPost] = api.post.getLatest.useSuspenseQuery();

  return (
    <div className="w-full max-w-xs text-center">
      {latestPost ? (
        <p className="truncate">Your most recent post: {latestPost.name}</p>
      ) : (
        <div className="space-y-4">
          <p>You have no posts yet.</p>
          <PostForm />
        </div>
      )}
    </div>
  );
}
