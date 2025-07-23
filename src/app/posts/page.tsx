"use client";

import { Button } from "../../_components/ui/button";
import Link from "next/link";

export default function Page() {
  return (
    <div className="m-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center gap-6">
      <h1 className="text-2xl font-bold">Posts Examples</h1>
      <p>
        To help illustrate server-side versus client-side data fetching and
        rendering, 2 versions of the Posts page have been created. You can view
        and use each one with the links below.
      </p>
      <p>
        Remember that components themselves (not just pages) can be server or
        client rendered, and you can mix/match them to achieve the best results.
      </p>
      <div className="flex w-full flex-row gap-4">
        <Button asChild className="grow">
          <Link href="/posts/example-ssr">SSR Example</Link>
        </Button>
        <Button asChild className="grow">
          <Link href="/posts/example-csr">CSR Example</Link>
        </Button>
      </div>
    </div>
  );
}
