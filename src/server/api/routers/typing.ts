import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";
import EventEmitter, { on } from "node:events";

/** WhoIsTyping maps a user ID (or name) to their last typed timestamp */
export type WhoIsTyping = Record<string, { lastTyped: Date }>;

/** Utility type for the event emitter map */
type EventMap = {
  isTypingUpdate: [channelId: string, who: WhoIsTyping];
};

class IterableEventEmitter<
  T extends Record<string, unknown[]>,
> extends EventEmitter {
  toIterable<TEventName extends keyof T & string>(
    eventName: TEventName,
    opts?: NonNullable<Parameters<typeof on>[2]>,
  ): AsyncIterable<T[TEventName]> {
    return on(
      this as unknown as EventEmitter,
      eventName,
      opts,
    ) as AsyncIterable<T[TEventName]>;
  }
}

/** Instantiate the custom event emitter */
export const ee = new IterableEventEmitter<EventMap>();

/** In-memory store for who is currently typing per "channel" */
export const currentlyTyping: Record<string, WhoIsTyping> = {};

/** Clean out users who stopped typing (after 3s of inactivity) */
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

  for (const channelId of updatedChannels) {
    ee.emit("isTypingUpdate", channelId, currentlyTyping[channelId] ?? {});
  }
}, 3000).unref();

export const typingRouter = createTRPCRouter({
  isTyping: publicProcedure
    .input(
      z.object({
        channelId: z.string(),
        userId: z.string(),
        typing: z.boolean(),
      }),
    )
    .mutation(({ input }) => {
      const { channelId, userId, typing } = input;
      currentlyTyping[channelId] ??= {};

      if (!typing) {
        delete currentlyTyping[channelId][userId];
      } else {
        currentlyTyping[channelId][userId] = {
          lastTyped: new Date(),
        };
      }

      ee.emit("isTypingUpdate", channelId, currentlyTyping[channelId]);
    }),

  whoIsTyping: publicProcedure
    .input(z.object({ channelId: z.string() }))
    .subscription(async function* ({ input, ctx }) {
      const { channelId } = input;
      let lastIndex = "";

      // Emit initial state
      yield Object.keys(currentlyTyping[channelId] ?? {});

      for await (const [emittedChannelId, who] of ee.toIterable(
        "isTypingUpdate",
        {
          signal: ctx.signal,
        },
      )) {
        if (emittedChannelId !== channelId) continue;

        const index = Object.keys(who).sort().join(",");
        if (index !== lastIndex) {
          yield Object.keys(who);
          lastIndex = index;
        }
      }
    }),
});
