import type { Post } from "@prisma/client";
import React from "react";
import { PostCard } from "~/_components";

interface AllPostClientProps {
  posts: Post[];
}

const AllPostClient: React.FC<AllPostClientProps> = ({ posts }) => {
  return (
    <div className="flex flex-wrap justify-center">
      {posts.length === 0 ? (
        <div className="m-4">No posts found.</div>
      ) : (
        posts.map((post) => <PostCard key={post.id} post={post} />)
      )}
    </div>
  );
};

export default AllPostClient;
