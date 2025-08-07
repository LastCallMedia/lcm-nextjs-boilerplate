import { t } from "~/i18n/messages";
import { getMessages } from "~/i18n";
import { auth } from "~/server/auth";
import { redirect } from "next/navigation";
import NextRenderingDocsLink from "~/app/[locale]/posts/_components/next-docs-link";
import ExampleClientSideRendering from "~/app/[locale]/posts/example-client-side-rendering/client";

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const session = await auth();
  const { locale } = await params;
  if (!session?.user) {
    redirect(
      `/login?callbackUrl=/${locale}/posts/example-client-side-rendering`,
    );
  }

  const messages = getMessages((locale || "en") as "en" | "es");

  return (
    <div className="m-auto flex max-w-2xl flex-col gap-8">
      <h1 className="m-4 text-center text-2xl font-bold">
        {messages[t("posts.examples.csrPage.title")]}
      </h1>
      <p>{messages[t("posts.examples.csrPage.description1")]} </p>
      <p>{messages[t("posts.examples.csrPage.description2")]} </p>
      <NextRenderingDocsLink />
      <ExampleClientSideRendering />
    </div>
  );
}
