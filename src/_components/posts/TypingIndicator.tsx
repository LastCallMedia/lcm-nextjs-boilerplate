"use client";

import { api } from "~/trpc/react";

export function TypingIndicator({ channelId }: { channelId: string }) {
  const { data: typers = [] } = api.typing.whoIsTyping.useSubscription({
    channelId,
  });

  return (
    <p className="text-muted-foreground mb-8 text-center text-sm">
      {typers.length > 0
        ? `${typers.length} ${typers.length === 1 ? "person" : "people"} typing...`
        : "No one typing"}
    </p>
  );
}
