import { TypingIndicator } from "~/_components/posts/TypingIndicator";
import { api } from "../../../trpc/server";
import NextRenderingDocsLink from "../_components/next-docs-link";
import AllPostsClient from "../client";

// ? Notice this entire page is async
export default async function Page() {
  // SSR: fetch posts on the server, only update on refresh. Loading and error handled by NextJS in ./loading.tsx and ./error.tsx
  const posts = await api.post.getAll();

  return (
    <div className="m-auto flex max-w-2xl flex-col gap-8">
      <h1 className="m-4 text-center text-2xl font-bold">
        All Posts (SSR Example)
      </h1>
      <p>
        This page is server-side rendered, so posts can only be fetched at time
        of page render (i.e. page load, refresh, etc). This means you can&apos;t
        see a newly added post unless we manually refresh the page.
      </p>
      <p>
        SSR is good for static or rarely-changing content. If you want data to
        auto-update without a page refresh, CSR might be a better option.
      </p>

      <NextRenderingDocsLink />

      <AllPostsClient posts={posts} />

      <TypingIndicator channelId="landing" />
    </div>
  );
}
