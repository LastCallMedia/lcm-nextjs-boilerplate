import { Suspense } from "react";
import InfinitePostsClient from "~/app/infinite-posts/client";

const InfinitePosts = () => {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold">Infinite Posts</h1>
        <p className="text-muted-foreground mt-2">
          Infinite scrolling with optimized data fetching
        </p>
      </div>

      <Suspense fallback>
        <InfinitePostsClient />
      </Suspense>
    </div>
  );
};

export default InfinitePosts;
