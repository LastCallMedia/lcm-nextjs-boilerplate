import "~/styles/globals.css";

import { type Metadata } from "next";
import { TRPCReactProvider } from "~/trpc/react";
import { Navbar, Footer } from "~/_components/layout";
import { AuthProvider } from "~/_components/auth";
import { ThemeProvider } from "~/_components/ui/theme-provider";
import { IntlProvider, getMessages, getValidLocale, locales } from "~/i18n";

export const metadata: Metadata = {
  title: "Create LCM App",
  description: "LCM Next.js Boilerplate",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

interface RootLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function LocaleLayout({
  children,
  params,
}: RootLayoutProps) {
  const { locale: localeParam } = await params;
  const locale = getValidLocale(localeParam);
  const messages = await getMessages(locale);

  return (
    <TRPCReactProvider>
      <AuthProvider>
        <IntlProvider locale={locale} messages={messages}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <div className="grid min-h-screen grid-rows-[auto_1fr_auto]">
              <Navbar currentLocale={locale} />
              <div>{children}</div>
              <Footer />
            </div>
          </ThemeProvider>
        </IntlProvider>
      </AuthProvider>
    </TRPCReactProvider>
  );
}
