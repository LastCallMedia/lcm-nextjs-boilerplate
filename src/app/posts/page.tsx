import React, { Suspense } from "react";
import AllPostsClient from "./client";
import { getAllPosts } from "../utils/api";
import { TypingIndicator } from "~/_components/posts/TypingIndicator";
import { FormattedMessage } from "react-intl";

const page = () => {
  return (
    <div>
      <h1 className="m-4 text-center text-2xl font-bold">
        <FormattedMessage id="posts.allPostsTitle" />
      </h1>
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
