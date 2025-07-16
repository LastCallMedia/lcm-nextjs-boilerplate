import React from "react";
import { Loader2 } from "lucide-react";
import { useInfiniteScroll } from "~/hooks/use-infinite-scroll";

interface InfiniteScrollContainerProps {
  /**
   * The infinite query result from tRPC or React Query
   */
  infiniteQuery: {
    fetchNextPage: () => Promise<unknown> | void;
    hasNextPage: boolean | undefined;
    isFetchingNextPage: boolean;
  };
  /**
   * Children to render (usually the list items)
   */
  children: React.ReactNode;
  /**
   * Custom loading component
   */
  loadingComponent?: React.ReactNode;
  /**
   * Custom end message
   */
  endMessage?: React.ReactNode;
  /**
   * Custom class name for the container
   */
  className?: string;
  /**
   * Options for the infinite scroll hook
   */
  scrollOptions?: {
    threshold?: number;
    enabled?: boolean;
    rootMargin?: string;
  };
}

/**
 * A reusable infinite scroll container component
 *
 * @example
 * ```tsx
 * const infiniteQuery = api.post.getInfinitePosts.useInfiniteQuery({}, {
 *   getNextPageParam: (lastPage) => lastPage.nextCursor,
 * });
 *
 * const allPosts = infiniteQuery.data?.pages.flatMap((page) => page.posts) ?? [];
 *
 * return (
 *   <InfiniteScrollContainer infiniteQuery={infiniteQuery}>
 *     <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
 *       {allPosts.map((post) => (
 *         <PostCard key={post.id} post={post} />
 *       ))}
 *     </div>
 *   </InfiniteScrollContainer>
 * );
 * ```
 */
export const InfiniteScrollContainer: React.FC<
  InfiniteScrollContainerProps
> = ({
  infiniteQuery,
  children,
  loadingComponent,
  endMessage,
  className = "",
  scrollOptions = {},
}) => {
  const { isFetchingNextPage } = infiniteQuery;

  const { loadMoreRef } = useInfiniteScroll(infiniteQuery, {
    threshold: 0.1,
    enabled: true,
    ...scrollOptions,
  });

  const defaultLoadingComponent = (
    <div className="flex items-center justify-center space-x-2 py-4">
      <Loader2 className="h-4 w-4 animate-spin" />
      <span className="text-muted-foreground text-sm">Loading more...</span>
    </div>
  );

  const defaultEndMessage = (
    <div className="text-muted-foreground py-4 text-center text-sm">
      🎉 You&apos;ve reached the end!
    </div>
  );

  return (
    <div className={className}>
      {children}

      <div ref={loadMoreRef} className="flex justify-center py-8">
        {isFetchingNextPage
          ? (loadingComponent ?? defaultLoadingComponent)
          : (endMessage ?? defaultEndMessage)}
      </div>
    </div>
  );
};
