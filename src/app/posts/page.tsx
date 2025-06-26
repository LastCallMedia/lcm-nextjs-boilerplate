import React, { Suspense } from "react";
import AllPostsClient from "./client";

const page = () => {
  return (
    <div>
      <h1>All Posts</h1>
      <Suspense fallback>
        <AllPosts />
      </Suspense>
    </div>
  );
};

export default page;

const AllPosts = () => {
  return <AllPostsClient />;
};
