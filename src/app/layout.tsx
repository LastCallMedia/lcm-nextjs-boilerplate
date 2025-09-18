import "~/styles/globals.css";
import { type Metadata } from "next";
import { Geist } from "next/font/google";
import { CopilotKit } from "@copilotkit/react-core";
import "@copilotkit/react-ui/styles.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export const metadata: Metadata = {
  title: "Create LCM App",
  description: "LCM Next.js Boilerplate",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html className={`${geist.variable}`}>
      <body>
        <CopilotKit publicApiKey={process.env.NEXT_PUBLIC_COPILOTKIT_API_KEY}>
          {children}
        </CopilotKit>
      </body>
    </html>
  );
}
