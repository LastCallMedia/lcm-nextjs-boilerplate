import { Geist } from "next/font/google";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export const metadata = {
  title: "Create LCM App",
  description: "LCM Next.js Boilerplate",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

interface RootLayoutProps {
  children: React.ReactNode;
}

// Root layout must include html and body tags
export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html className={geist.variable}>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
