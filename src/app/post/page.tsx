import React, { Suspense } from "react";
import PostClient from "./client";
import PostSkeleton from "~/_components/PostSkeleton";

const page = () => {
  return (
    <div>
      <h1>All Posts</h1>
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
