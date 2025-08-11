import { type Metadata } from "next";
import { PrivacyPageClient } from "~/_components/privacy/PrivacyPageClient";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Our privacy policy and data protection practices.",
};

export default function PrivacyPage() {
  return <PrivacyPageClient />;
}
