import { Suspense } from "react";
import { PostSkeleton } from "~/_components/posts";
import { PostClient } from "~/app/[locale]/post/client";

interface PostPageProps {
  params: Promise<{ locale: string }>;
}

const page = async ({ params: _params }: PostPageProps) => {
  return (
    <div>
      <Suspense fallback={<PostSkeleton />}>
        <Post />
      </Suspense>
    </div>
  );
};

export default page;

const Post = () => {
  return <PostClient />;
};
