import { TypingIndicator } from "~/_components/posts/TypingIndicator";
import { api } from "~/trpc/server";
import NextRenderingDocsLink from "~/app/[locale]/posts/_components/next-docs-link";
import AllPostsClient from "~/app/[locale]/posts/client";
import { getMessages } from "~/i18n";

// ? Notice this entire page is async
export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  // SSR: fetch posts on the server, only update on refresh. Loading and error handled by NextJS in ./loading.tsx and ./error.tsx
  const posts = await api.post.getAll();

  const { locale } = await params;
  const messages = getMessages((locale || "en") as "en" | "es");

  return (
    <div className="m-auto flex max-w-2xl flex-col gap-8">
      <h1 className="m-4 text-center text-2xl font-bold">
        {messages["posts.examples.ssrPage.title"]}
      </h1>
      <p>{messages["posts.examples.ssrPage.description1"]}</p>
      <p>{messages["posts.examples.ssrPage.description2"]}</p>

      <NextRenderingDocsLink />

      <AllPostsClient posts={posts} />

      <TypingIndicator channelId="landing" />
    </div>
  );
}
