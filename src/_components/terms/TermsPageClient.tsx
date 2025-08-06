"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/_components/ui/card";
import { api } from "~/trpc/react";

export function TermsPageClient() {
  const termsQuery = api.terms.getActive.useQuery();
  const termsData = termsQuery.data;
  const isLoading = termsQuery.isLoading;

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

  const defaultContent = `## 1. Acceptance of Terms
By accessing and using this application, you accept and agree to be bound by the terms and provision of this agreement.

## 2. Use License
Permission is granted to temporarily use this application for personal, non-commercial transitory viewing only.

## 3. Disclaimer
The materials on this application are provided on an 'as is' basis. We make no warranties, expressed or implied, and hereby disclaim and negate all other warranties.

## 4. Limitations
In no event shall the company or its suppliers be liable for any damages arising out of the use or inability to use the materials on this application.

## 5. Accuracy of Materials
The materials appearing on this application could include technical, typographical, or photographic errors. We do not warrant that any of the materials are accurate, complete, or current.

## 6. Modifications
We may revise these terms of service at any time without notice. By using this application, you are agreeing to be bound by the then current version of these terms of service.

## 7. Contact Information
If you have any questions about these Terms and Conditions, please contact us through our contact page.`;

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
  let title = "Terms and Conditions";
  let content = defaultContent;

  if (
    termsData &&
    typeof termsData === "object" &&
    "title" in termsData &&
    "content" in termsData
  ) {
    title = String(termsData.title);
    content = String(termsData.content);
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        <p className="text-muted-foreground">
          Please read these terms and conditions carefully
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Terms of Service</CardTitle>
          <CardDescription>
            Last updated: {new Date().toLocaleDateString()}
          </CardDescription>
        </CardHeader>
        <CardContent className="prose prose-sm max-w-none">
          <div className="space-y-2">{renderContent(content)}</div>

          {!termsData && (
            <div className="bg-muted mt-8 rounded-lg p-4">
              <p className="text-muted-foreground text-sm">
                <strong>Note:</strong> This is a placeholder Terms and
                Conditions page. Administrators can customize this content
                through the admin settings page.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
