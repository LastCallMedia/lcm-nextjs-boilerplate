import type { Metadata } from "next";
import { TermsPageClient } from "~/_components/terms";

export const metadata: Metadata = {
  title: "Terms and Conditions | Legal",
  description: "Our terms and conditions page",
};

export default function TermsPage() {
  return <TermsPageClient />;
}
