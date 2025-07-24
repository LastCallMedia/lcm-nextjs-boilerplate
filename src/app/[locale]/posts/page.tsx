import { Suspense } from "react";
import { TypingIndicator } from "~/_components/posts/TypingIndicator";
import AllPostsClient from "~/app/[locale]/posts/client";
import { getMessages } from "~/i18n/messages";
import type { Post } from "~/server/api/routers/post";
import { api } from "~/trpc/server";

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
