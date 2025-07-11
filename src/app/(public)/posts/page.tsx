import React, { Suspense } from "react";
import AllPostsClient from "./client";
import { api } from "~/trpc/server";

const page = () => {
  return (
    <div>
      <h1 className="m-4 text-center text-2xl font-bold">All Posts</h1>
      <Suspense fallback={<div>Loading posts...</div>}>
        <AllPosts />
      </Suspense>
    </div>
  );
};

export default page;

const AllPosts = async () => {
  const posts = await api.post.getAllPublic();
  return <AllPostsClient posts={posts} />;
};
