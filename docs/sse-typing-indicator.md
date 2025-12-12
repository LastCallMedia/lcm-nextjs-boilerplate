# 💬 Typing Indicator

This project includes a real-time typing indicator using **tRPC subscriptions** and a lightweight **in-memory pub/sub** system. It's a simple pattern for building collaborative UI features _without_ requiring WebSockets, Redis, or other external infrastructure.

---

## Overview

The typing indicator feature includes:

- A **mutation** to signal when a user starts/stops typing
- A **subscription** to stream typing activity to other clients
- An in-memory `EventEmitter` wrapped in an `IterableEventEmitter`
- Lightweight UI integration that emits and displays typing activity

---

## Architecture

### EventEmitter

We use a custom `IterableEventEmitter` to turn a Node.js `EventEmitter` into an async iterable, compatible with `async function*`.

```ts
export const ee = new IterableEventEmitter<MyEvents>();
```

This allows us to use `for await...of` in our `whoIsTyping` subscription to track updates

### Typing State Store

Typing activity is held in memory with this shape:

```ts
const currentlyTyping: Record<string, WhoIsTyping> = Object.create(null);
```

Each key represents a `channelId`, which maps to users:

```ts
{
  "landing": {
    "user-123": { lastTyped: Date }
  }
}
```

A periodic `setInterval` removes entries older than \~2 seconds and emits an event when the active user list changes.

### Procedures

#### `isTyping` Mutation

Triggered by the client when a user types:

```ts
mutation.mutate({ channelId, userId, typing: true });
```

This updates `currentlyTyping`, emits an event, and starts the expiration timer.

#### `whoIsTyping` Subscription

Subscribed to by all clients for a given `channelId`. Emits updated arrays of `userId`s.

```ts
for await (const [channelId, who] of ee.toIterable("isTypingUpdate", {
  signal,
})) {
  yield Object.keys(who);
}
```

---

## Frontend Usage

### Emitting Typing State

We track input using `react-hook-form` and `form.watch("name")`. When the input has value and the user isn't already marked as typing:

```ts
mutation.mutate({ typing: true });
```

A `setTimeout` resets the typing flag after 2 seconds:

```ts
setTimeout(() => {
  mutation.mutate({ typing: false });
}, 2000);
```

This is **debounced** by tracking a local `typingRef.current` value.

### Displaying Who's Typing

In `TypingIndicator.tsx`, we subscribe to `whoIsTyping` and render a simple status line:

```ts
const { data: typers = [] } = api.typing.whoIsTyping.useSubscription({ channelId });

return <p>{typers.length ? `${typers.length} typing...` : "No one typing"}</p>;
```

The display is decoupled from the typing logic, making the component reusable.

---

## Auth Notes

- `isTyping` and `whoIsTyping` is currently public — you may want to guard this in the future
- `userId` can be generated anonymously (`crypto.randomUUID`) or tied to `ctx.session.user.id`

---

### Compared to WebSockets

| Feature     | This Approach          | WebSockets                          |
| ----------- | ---------------------- | ----------------------------------- |
| Setup       | Built-in to tRPC       | Requires separate server/infra      |
| Persistence | In-memory only         | Can use Redis or DB-backed pub/sub  |
| Scaling     | Single-node only       | Scales across workers w/ Redis etc. |
| Dev speed   | Super fast             | More infra and config needed        |
| Reliability | Lost on server restart | Can persist via external store      |

### Limitations

- No cross-instance sync
- No persistent state

---

## Testing & Observability

This feature is:

- Stateless: resets on server restart
- Low-risk: doesn't mutate real user data
- Easy to test locally by opening two windows
- Easy to observe using a simple debug log or UI panel

---

## Future Directions

- Replace `EventEmitter` with [Redis Pub/Sub](https://redis.io/docs/interact/pubsub/) for scale
- Switch to [tRPC WebSockets link](https://trpc.io/docs/server/websockets) for persistent transport
- Show user avatars or names
- Typing timeout animations (e.g., fade out)

---

## Example Use Case

> A shared post input form where multiple users can see when others are typing, using nothing more than a tRPC subscription and local event state.

This pattern showcases how **tRPC + async iterators** can be used for reactive UI features _without introducing complex infrastructure_. It’s simple, scalable within a single instance, and easy to extend.

---

**Related Files**:

- `src/server/api/routers/typing.ts`
- `src/_components/posts/TypingIndicator.tsx`
- `src/_components/posts/PostForm.tsx`
