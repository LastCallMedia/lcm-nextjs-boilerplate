import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "~/server/auth";
import { PostForm } from "~/_components/posts";

export const metadata: Metadata = {
  title: "Create Post | LCM Next.js Boilerplate",
  description: "Create a new post",
};

export default async function CreatePostPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen justify-center pt-16">
      <div className="w-full max-w-md space-y-8">
        <div className="">
          <h1 className="text-3xl font-bold tracking-tight">Create New Post</h1>
          <p className="text-muted-foreground mt-2">
            Share your thoughts with the community
          </p>
        </div>

        <PostForm />
      </div>
    </div>
  );
}
