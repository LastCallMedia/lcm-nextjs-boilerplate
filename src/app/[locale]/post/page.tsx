import React, { Suspense } from "react";
import PostClient from "./client";
import { PostSkeleton } from "~/_components/posts";

interface PostPageProps {
  params: Promise<{ locale: string }>;
}

const page = async ({ params: _params }: PostPageProps) => {
  return (
    <div>
      <h1 className="m-4 text-center text-2xl font-bold">My Posts</h1>
      <Suspense fallback={<PostSkeleton />}>
        <Post />
      </Suspense>
    </div>
  );
};

export default page;

const Post = () => {
  return <PostClient />;
};
