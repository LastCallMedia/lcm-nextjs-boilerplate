"use client";

import { FormattedMessage } from "react-intl";
import { PostCardDefault as PostCard, PostForm } from "~/_components/posts";
import type { PostModel } from "~/generated/prisma/models/Post";
import { t } from "~/i18n/messages";

interface AllPostsClientProps {
  posts: PostModel[];
}

const AllPostsClient = ({ posts }: AllPostsClientProps) => {
  return (
    <div className="m-auto flex w-full flex-col gap-4">
      <PostForm className="m-auto w-full" />
      {posts.length < 1 ? (
        <p className="m-4 text-center">
          <FormattedMessage id={t("posts.noPostsAvailable")} />
        </p>
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
