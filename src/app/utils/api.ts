import type { PostModel } from "~/generated/prisma/models/Post";
// Import the correct function or client for fetching posts
import { db } from "~/server/db";

export const getAllPosts = async (): Promise<PostModel[]> => {
  // Use the Prisma client to fetch all posts
  const posts = await db.post.findMany();
  return posts;
};
