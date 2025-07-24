"use client";

import { FormattedMessage } from "react-intl";

export function HomeContent() {
  return (
    <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
      <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
        <FormattedMessage
          id="home.title"
          values={{ name: <span className="text-glacier">LCM</span> }}
        />
      </h1>
      <div className="flex flex-col items-center gap-2">
        <p className="text-2xl">
          <FormattedMessage id="home.greeting" />
        </p>
      </div>
    </div>
  );
}

export function SeeAllPostsButton() {
  return <FormattedMessage id="home.seeAllPosts" />;
}
