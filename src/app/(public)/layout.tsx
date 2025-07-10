import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: "%s | LCM Next.js Boilerplate",
    default: "LCM Next.js Boilerplate",
  },
  description: "Public pages accessible without authentication",
};

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="bg-background min-h-screen">{children}</div>;
}
