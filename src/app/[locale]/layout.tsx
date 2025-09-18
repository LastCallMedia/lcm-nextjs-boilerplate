import { SessionProvider } from "next-auth/react";
import { AuthProvider } from "~/_components/auth";
import { Footer } from "~/_components/layout";
import { Navbar } from "~/_components/layout/Navbar";
import { Toaster } from "~/_components/ui/sonner";
import { ThemeProvider } from "~/_components/ui/theme-provider";
import { IntlProvider, getMessages, getValidLocale, locales } from "~/i18n";
import { TRPCReactProvider } from "~/trpc/react";
import Chatbot from "~/_components/ai/Chatbot";

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale: localeParam } = await params;
  const locale = getValidLocale(localeParam);
  const messages = getMessages(locale);

  return (
    <SessionProvider>
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
                <main>{children}</main>
                <Footer />
              </div>
              <Toaster duration={4000} />
              <Chatbot />
            </ThemeProvider>
          </IntlProvider>
        </AuthProvider>
      </TRPCReactProvider>
    </SessionProvider>
  );
}
