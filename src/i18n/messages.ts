import { type Locale } from "~/i18n/config";
import enMessages from "~/i18n/messages/en.json";
import esMessages from "~/i18n/messages/es.json";

type FlattenKeys<T, P extends string = ""> = {
  [K in keyof T]: T[K] extends string
    ? `${P}${Extract<K, string>}`
    : T[K] extends Record<string, unknown>
      ? FlattenKeys<T[K], `${P}${Extract<K, string>}.`>
      : never;
}[keyof T];

function flattenMessages<T extends Record<string, unknown>>(
  nestedMessages: T,
  prefix = "",
): Record<FlattenKeys<T>, string> {
  let result: Record<string, string> = {};

  for (const key in nestedMessages) {
    const value = nestedMessages[key];
    const newKey = prefix ? `${prefix}.${key}` : key;

    if (typeof value === "string") {
      result = { ...result, [newKey]: value };
    } else if (typeof value === "object" && value !== null) {
      const nested = flattenMessages(value as Record<string, unknown>, newKey);
      result = { ...result, ...nested };
    }
  }

  return result as Record<FlattenKeys<T>, string>;
}

// To support additional languages, import the new JSON and add it to messagesMap below.
// Keeping all language messages in this file is recommended for static, known values.
// Separate files are only needed for dynamic or large-scale localization.
const enFlat = flattenMessages(enMessages);
const esFlat = flattenMessages(esMessages);

const messagesMap = {
  en: enFlat,
  es: esFlat,
};

export function getMessages(locale: Locale): Record<string, string> {
  return messagesMap[locale] ?? messagesMap.en;
}

export type MessageKey = keyof typeof enFlat;

export function t<K extends MessageKey>(key: K): K {
  return key;
}
