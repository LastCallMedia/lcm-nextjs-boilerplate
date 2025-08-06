"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/_components/ui/card";
import { api } from "~/trpc/react";

export function PrivacyPageClient() {
  const privacyQuery = api.legalPages.getActive.useQuery({ type: "PRIVACY" });
  const privacyData = privacyQuery.data;
  const isLoading = privacyQuery.isLoading;

  // Function to render content with basic markdown-like formatting
  const renderContent = (content: string) => {
    return content.split("\n").map((line, index) => {
      if (line.startsWith("## ")) {
        return (
          <h3
            key={index}
            className="mt-6 mb-3 text-lg font-semibold text-white"
          >
            {line.replace("## ", "")}
          </h3>
        );
      }
      if (line.startsWith("# ")) {
        return (
          <h2 key={index} className="mt-6 mb-4 text-xl font-bold text-white">
            {line.replace("# ", "")}
          </h2>
        );
      }
      // Check for numbered titles like "1. Title", "2. Title", etc.
      if (/^\d+\.\s+/.test(line.trim())) {
        return (
          <h3
            key={index}
            className="mt-6 mb-3 text-lg font-semibold text-white"
          >
            {line}
          </h3>
        );
      }
      if (line.trim() === "") {
        return <br key={index} />;
      }
      return (
        <p key={index} className="text-muted-foreground mb-2">
          {line}
        </p>
      );
    });
  };

  const defaultContent = `## 1. Information We Collect
We collect information you provide directly to us, such as when you create an account, use our services, or contact us for support.

## 2. How We Use Your Information
We use the information we collect to provide, maintain, and improve our services, process transactions, and communicate with you.

## 3. Information Sharing
We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy.

## 4. Data Security
We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.

## 5. Cookies and Tracking
We use cookies and similar technologies to enhance your experience, analyze usage patterns, and personalize content.

## 6. Your Rights
You have the right to access, update, or delete your personal information. You may also opt out of certain communications.

## 7. Children's Privacy
Our services are not intended for children under 13, and we do not knowingly collect personal information from children under 13.

## 8. Changes to This Policy
We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page.

## 9. Contact Us
If you have any questions about this privacy policy, please contact us through our contact page.`;

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center py-8">
          <div className="border-primary h-8 w-8 animate-spin rounded-full border-b-2"></div>
        </div>
      </div>
    );
  }

  // Safely extract title and content with type guards
  let title = "Privacy Policy";
  let content = defaultContent;

  if (
    privacyData &&
    typeof privacyData === "object" &&
    "title" in privacyData &&
    "content" in privacyData
  ) {
    title = String(privacyData.title);
    content = String(privacyData.content);
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        <p className="text-muted-foreground">
          Last updated: {new Date().toLocaleDateString()}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Our Privacy Policy</CardTitle>
          <CardDescription>
            This privacy policy explains how we collect, use, and protect your
            personal information when you use our services.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">{renderContent(content)}</div>
        </CardContent>
      </Card>
    </div>
  );
}
