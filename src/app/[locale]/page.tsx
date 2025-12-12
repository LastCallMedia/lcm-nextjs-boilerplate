import Image from "next/image";
import Link from "next/link";
import { HomeContent, SeeAllPostsButton } from "~/_components/home";
import { LatestPost } from "~/_components/posts";
import { auth } from "~/server/auth";
import { api, HydrateClient } from "~/trpc/server";

interface HomeProps {
  params: Promise<{ locale: string }>;
}

export default async function Home({ params }: HomeProps) {
  const { locale } = await params;
  const session = await auth();

  if (session?.user) {
    void api.post.getLatest.prefetch();
  }

  return (
    <HydrateClient>
      <div className="flex flex-col items-center justify-center bg-gradient-to-b">
        <Image
          src={"/lcm-logo-teal.png"}
          alt="LCM logo"
          width={100}
          height={100}
        />
        <HomeContent />

        <div className="m-4 flex w-full justify-center">
          {session && <LatestPost />}
        </div>
        <Link
          href={`/${locale}/posts`}
          className="border-glacier hover:bg-deep-ocean border-4 bg-transparent px-3 py-2 align-baseline text-xl leading-6 font-medium transition-[background-color,color] duration-300 ease-out hover:text-white"
        >
          <SeeAllPostsButton />
        </Link>
      </div>
    </HydrateClient>
  );
}
