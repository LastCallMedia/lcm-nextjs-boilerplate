"use client";

import { FormattedMessage } from "react-intl";
import { PostCardDefault as PostCard, PostForm } from "~/_components/posts";
import type { PostModel } from "~/generated/prisma/models/Post";

interface AllPostsClientProps {
  posts: PostModel[];
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
