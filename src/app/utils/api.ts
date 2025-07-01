import { api } from "~/trpc/server";

export const getAllPosts = async () => {
  const posts = await api.post.getAll();
  return posts;
};
