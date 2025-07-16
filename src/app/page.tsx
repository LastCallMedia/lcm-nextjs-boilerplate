import { redirect } from "next/navigation";
import { defaultLocale } from "~/i18n";

// This page redirects to the default locale
export default function RootPage() {
  redirect(`/${defaultLocale}`);
}
