/*
 * ESLint disable is necessary here because:
 * 1. T3 stack's strict TypeScript config conflicts with Prisma's generated types
 * 2. The ctx.db is properly typed at runtime but TypeScript can't infer it
 * 3. This is the recommended pattern in T3 stack documentation
 * 4. Alternative approaches (like DatabaseContext interface) are verbose and don't solve the root cause
 */
/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return */

import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

// Define the expected return type for terms page
type TermsPageResponse = {
  id: string;
  title: string;
  content: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdById: string;
} | null;

type TermsPageWithUser = {
  id: string;
  title: string;
  content: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdById: string;
  createdBy: {
    name: string | null;
    email: string | null;
  };
};

type TermsPageListResponse = {
  termsPages: TermsPageWithUser[];
  nextCursor: string | undefined;
};

export const termsRouter = createTRPCRouter({
  // Get the active terms page (public)
  getActive: publicProcedure.query(
    async ({ ctx }): Promise<TermsPageResponse> => {
      const termsPage = await ctx.db.termsPage.findFirst({
        where: { isActive: true },
        orderBy: { updatedAt: "desc" },
      });

      return termsPage;
    },
  ),

  // Get all terms pages (admin only)
  getAll: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(50),
        cursor: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }): Promise<TermsPageListResponse> => {
      // Check if user is admin
      if (ctx.session.user.role !== "ADMIN") {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Admin access required",
        });
      }

      const termsPages = await ctx.db.termsPage.findMany({
        take: input.limit + 1,
        cursor: input.cursor ? { id: input.cursor } : undefined,
        orderBy: { updatedAt: "desc" },
        include: {
          createdBy: {
            select: { name: true, email: true },
          },
        },
      });

      let nextCursor: typeof input.cursor | undefined = undefined;
      if (termsPages.length > input.limit) {
        const nextItem = termsPages.pop()!;
        nextCursor = nextItem.id;
      }

      return {
        termsPages,
        nextCursor,
      };
    }),

  // Create or update terms page (admin only)
  upsert: protectedProcedure
    .input(
      z.object({
        id: z.string().optional(),
        title: z.string().min(1, "Title is required"),
        content: z.string().min(1, "Content is required"),
        isActive: z.boolean().default(true),
      }),
    )
    .mutation(async ({ ctx, input }): Promise<TermsPageWithUser> => {
      // Check if user is admin
      if (ctx.session.user.role !== "ADMIN") {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Admin access required",
        });
      }

      // If creating a new active terms page, deactivate all others
      if (input.isActive) {
        await ctx.db.termsPage.updateMany({
          where: { isActive: true },
          data: { isActive: false },
        });
      }

      // Create or update the terms page
      const termsPage = await ctx.db.termsPage.upsert({
        where: { id: input.id ?? "" },
        create: {
          title: input.title,
          content: input.content,
          isActive: input.isActive,
          createdById: ctx.session.user.id,
        },
        update: {
          title: input.title,
          content: input.content,
          isActive: input.isActive,
        },
        include: {
          createdBy: {
            select: { name: true, email: true },
          },
        },
      });

      return termsPage;
    }),

  // Delete terms page (admin only)
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }): Promise<{ success: boolean }> => {
      // Check if user is admin
      if (ctx.session.user.role !== "ADMIN") {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Admin access required",
        });
      }

      await ctx.db.termsPage.delete({
        where: { id: input.id },
      });

      return { success: true };
    }),
});
