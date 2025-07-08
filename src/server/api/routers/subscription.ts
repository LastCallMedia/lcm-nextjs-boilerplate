import { publicProcedure, createTRPCRouter } from "../trpc";

export const subscriptionRouter = createTRPCRouter({
  time: publicProcedure.subscription(async function* () {
    const time = 5 * 1000; // 60 seconds
    while (true) {
      await new Promise((res) => setTimeout(res, time));
      yield { now: new Date().toISOString() };
    }
  }),
});
