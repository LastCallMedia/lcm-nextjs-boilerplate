import { TypingIndicator } from "~/_components/posts/typing-indicator";
import { api } from "~/trpc/server";
import NextRenderingDocsLink from "~/app/[locale]/posts/_components/next-docs-link";
import AllPostsClient from "~/app/[locale]/posts/client";
import { getMessages } from "~/i18n";
import { auth } from "~/server/auth";
import { redirect } from "next/navigation";
import { t } from "~/i18n/messages";

// ? Notice this entire page is async
export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const session = await auth();
  const { locale } = await params;
  if (!session?.user) {
    redirect(
      `/login?callbackUrl=/${locale}/posts/example-server-side-rendering`,
    );
  }
  // Server Side Rendering: fetch posts on the server, only update on refresh. Loading and error handled by NextJS in ./loading.tsx and ./error.tsx
  const posts = await api.post.getAll();
  const messages = getMessages((locale || "en") as "en" | "es");
  return (
    <div className="m-auto flex max-w-2xl flex-col gap-8">
      <h1 className="m-4 text-center text-2xl font-bold">
        {messages[t("posts.examples.ssrPage.title")]}
      </h1>
      <p>{messages[t("posts.examples.ssrPage.description1")]}</p>
      <p>{messages[t("posts.examples.ssrPage.description2")]}</p>
      <NextRenderingDocsLink />
      <AllPostsClient posts={posts} />
      <TypingIndicator channelId="landing" />
    </div>
  );
}
