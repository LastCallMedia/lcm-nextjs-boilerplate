import type { Post } from "@prisma/client";
// Import the correct function or client for fetching posts
import { db } from "~/server/db";

export const getAllPosts = async (): Promise<Post[]> => {
  // Use the Prisma client to fetch all posts
  const posts = await db.post.findMany();
  return posts;
};
