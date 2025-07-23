"use client";

import React from "react";
import { FormattedMessage } from "react-intl";

const PostClient = () => {
  return (
    <div>
      <h1 className="m-4 text-center text-2xl font-bold">
        <FormattedMessage id="posts.myPost" />
      </h1>

      <FormattedMessage id="navigation.posts" />
    </div>
  );
};

export default PostClient;
