import React from "react";
import AllPostsClient from "./client";
import { getAllPosts } from "~/app/utils/api";

interface PostsPageProps {
  params: Promise<{ locale: string }>;
}

export default async function page({ params: _params }: PostsPageProps) {
  const posts = await getAllPosts();
  return <AllPostsClient posts={posts} />;
}
