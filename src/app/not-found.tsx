import Link from "next/link";
import { Button } from "~/_components";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center px-4 py-16">
      <div className="flex flex-col items-center gap-4 rounded-md border p-8">
        <h2 className="text-4xl font-bold">404</h2>
        <p className="text-center">
          This page or resource doesn&apos;t seem to exist.
          <br />
          Double-check your URL or use the button below to return home.
        </p>
        <Button asChild className="mt-4">
          <Link href="/">Return Home</Link>
        </Button>
      </div>
    </main>
  );
}
