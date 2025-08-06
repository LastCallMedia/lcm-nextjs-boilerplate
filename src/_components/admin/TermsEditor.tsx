"use client";

import { useState } from "react";
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
import { Textarea } from "~/_components/ui/textarea";
import { api } from "~/trpc/react";

export function TermsEditor() {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    title: "Terms and Conditions",
    content: "",
  });

  // Get current terms data
  const { data: currentTerms, refetch } = api.terms.getActive.useQuery();

  // Mutation for saving terms
  const upsertTerms = api.terms.upsert.useMutation({
    onSuccess: () => {
      setIsEditing(false);
      void refetch();
    },
  });

  const handleEdit = () => {
    if (currentTerms) {
      setFormData({
        title: currentTerms.title,
        content: currentTerms.content,
      });
    } else {
      setFormData({
        title: "Terms and Conditions",
        content: `1. Acceptance of Terms
By using this application, you agree to these terms.

2. Use License
Permission is granted to use this application for personal use.

3. Contact
If you have questions, please contact us.`,
      });
    }
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      await upsertTerms.mutateAsync({
        id: currentTerms?.id,
        title: formData.title,
        content: formData.content,
        isActive: true,
      });
    } catch (error) {
      console.error("Failed to save terms:", error);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({ title: "", content: "" });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Terms and Conditions Management
          {!isEditing && (
            <Button onClick={handleEdit} variant="outline" size="sm">
              {currentTerms ? "Edit" : "Create"}
            </Button>
          )}
        </CardTitle>
        <CardDescription>
          Create and manage your terms and conditions page content
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="terms-title">Page Title</Label>
              <Input
                id="terms-title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="Enter page title"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="terms-content">
                Content (Markdown supported)
              </Label>
              <Textarea
                id="terms-content"
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
                placeholder="Enter your terms and conditions content"
                rows={15}
                className="font-mono text-sm"
              />
              <p className="text-muted-foreground text-xs">
                You can use Markdown formatting. Use ## for headings, **bold**
                for bold text, etc.
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleSave}
                disabled={upsertTerms.isPending}
                size="sm"
              >
                {upsertTerms.isPending ? "Saving..." : "Save & Publish"}
              </Button>
              <Button
                onClick={handleCancel}
                variant="outline"
                disabled={upsertTerms.isPending}
                size="sm"
              >
                Cancel
              </Button>
            </div>

            {upsertTerms.error && (
              <div className="rounded bg-red-100 p-2 text-sm text-red-800">
                {upsertTerms.error.message}
              </div>
            )}

            {upsertTerms.isSuccess && (
              <div className="rounded bg-green-100 p-2 text-sm text-green-800">
                Terms and Conditions have been updated successfully.
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {currentTerms ? (
              <>
                <div>
                  <h4 className="mb-2 font-medium">Current Status:</h4>
                  <span className="rounded-full bg-green-100 px-2 py-1 text-xs text-green-800">
                    Published
                  </span>
                </div>

                <div>
                  <h4 className="mb-2 font-medium">Current Title:</h4>
                  <p className="text-sm">{currentTerms.title}</p>
                </div>

                <div>
                  <h4 className="mb-2 font-medium">Content Preview:</h4>
                  <div className="text-muted-foreground bg-muted max-h-32 overflow-y-auto rounded-md p-3 text-sm">
                    {currentTerms.content.slice(0, 300)}
                    {currentTerms.content.length > 300 && "..."}
                  </div>
                </div>

                <div>
                  <h4 className="mb-2 font-medium">Last Updated:</h4>
                  <p className="text-sm">
                    {new Date(currentTerms.updatedAt).toLocaleDateString()}
                  </p>
                </div>

                <div>
                  <h4 className="mb-2 font-medium">Public URL:</h4>
                  <p className="text-sm text-blue-600">
                    <a
                      href="/terms"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline"
                    >
                      /terms
                    </a>
                  </p>
                </div>
              </>
            ) : (
              <div className="py-8 text-center">
                <p className="text-muted-foreground">
                  No terms and conditions created yet.
                </p>
                <p className="text-muted-foreground mt-2 text-sm">
                  Click &apos;Create&apos; to add your terms and conditions.
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
