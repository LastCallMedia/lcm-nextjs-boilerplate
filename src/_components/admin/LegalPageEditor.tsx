"use client";

import { type ChangeEvent, useState } from "react";
import { toast } from "sonner";
import { Button } from "~/_components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/_components/ui/card";
import { Input } from "~/_components/ui/input";
import { Label } from "~/_components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/_components/ui/select";
import { Textarea } from "~/_components/ui/textarea";
import { api } from "~/trpc/react";

export function LegalPageEditor() {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedType, setSelectedType] = useState<"TERMS" | "PRIVACY">(
    "TERMS",
  );
  const [formData, setFormData] = useState({
    type: "TERMS" as "TERMS" | "PRIVACY",
    title: "Terms and Conditions",
    content: "",
  });

  // Get current legal page data for the selected type
  const legalPageQuery = api.legalPages.getActive.useQuery({
    type: selectedType,
  });
  const currentLegalPage = legalPageQuery.data;
  const { refetch } = legalPageQuery;

  // Mutation for saving legal page
  const upsertLegalPage = api.legalPages.upsert.useMutation({
    onSuccess: () => {
      setIsEditing(false);
      void refetch();
      toast.success(
        `${selectedType === "TERMS" ? "Terms and Conditions" : "Privacy Policy"} saved successfully!`,
      );
    },
    onError: (error) => {
      toast.error(
        `Failed to save ${selectedType === "TERMS" ? "Terms and Conditions" : "Privacy Policy"}: ${error.message}`,
      );
    },
  });

  const handleEdit = () => {
    if (
      currentLegalPage &&
      typeof currentLegalPage === "object" &&
      "title" in currentLegalPage &&
      "content" in currentLegalPage &&
      "type" in currentLegalPage
    ) {
      setFormData({
        type: String(currentLegalPage.type) as "TERMS" | "PRIVACY",
        title: String(currentLegalPage.title),
        content: String(currentLegalPage.content),
      });
    } else {
      // Set default content based on type
      const defaultTitles = {
        TERMS: "Terms and Conditions",
        PRIVACY: "Privacy Policy",
      };

      const defaultContent =
        selectedType === "TERMS"
          ? getDefaultTermsContent()
          : getDefaultPrivacyContent();

      setFormData({
        type: selectedType,
        title: defaultTitles[selectedType],
        content: defaultContent,
      });
    }
    setIsEditing(true);
  };

  const handleSave = () => {
    upsertLegalPage.mutate({
      id:
        currentLegalPage &&
        typeof currentLegalPage === "object" &&
        "id" in currentLegalPage
          ? String(currentLegalPage.id)
          : undefined,
      type: formData.type,
      title: formData.title,
      content: formData.content,
      isActive: true,
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      type: selectedType,
      title: "",
      content: "",
    });
  };

  const handleTypeChange = (newType: "TERMS" | "PRIVACY") => {
    setSelectedType(newType);
    setIsEditing(false); // Exit edit mode when switching types
  };

  // Get display data for the current page
  const getDisplayData = () => {
    if (
      currentLegalPage &&
      typeof currentLegalPage === "object" &&
      "title" in currentLegalPage &&
      "content" in currentLegalPage
    ) {
      return {
        title: String(currentLegalPage.title),
        content: String(currentLegalPage.content),
      };
    }

    const defaultTitles = {
      TERMS: "Terms and Conditions",
      PRIVACY: "Privacy Policy",
    };

    return {
      title: defaultTitles[selectedType],
      content:
        selectedType === "TERMS"
          ? getDefaultTermsContent()
          : getDefaultPrivacyContent(),
    };
  };

  const displayData = getDisplayData();

  if (legalPageQuery.isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="border-primary h-8 w-8 animate-spin rounded-full border-b-2"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Type Selector */}
      <Card>
        <CardHeader>
          <CardTitle>Legal Page Type</CardTitle>
          <CardDescription>
            Select which type of legal page you want to edit
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="page-type">Page Type</Label>
            <Select value={selectedType} onValueChange={handleTypeChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select page type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="TERMS">Terms and Conditions</SelectItem>
                <SelectItem value="PRIVACY">Privacy Policy</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Editor/Display */}
      <Card>
        <CardHeader>
          <CardTitle>
            {selectedType === "TERMS"
              ? "Terms and Conditions"
              : "Privacy Policy"}{" "}
            Editor
          </CardTitle>
          <CardDescription>
            {isEditing
              ? `Edit your ${selectedType.toLowerCase()} page content`
              : `Manage your ${selectedType.toLowerCase()} page content`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!isEditing ? (
            <div className="space-y-4">
              <div>
                <h3 className="mb-2 text-lg font-semibold">
                  {displayData.title}
                </h3>
                <div className="bg-muted max-h-96 overflow-y-auto rounded-lg p-4">
                  <pre className="text-sm whitespace-pre-wrap">
                    {displayData.content}
                  </pre>
                </div>
              </div>
              <Button onClick={handleEdit}>
                {currentLegalPage ? "Edit Page" : "Create Page"}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="legal-title">Title</Label>
                <Input
                  id="legal-title"
                  value={formData.title}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="Enter page title"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="legal-content">
                  Content (Markdown supported)
                </Label>
                <Textarea
                  id="legal-content"
                  value={formData.content}
                  onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                  placeholder={`Enter your ${selectedType.toLowerCase()} content`}
                  rows={15}
                  className="font-mono text-sm"
                />
                <p className="text-muted-foreground text-xs">
                  You can use Markdown formatting. Use ## for headings, **bold**
                  text, and numbered lists like &quot;1. Item&quot;.
                </p>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleSave}
                  disabled={upsertLegalPage.isPending}
                >
                  {upsertLegalPage.isPending ? "Saving..." : "Save"}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  disabled={upsertLegalPage.isPending}
                >
                  Cancel
                </Button>
              </div>

              {upsertLegalPage.error && (
                <div className="text-destructive text-sm">
                  Error: {upsertLegalPage.error.message}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function getDefaultTermsContent() {
  return `## 1. Acceptance of Terms
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
}

function getDefaultPrivacyContent() {
  return `## 1. Information We Collect
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
}
