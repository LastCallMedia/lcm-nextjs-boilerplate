import { createTRPCRouter, publicProcedure } from "../trpc";
import { z } from "zod";
import EventEmitter, { on } from "node:events";

export type WhoIsTyping = Record<string, { lastTyped: Date }>;

type EventMap<T> = Record<keyof T, any[]>;
class IterableEventEmitter<T extends EventMap<T>> extends EventEmitter {
  toIterable<TEventName extends keyof T & string>(
    event: TEventName,
    opts?: NonNullable<Parameters<typeof on>[2]>,
  ): AsyncIterable<T[TEventName]> {
    return on(this as any, event, opts) as any;
  }
}

export interface MyEvents {
  isTypingUpdate: [channelId: string, who: WhoIsTyping];
}

export const ee = new IterableEventEmitter<MyEvents>();
export const currentlyTyping: Record<string, WhoIsTyping> = Object.create(null);

// Clear out typers after inactivity
setInterval(() => {
  const now = Date.now();
  const updatedChannels = new Set<string>();

  for (const [channelId, typers] of Object.entries(currentlyTyping)) {
    for (const [id, info] of Object.entries(typers ?? {})) {
      if (now - info.lastTyped.getTime() > 3000) {
        delete typers[id];
        updatedChannels.add(channelId);
      }
    }
  }

  updatedChannels.forEach((channelId) => {
    ee.emit("isTypingUpdate", channelId, currentlyTyping[channelId] ?? {});
  });
}, 3000).unref();

export const typingRouter = createTRPCRouter({
  isTyping: publicProcedure
    .input(
      z.object({
        channelId: z.string().min(1),
        userId: z.string().min(1), // can be anon UUID
        typing: z.boolean(),
      }),
    )
    .mutation(({ input }) => {
      const { channelId, userId, typing } = input;

      currentlyTyping[channelId] ??= {};

      if (typing) {
        currentlyTyping[channelId][userId] = { lastTyped: new Date() };
      } else {
        delete currentlyTyping[channelId][userId];
      }

      ee.emit("isTypingUpdate", channelId, currentlyTyping[channelId]);
    }),

  whoIsTyping: publicProcedure
    .input(z.object({ channelId: z.string().min(1) }))
    .subscription(async function* ({ input, signal }) {
      const { channelId } = input;
      let lastEmit = "";

      function* maybeYield(who: WhoIsTyping) {
        const sorted = Object.keys(who).toSorted().toString();
        if (sorted === lastEmit) return;
        lastEmit = sorted;
        yield Object.keys(who);
      }

      // Send current state immediately
      yield* maybeYield(currentlyTyping[channelId] ?? {});

      for await (const [updatedChannelId, who] of ee.toIterable(
        "isTypingUpdate",
        { signal },
      )) {
        if (updatedChannelId === channelId) {
          yield* maybeYield(who);
        }
      }
    }),
});
