"use client";

import React from "react";
import { api } from "~/trpc/react";
import { Alert, AlertDescription } from "~/_components/ui/alert";
import { Button } from "~/_components/ui/button";
import { RefreshCw } from "lucide-react";
import { PostCard } from "~/_components/posts/post-card";
import { InfiniteScrollContainer } from "~/_components/ui";
import PostSkeleton from "~/_components/posts/post-skeleton";

const InfinitePostsClient = () => {
  const infiniteQuery = api.post.getInfinitePosts.useInfiniteQuery(
    {},
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      // Enable SSR hydration
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    },
  );

  const { data, error, status, refetch } = infiniteQuery;

  if (status === "pending") {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }, (_, i) => (
          <PostSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="space-y-4">
        <Alert variant="destructive">
          <AlertDescription>
            Error loading posts: {error?.message ?? "Something went wrong"}
          </AlertDescription>
        </Alert>
        <Button onClick={() => refetch()} variant="outline" className="w-full">
          <RefreshCw className="mr-2 h-4 w-4" />
          Try Again
        </Button>
      </div>
    );
  }

  const allPosts = data?.pages.flatMap((page) => page.posts) ?? [];

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="text-muted-foreground text-center text-sm">
        Showing {allPosts.length} posts
        {infiniteQuery.hasNextPage && " (scroll for more)"}
      </div>

      {/* Posts with Infinite Scroll */}
      <InfiniteScrollContainer
        infiniteQuery={infiniteQuery}
        scrollOptions={{ threshold: 0.1 }}
      >
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {allPosts.map((post, index) => (
            <PostCard key={`${post.id}-${index}`} post={post} />
          ))}
        </div>
      </InfiniteScrollContainer>
    </div>
  );
};

export default InfinitePostsClient;
