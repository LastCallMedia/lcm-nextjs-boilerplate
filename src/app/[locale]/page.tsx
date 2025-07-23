import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { LatestPost } from "~/_components/posts";
import { HomeContent, SeeAllPostsButton } from "~/_components/home";
import { Button } from "~/_components/ui/button";
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
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b">
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
        <Button>
          <Link href={`/${locale}/posts`}>
            <SeeAllPostsButton />
          </Link>
          <ArrowUpRight />
        </Button>
      </main>
    </HydrateClient>
  );
}
