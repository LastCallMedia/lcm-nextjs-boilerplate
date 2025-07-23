import type { Post } from "@prisma/client";
import { PostForm, PostCardDefault as PostCard } from "~/_components/posts";

interface AllPostsClientProps {
  posts: Post[];
}

const AllPostsClient = ({ posts }: AllPostsClientProps) => {
  return (
    <div className="m-auto flex w-full flex-col gap-4">
      <PostForm className="m-auto w-full" />
      {posts.length < 1 ? (
        <p className="m-4 text-center">No posts available</p>
      ) : (
        <div className="grid grid-cols-1 justify-items-center gap-4">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
};

export default AllPostsClient;
