"use client";

import type { Post } from "@prisma/client";
import { FormattedDate, FormattedTime } from "react-intl";
import { Card, CardContent, CardFooter } from "../ui/card";

interface PostCardProps {
  post: Post;
  className?: string;
}

export function PostCard({ post, className }: PostCardProps) {
  return (
    <Card className={`w-full ${className}`}>
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
