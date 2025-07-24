import { Button } from "~/_components/ui/button";
import Link from "next/link";
import type { Metadata } from "next";
import { getMessages } from "~/i18n/messages";

export const metadata: Metadata = {
  title: "Posts Examples | LCM Next.js Boilerplate",
  description: "Examples of SSR and CSR posts",
};

export default async function PostsExamplesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = getMessages((locale || "en") as "en" | "es");
  return (
    <div className="m-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center gap-6">
      <h1 className="text-2xl font-bold">{messages["posts.examples.title"]}</h1>
      <p>{messages["posts.examples.description1"]}</p>
      <p>{messages["posts.examples.description2"]}</p>
      <div className="flex w-full flex-row gap-4">
        <Button asChild className="grow">
          <Link href={`/${locale}/posts/example-ssr`}>
            {messages["posts.examples.ssrLink"]}
          </Link>
        </Button>
        <Button asChild className="grow">
          <Link href={`/${locale}/posts/example-csr`}>
            {messages["posts.examples.csrLink"]}
          </Link>
        </Button>
      </div>
    </div>
  );
}
