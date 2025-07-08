"use client";

import { api } from "~/trpc/react";
import { useEffect } from "react";

export function TimeLogger() {
  api.subscription.time.useSubscription(undefined, {
    onData(data) {
      console.log("🕒 Server time:", data.now);
    },
  });

  useEffect(() => {
    console.log("🔌 TimeLogger mounted");
  }, []);

  return null;
}
