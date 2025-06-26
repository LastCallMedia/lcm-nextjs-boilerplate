import Image from "next/image";
import Link from "next/link";
import { LatestPost } from "~/_components/LastestPost";
import { auth } from "~/server/auth";
import { api, HydrateClient } from "~/trpc/server";

export default async function Home() {
  const hello = await api.post.hello({ text: "from tRPC" });
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
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
            Hello, <span className="text-glacier">LCM</span>ers!!
          </h1>
          <div className="flex flex-col items-center gap-2">
            <p className="text-2xl">
              {hello ? hello.greeting : "Loading tRPC query..."}
            </p>
          </div>

          {session?.user && (
            <>
              <LatestPost />
              <Link href={"/posts"}>See more posts</Link>
            </>
          )}
        </div>
      </main>
    </HydrateClient>
  );
}
