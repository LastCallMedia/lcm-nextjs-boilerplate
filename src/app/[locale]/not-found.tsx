"use client";

import Link from "next/link";
import { FormattedMessage, useIntl } from "react-intl";
import { Button } from "~/_components";

export default function NotFound() {
  const { locale } = useIntl();

  return (
    <main className="flex min-h-screen flex-col items-center px-4 py-16">
      <div className="flex flex-col items-center gap-4 rounded-md border p-8">
        <h2 className="text-4xl font-bold">
          <FormattedMessage id="notFound.title" />
        </h2>
        <p className="text-center">
          <FormattedMessage id="notFound.description" />
          <br />
          <FormattedMessage id="notFound.instruction" />
        </p>
        <Button asChild className="mt-4">
          <Link href={`/${locale}`}>
            <FormattedMessage id="notFound.action" />
          </Link>
        </Button>
      </div>
    </main>
  );
}
