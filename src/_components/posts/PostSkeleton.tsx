import React from "react";
import { Skeleton } from "~/_components/ui";

const PostSkeleton = () => {
  return (
    <div className="flex flex-col space-y-3">
      <Skeleton className="h-[125px] max-w-lg rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-4 max-w-lg" />
        <Skeleton className="h-4 max-w-lg" />
      </div>
    </div>
  );
};

export default PostSkeleton;
