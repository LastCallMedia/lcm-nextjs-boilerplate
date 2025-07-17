import "~/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";
import { TRPCReactProvider } from "~/trpc/react";
import { ThemeProvider } from "~/_components/ui/theme-provider";
import { Toaster } from "~/_components/ui/sonner";
import Navbar from "~/_components/layout/Navbar";
import { SessionProvider } from "next-auth/react";
import { Footer } from "~/_components";
import { CopilotKit } from "@copilotkit/react-core";
import "@copilotkit/react-ui/styles.css";
import { CopilotPopup } from "@copilotkit/react-ui";

export const metadata: Metadata = {
  title: "Create LCM App",
  description: "LCM Next.js Boilerplate",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable}`}>
      <body>
        <SessionProvider>
          <CopilotKit publicApiKey={process.env.NEXT_PUBLIC_COPILOTKIT_API_KEY}>
            <TRPCReactProvider>
              <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
              >
                <Navbar />
                {children}
                <Footer />
                <CopilotPopup
                  instructions={
                    "You are assisting the user as best as you can. Answer in the best way possible given the data you have."
                  }
                  labels={{
                    title: "YetiBot",
                    initial: "Need any help?",
                  }}
                />
                <Toaster />
              </ThemeProvider>
            </TRPCReactProvider>
          </CopilotKit>
        </SessionProvider>
      </body>
    </html>
  );
}
