"use client";

import React from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

import { api } from "~/trpc/react";
import { Input, Button } from "~/_components/ui";

const createPostSchema = z.object({
  name: z.string().min(1, "Title is required"),
});

interface PostFormProps {
  className?: string;
}
const PostForm = ({ className }: PostFormProps) => {
  const utils = api.useUtils();

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
      toast.success("Post created successfully!");
    },
    onError: (_error) => {
      toast.error("Failed to create post. Please try again.");
    },
  });

  const onSubmit = (values: z.infer<typeof createPostSchema>) => {
    createPost.mutate({ name: values.name });
  };
  return (
    <div className={`w-full max-w-xs ${className}`}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        <Input
          type="text"
          placeholder="What's on your mind?"
          {...form.register("name")}
          disabled={createPost.isPending}
        />
        {form.formState.errors.name && (
          <p className="text-sm text-red-500">
            {form.formState.errors.name.message}
          </p>
        )}
        <Button
          type="submit"
          disabled={createPost.isPending}
          className="w-full"
        >
          {createPost.isPending ? "Submitting..." : "Submit"}
        </Button>
      </form>
    </div>
  );
};

export default PostForm;
