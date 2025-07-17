"use client";
import { IntlProvider } from "react-intl";
import React from "react";

interface IntlClientProviderProps {
  locale: string;
  messages: Record<string, string>;
  defaultLocale: string;
  children: React.ReactNode;
}

const IntlClientProvider = ({
  locale,
  messages,
  defaultLocale,
  children,
}: IntlClientProviderProps) => (
  <IntlProvider
    locale={locale}
    messages={messages}
    defaultLocale={defaultLocale}
  >
    {children}
  </IntlProvider>
);

export default IntlClientProvider;
