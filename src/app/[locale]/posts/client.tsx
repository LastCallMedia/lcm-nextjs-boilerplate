"use client";

import { FormattedMessage } from "react-intl";
import { PostCard, PostForm } from "~/_components/posts";
import type { PostModel } from "~/generated/prisma/models/Post";
import { t } from "~/i18n/messages";

interface AllPostsClientProps {
  posts: PostModel[];
}

export function AllPostsClient({ posts }: AllPostsClientProps) {
  return (
    <div className="container mx-auto space-y-6 px-4 py-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold">
          <FormattedMessage
            id={t("posts.allPostsTitle")}
            defaultMessage="All Posts"
          />
        </h1>
        <p className="text-muted-foreground mt-2">
          <FormattedMessage
            id={t("posts.noPostsAvailable")}
            defaultMessage="Create and view posts"
          />
        </p>
      </div>
      <PostForm />
      <div className="space-y-4">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
