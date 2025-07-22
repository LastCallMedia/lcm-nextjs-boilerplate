import { Suspense } from "react";
import { TypingIndicator } from "~/_components/posts/TypingIndicator";
import AllPostsClient from "~/app/posts/client";
import { getAllPosts } from "~/app/utils/api";

const page = () => {
  return (
    <div>
      <h1 className="m-4 text-center text-2xl font-bold">All Posts</h1>
      <Suspense fallback>
        <AllPosts />
        <TypingIndicator channelId="landing" />
      </Suspense>
    </div>
  );
};

export default page;

const AllPosts = async () => {
  const posts = await getAllPosts();
  return <AllPostsClient posts={posts} />;
};
