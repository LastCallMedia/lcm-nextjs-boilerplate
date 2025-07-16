import { type Locale } from "./config";
import enMessages from "./messages/en.json";
import esMessages from "./messages/es.json";

// Define the shape of our messages
export type Messages = typeof enMessages;

const messagesMap: Record<Locale, Messages> = {
  en: enMessages,
  es: esMessages,
};

export async function getMessages(locale: Locale): Promise<Messages> {
  try {
    return messagesMap[locale] ?? messagesMap.en;
  } catch (error) {
    console.error(`Failed to load messages for locale ${locale}:`, error);
    // Fallback to English if locale messages fail to load
    return messagesMap.en;
  }
}
