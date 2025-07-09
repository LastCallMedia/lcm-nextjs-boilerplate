"use client";

import { api } from "~/trpc/react";
import { useMemo, useEffect, useRef } from "react";

export function TypingIndicator({ channelId }: { channelId: string }) {
  const userId = useMemo(() => crypto.randomUUID(), []);
  const typingRef = useRef(false);
  const mutation = api.typing.isTyping.useMutation();

  const { data: typers = [] } = api.typing.whoIsTyping.useSubscription({
    channelId,
  });

  useEffect(() => {
    const handler = () => {
      if (typingRef.current) return;
      typingRef.current = true;
      mutation.mutate({ channelId, userId, typing: true });

      setTimeout(() => {
        typingRef.current = false;
        mutation.mutate({ channelId, userId, typing: false });
      }, 2000);
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [channelId, userId, mutation]);

  return (
    <p className="text-muted-foreground text-sm">
      {typers.length > 0
        ? `${typers.length} ${typers.length === 1 ? "person" : "people"} typing...`
        : "No one typing"}
    </p>
  );
}
