"use client";
import { api } from "~/trpc/react";
import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "~/_components/ui/select";
import { Label } from "~/_components/ui/label";

export function LanguageSelectorWrapper({
  messages,
}: {
  messages: Record<string, string>;
}) {
  const { data, isLoading, error } = api.admin.getUserLanguage.useQuery();
  if (isLoading)
    return (
      <span className="text-muted-foreground text-xs">
        {messages["common.loading"] ?? "Loading..."}
      </span>
    );
  if (error || !data || typeof data.language !== "string") {
    return <LanguageSelectorClient currentLanguage="en" messages={messages} />;
  }
  return (
    <LanguageSelectorClient
      currentLanguage={data.language}
      messages={messages}
    />
  );
}

interface LanguageSelectorClientProps {
  currentLanguage: string;
  messages: Record<string, string>;
}

export function LanguageSelectorClient({
  currentLanguage,
  messages,
}: LanguageSelectorClientProps) {
  const mutation = api.admin.updateUserLanguage.useMutation();
  const refetchLanguage = api.admin.getUserLanguage.useQuery(undefined, {
    enabled: false,
  });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const handleChange = async (value: string) => {
    setSaving(true);
    setSuccess(false);
    try {
      await mutation.mutateAsync({ language: value });
      await refetchLanguage.refetch(); // Refetch language from backend
      setSuccess(true);
      toast.success(
        messages["settings.account.languageChanged"] ??
          "Language updated successfully!",
      );
      // Redirect to the new locale route
      const segments = pathname.split("/");
      if (segments.length > 1) {
        segments[1] = value; // Replace locale segment
        router.replace(segments.join("/"));
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex items-center gap-4">
      <Label htmlFor="language-select">
        {messages["settings.account.language"] ?? "Language"}
      </Label>
      <Select
        value={currentLanguage}
        onValueChange={handleChange}
        disabled={saving}
      >
        <SelectTrigger id="language-select" className="min-w-[120px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="en">English</SelectItem>
          <SelectItem value="es">Español</SelectItem>
        </SelectContent>
      </Select>
      {saving && (
        <span className="text-muted-foreground text-xs">
          {messages["common.loading"] ?? "Saving..."}
        </span>
      )}
      {success && (
        <span className="text-xs text-green-600">
          {messages["common.save"] ?? "Saved!"}
        </span>
      )}
    </div>
  );
}
