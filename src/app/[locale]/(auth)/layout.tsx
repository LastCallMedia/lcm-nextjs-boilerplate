import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: "%s | LCM Next.js Boilerplate",
    default: "Authentication | LCM Next.js Boilerplate",
  },
  description: "Authentication pages for the LCM Next.js Boilerplate",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="bg-background min-h-screen">{children}</div>;
}
