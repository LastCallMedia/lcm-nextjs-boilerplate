import React, { Suspense } from "react";
import AllPostsClient from "./client";
import { api } from "~/trpc/server";
import { TypingIndicator } from "~/_components/posts/TypingIndicator";
import { getMessages } from "~/i18n/messages";
import type { Post } from "~/server/api/routers/post";

interface PostsPageProps {
  params: Promise<{ locale: string }>;
}

const Page = async ({ params }: PostsPageProps) => {
  const { locale } = await params;
  const messages = getMessages(locale as "en" | "es");
  const posts: Post[] = await api.post.getAll();
  return (
    <div>
      <h1 className="m-4 text-center text-2xl font-bold">
        {messages["posts.allPostsTitle"]}
      </h1>
      <Suspense fallback={null}>
        <AllPostsClient posts={posts} />
        <TypingIndicator channelId="landing" />
      </Suspense>
    </div>
  );
};

export default Page;
