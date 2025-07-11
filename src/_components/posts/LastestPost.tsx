"use client";

import { api } from "~/trpc/react";

export function LatestPost() {
  const [latestPost] = api.post.getLatest.useSuspenseQuery();

  return (
    <div className="w-full max-w-xs text-center">
      {latestPost && (
        <p className="truncate">Your most recent post: {latestPost.name}</p>
      )}
    </div>
  );
}
