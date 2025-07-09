import { initTRPC } from "@trpc/server";
import { type OpenApiMeta } from "trpc-to-openapi";
import { z } from "zod";
import { db } from "~/server/db";

const t = initTRPC.meta<OpenApiMeta>().create();

// Define schemas for OpenAPI
const PostSummarySchema = z.object({
  totalPosts: z.number(),
  recentPosts: z.array(
    z.object({
      id: z.number(),
      name: z.string(),
      createdAt: z.date(),
      createdBy: z.object({
        id: z.string(),
        name: z.string().nullable(),
        email: z.string().nullable(),
      }),
    }),
  ),
  postsToday: z.number(),
  postsThisWeek: z.number(),
});

export const openApiRouter = t.router({
  getPostsSummary: t.procedure
    .meta({
      openapi: {
        method: "GET",
        path: "/posts/summary",
        tags: ["posts"],
        summary: "Get summary of all posts",
        description:
          "Returns a summary including total posts, recent posts, and statistics",
      },
    })
    .input(
      z.object({
        limit: z
          .number()
          .min(1)
          .max(50)
          .optional()
          .default(5)
          .describe("Number of recent posts to include"),
      }),
    )
    .output(PostSummarySchema)
    .query(async ({ input }) => {
      const { limit } = input;

      // Get total posts count
      const totalPosts = await db.post.count();

      // Get recent posts with user info
      const recentPosts = await db.post.findMany({
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          createdBy: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      // Get posts created today
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const postsToday = await db.post.count({
        where: {
          createdAt: {
            gte: today,
            lt: tomorrow,
          },
        },
      });

      // Get posts created this week
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay());

      const postsThisWeek = await db.post.count({
        where: {
          createdAt: {
            gte: startOfWeek,
          },
        },
      });

      return {
        totalPosts,
        recentPosts,
        postsToday,
        postsThisWeek,
      };
    }),
});
