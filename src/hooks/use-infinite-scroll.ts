"use client";

import { useEffect, useRef } from "react";

interface InfiniteQueryLike {
  fetchNextPage: () => Promise<unknown> | void;
  hasNextPage: boolean | undefined;
  isFetchingNextPage: boolean;
}

interface UseInfiniteScrollOptions {
  /**
   * The threshold at which to trigger the intersection observer
   * @default 0.1
   */
  threshold?: number;
  /**
   * Whether to enable auto-loading when scrolling
   * @default true
   */
  enabled?: boolean;
  /**
   * Root margin for the intersection observer
   * @default "0px"
   */
  rootMargin?: string;
}

interface UseInfiniteScrollReturn {
  /**
   * Ref to attach to the load more trigger element
   */
  loadMoreRef: React.RefObject<HTMLDivElement | null>;
}

/**
 * Custom hook for implementing infinite scroll functionality
 *
 * @param infiniteQuery - The result from useInfiniteQuery (tRPC or React Query)
 * @param options - Configuration options for the infinite scroll
 * @returns Object containing refs and utilities for infinite scroll
 *
 * @example
 * ```typescript
 * const infiniteQuery = api.post.getInfinitePosts.useInfiniteQuery({}, {
 *   getNextPageParam: (lastPage) => lastPage.nextCursor,
 * });
 *
 * const { loadMoreRef } = useInfiniteScroll(infiniteQuery, {
 *   threshold: 0.1,
 *   enabled: true,
 * });
 *
 * // In your component JSX:
 * // <div ref={loadMoreRef}>Load more trigger</div>
 * ```
 */
export const useInfiniteScroll = (
  infiniteQuery: InfiniteQueryLike,
  options: UseInfiniteScrollOptions = {},
): UseInfiniteScrollReturn => {
  const { threshold = 0.1, enabled = true, rootMargin = "0px" } = options;

  const { fetchNextPage, hasNextPage, isFetchingNextPage } = infiniteQuery;
  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!enabled || !hasNextPage || isFetchingNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          void fetchNextPage();
        }
      },
      {
        threshold,
        rootMargin,
      },
    );

    const currentRef = loadMoreRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    enabled,
    threshold,
    rootMargin,
  ]);

  return {
    loadMoreRef,
  };
};
