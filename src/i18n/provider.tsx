"use client";

import { IntlProvider as ReactIntlProvider } from "react-intl";
import { type Messages } from "./messages";
import { type Locale } from "./config";

interface IntlProviderProps {
  locale: Locale;
  messages: Messages;
  children: React.ReactNode;
}

// Flatten nested messages for react-intl
function flattenMessages(
  messages: Record<string, unknown>,
  prefix = "",
): Record<string, string> {
  const flattened: Record<string, string> = {};

  Object.keys(messages).forEach((key) => {
    const value = messages[key];
    const newKey = prefix ? `${prefix}.${key}` : key;

    if (typeof value === "string") {
      flattened[newKey] = value;
    } else if (typeof value === "object" && value !== null) {
      Object.assign(
        flattened,
        flattenMessages(value as Record<string, unknown>, newKey),
      );
    }
  });

  return flattened;
}

export function IntlProvider({
  locale,
  messages,
  children,
}: IntlProviderProps) {
  const flattenedMessages = flattenMessages(
    messages as Record<string, unknown>,
  );

  return (
    <ReactIntlProvider locale={locale} messages={flattenedMessages}>
      {children}
    </ReactIntlProvider>
  );
}
