import type { Prisma } from "@prisma/client";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

// Define Zod schemas for Post model
const PostSchema = z.object({
  id: z.number(),
  name: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  createdById: z.string(),
});

export const postRouter = createTRPCRouter({
  hello: publicProcedure
    .meta({
      openapi: {
        method: "GET",
        path: "/posts/hello",
        tags: ["posts"],
        summary: "Get personalized greetings",
        description: "Returns text greeting the user",
      },
    })
    .input(z.object({ name: z.string() }))
    .output(z.object({ greeting: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.name}`,
      };
    }),

  getAll: publicProcedure
    .meta({
      openapi: {
        method: "GET",
        path: "/posts",
        tags: ["posts"],
        summary: "Get all posts",
        description:
          "Returns all posts ordered by creation date (newest first)",
        protect: false,
      },
    })
    .input(z.void())
    .output(z.array(PostSchema))
    .query(async ({ ctx }) => {
      return await ctx.db.post.findMany({
        orderBy: { createdAt: "desc" },
      });
    }),

  getInfinitePosts: publicProcedure
    .input(
      z.object({
        cursor: z.number().nullish().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { cursor } = input;
      const limit = Number(process.env.POSTS_LIMIT ?? "10");
      const posts = await ctx.db.post.findMany({
        take: limit + 1,
        orderBy: { createdAt: "desc" },
        cursor: cursor ? { id: cursor } : undefined,
      });

      let nextCursor: number | null = null;
      if (posts.length > limit) {
        const nextItem = posts.pop();
        nextCursor = nextItem?.id ?? null;
      }

      return {
        posts,
        nextCursor,
      };
    }),

  create: protectedProcedure
    .meta({
      openapi: {
        method: "POST",
        path: "/posts",
        tags: ["posts"],
        summary: "Create a new post",
        description: "Creates a new post with the provided name",
        protect: true,
      },
    })
    .input(z.object({ name: z.string().min(1) }))
    .output(PostSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.db.post.create({
        data: {
          name: input.name,
          createdBy: { connect: { id: ctx.session.user.id } },
        },
      });
    }),

  getLatest: protectedProcedure
    .meta({
      openapi: {
        method: "GET",
        path: "/posts/latest",
        tags: ["posts"],
        summary: "Get latest post",
        description:
          "Returns the latest post created by the authenticated user",
        protect: true,
      },
    })
    .input(z.void())
    .output(PostSchema.nullable())
    .query(async ({ ctx }) => {
      const post = await ctx.db.post.findFirst({
        orderBy: { createdAt: "desc" },
        where: { createdBy: { id: ctx.session.user.id } },
      });

      return post ?? null;
    }),

  getSecretMessage: protectedProcedure
    .meta({
      openapi: {
        method: "GET",
        path: "/posts/secret",
        tags: ["posts"],
        summary: "Get secret message",
        description: "Returns a secret message for authenticated users",
        protect: true,
      },
    })
    .input(z.void())
    .output(z.string())
    .query(() => {
      return "you can now see this secret message!";
    }),
});
