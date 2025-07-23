"use client";

import type { Post } from "@prisma/client";
import React from "react";
import { PostForm, PostCardDefault as PostCard } from "~/_components/posts";
import { FormattedMessage } from "react-intl";

interface AllPostsClientProps {
  posts: Post[];
}

const AllPostsClient = ({ posts }: AllPostsClientProps) => {
  return (
    <div>
      <div className="m-auto w-2/3">
        <PostForm className="m-auto w-1/3" />
        {posts.length < 1 ? (
          <p className="m-4 text-center">
            <FormattedMessage id="posts.noPostsAvailable" />
          </p>
        ) : (
          <ul className="grid grid-cols-1 justify-items-center">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AllPostsClient;
