"use client";

import React from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FormattedMessage, useIntl } from "react-intl";

import { api } from "~/trpc/react";
import { Input, Button } from "~/_components/ui";

interface PostFormProps {
  className?: string;
}
const PostForm = ({ className }: PostFormProps) => {
  const intl = useIntl();
  const utils = api.useUtils();

  const createPostSchema = z.object({
    name: z.string().min(1, intl.formatMessage({ id: "posts.titleRequired" })),
  });

  const form = useForm<z.infer<typeof createPostSchema>>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      name: "",
    },
  });

  const createPost = api.post.create.useMutation({
    onSuccess: async () => {
      await utils.post.invalidate();
      form.reset();
    },
  });

  const onSubmit = (values: z.infer<typeof createPostSchema>) => {
    createPost.mutate({ name: values.name });
  };
  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className={`flex flex-col gap-2 ${className}`}
    >
      <Input
        type="text"
        placeholder={intl.formatMessage({ id: "posts.placeholder" })}
        {...form.register("name")}
        className="w-full"
      />
      {form.formState.errors.name && (
        <p className="text-destructive text-sm">
          {form.formState.errors.name.message}
        </p>
      )}
      <Button type="submit" disabled={createPost.isPending} className="w-full">
        {createPost.isPending ? (
          <FormattedMessage id="posts.submitting" />
        ) : (
          <FormattedMessage id="common.submit" />
        )}
      </Button>
    </form>
  );
};

export default PostForm;
