"use client";

import React, { useMemo, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FormattedMessage, useIntl } from "react-intl";
import { t } from "~/i18n/messages";

import { api } from "~/trpc/react";
import { Input, Button } from "~/_components/ui";
import { toast } from "sonner";

interface PostFormProps {
  className?: string;
}

const PostForm = ({ className }: PostFormProps) => {
  const intl = useIntl();
  const utils = api.useUtils();
  const userId = useMemo(() => crypto.randomUUID(), []);
  /** Channel ID to group typing state per-input or page section */
  const channelId = "landing";
  const typingTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const createPostSchema = z.object({
    name: z.string().min(1, intl.formatMessage({ id: "posts.titleRequired" })),
  });

  const form = useForm<z.infer<typeof createPostSchema>>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      name: "",
    },
  });

  const mutation = api.typing.isTyping.useMutation();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    form.setValue("name", value);

    if (value.length === 0) {
      // clear timeout and update channel
      if (typingTimeout.current) clearTimeout(typingTimeout.current);
      mutation.mutate({ channelId, userId, typing: false });
      return;
    }

    mutation.mutate({ channelId, userId, typing: true });

    if (typingTimeout.current) clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      mutation.mutate({ channelId, userId, typing: false });
    }, 2000);
  };

  const createPost = api.post.create.useMutation({
    onSuccess: async () => {
      await utils.post.invalidate();
      form.reset();
    },
    onError: (error) => {
      console.error("Error creating post:", error);
      toast.error("Failed to create post", {
        description:
          error.message === "UNAUTHORIZED"
            ? "You must be signed in to create posts"
            : error.message
              ? error.message
              : "An unexpected error occurred.",
      });
    },
  });

  const onSubmit = (values: z.infer<typeof createPostSchema>) => {
    createPost.mutate({ name: values.name });
  };

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold">
        <FormattedMessage id={t("posts.createPost")} />
      </h2>

      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={`flex flex-col gap-2 ${className}`}
      >
        <Input
          type="text"
          placeholder={intl.formatMessage({ id: "posts.placeholder" })}
          {...form.register("name")}
          value={form.watch("name")}
          onChange={handleInputChange}
          className="w-full"
        />
        {form.formState.errors.name && (
          <p className="text-destructive text-sm">
            {form.formState.errors.name.message}
          </p>
        )}
        <Button
          type="submit"
          disabled={createPost.isPending}
          className="w-full"
        >
          {createPost.isPending ? (
            <FormattedMessage id={t("posts.submitting")} />
          ) : (
            <FormattedMessage id={t("common.submit")} />
          )}
        </Button>
      </form>
    </div>
  );
};

export default PostForm;
