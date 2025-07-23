"use client";

import type { Post } from "@prisma/client";
import { FormattedDate, FormattedTime } from "react-intl";
import { Card, CardContent, CardFooter } from "~/_components/ui/card";

interface PostCardProps {
  post: Post;
  className?: string;
}

export function PostCard({ post, className }: PostCardProps) {
  return (
    <Card className={`m-4 w-full max-w-lg ${className}`}>
      <CardContent>
        <p>{post.name}</p>
      </CardContent>
      <CardFooter>
        <p className="text-muted-foreground text-xs">
          <FormattedDate value={post.createdAt} />{" "}
          <FormattedTime value={post.createdAt} />
        </p>
      </CardFooter>
    </Card>
  );
}

export default PostCard;
