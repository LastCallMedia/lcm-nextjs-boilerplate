import React, { Suspense } from "react";
import PostClient from "./client";
import { PostSkeleton } from "~/_components/posts";
import { api } from "~/trpc/server";
import type { Post } from "@/prisma/generated/client";

const page = async () => {
  // Fetch all public posts from tRPC server-side
  const posts = await api.post.getAllPublic();

  return (
    <div>
      <h1 className="m-4 text-center text-2xl font-bold">All Posts</h1>
      <Suspense fallback={<PostSkeleton />}>
        <Post posts={posts} />
      </Suspense>
    </div>
  );
};

export default page;

// Pass posts as prop to client component
const Post = ({ posts }: { posts: Post[] }) => {
  return <PostClient posts={posts} />;
};
