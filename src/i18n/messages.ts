import { type Locale } from "./config";
import enMessages from "./messages/en.json";
import esMessages from "./messages/es.json";

// Flatten nested messages utility
function flattenMessages(
  nestedMessages: Record<string, unknown>,
  prefix = "",
): Record<string, string> {
  return Object.keys(nestedMessages).reduce(
    (messages, key) => {
      const value = nestedMessages[key];
      const prefixedKey = prefix ? `${prefix}.${key}` : key;
      if (typeof value === "string") {
        messages[prefixedKey] = value;
      } else if (typeof value === "object" && value !== null) {
        Object.assign(
          messages,
          flattenMessages(value as Record<string, unknown>, prefixedKey),
        );
      }
      return messages;
    },
    {} as Record<string, string>,
  );
}

const messagesMap = {
  en: flattenMessages(enMessages),
  es: flattenMessages(esMessages),
};

export function getMessages(locale: Locale): Record<string, string> {
  return messagesMap[locale] ?? messagesMap.en;
}
