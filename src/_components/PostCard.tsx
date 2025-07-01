import type { Post } from "@prisma/client";
import { Card, CardContent, CardFooter } from "./ui/card";

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
          {post.createdAt.toLocaleDateString()}{" "}
          {post.createdAt.toLocaleTimeString()}
        </p>
      </CardFooter>
    </Card>
  );
}

export default PostCard;
