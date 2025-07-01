import React, { Suspense } from "react";
import AllPostsClient from "./client";
import { getAllPosts } from "../utils/api";

const page = () => {
  return (
    <div>
      <h1 className="m-4 text-center text-2xl font-bold">All Posts</h1>
      <Suspense fallback>
        <AllPosts />
      </Suspense>
    </div>
  );
};

export default page;

const AllPosts = async () => {
  const posts = await getAllPosts();
  return <AllPostsClient posts={posts} />;
};
