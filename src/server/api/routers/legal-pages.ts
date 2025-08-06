/*
 * ESLint disable is necessary here because:
 * 1. T3 stack's strict TypeScript config conflicts with Prisma's generated types
 * 2. The ctx.db is properly typed at runtime but TypeScript can't infer it
 * 3. This is the recommended pattern in T3 stack documentation
 * 4. Alternative approaches (like custom interfaces) are verbose and don't solve the root cause
 */
/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return */

import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

// Define the expected return type for legal page
type LegalPageResponse = {
  id: string;
  type: "TERMS" | "PRIVACY" | "COOKIES";
  title: string;
  content: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdById: string;
} | null;

type LegalPageWithUser = {
  id: string;
  type: "TERMS" | "PRIVACY" | "COOKIES";
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

type LegalPageListResponse = {
  legalPages: LegalPageWithUser[];
  nextCursor: string | undefined;
};

// Zod enum for legal page types
const LegalPageTypeEnum = z.enum(["TERMS", "PRIVACY", "COOKIES"]);

export const legalPagesRouter = createTRPCRouter({
  // Get the active legal page by type (public)
  getActive: publicProcedure
    .input(z.object({ type: LegalPageTypeEnum }))
    .query(async ({ ctx, input }): Promise<LegalPageResponse> => {
      const legalPage = await ctx.db.legalPage.findFirst({
        where: {
          type: input.type,
          isActive: true,
        },
        orderBy: { updatedAt: "desc" },
      });

      return legalPage;
    }),

  // Get all legal pages (admin only)
  getAll: protectedProcedure
    .input(
      z.object({
        type: LegalPageTypeEnum.optional(), // Filter by type, or get all if not specified
        limit: z.number().min(1).max(100).default(50),
        cursor: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }): Promise<LegalPageListResponse> => {
      // Check if user is admin
      if (ctx.session.user.role !== "ADMIN") {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Admin access required",
        });
      }

      const whereClause = input.type ? { type: input.type } : {};

      const legalPages = await ctx.db.legalPage.findMany({
        take: input.limit + 1,
        cursor: input.cursor ? { id: input.cursor } : undefined,
        where: whereClause,
        orderBy: { updatedAt: "desc" },
        include: {
          createdBy: {
            select: { name: true, email: true },
          },
        },
      });

      let nextCursor: typeof input.cursor | undefined = undefined;
      if (legalPages.length > input.limit) {
        const nextItem = legalPages.pop()!;
        nextCursor = nextItem.id;
      }

      return {
        legalPages,
        nextCursor,
      };
    }),

  // Create or update legal page (admin only)
  upsert: protectedProcedure
    .input(
      z.object({
        id: z.string().optional(),
        type: LegalPageTypeEnum,
        title: z.string().min(1, "Title is required"),
        content: z.string().min(1, "Content is required"),
        isActive: z.boolean().default(true),
      }),
    )
    .mutation(async ({ ctx, input }): Promise<LegalPageWithUser> => {
      // Check if user is admin
      if (ctx.session.user.role !== "ADMIN") {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Admin access required",
        });
      }

      // If creating a new active legal page, deactivate all others of the same type
      if (input.isActive) {
        await ctx.db.legalPage.updateMany({
          where: {
            type: input.type,
            isActive: true,
          },
          data: { isActive: false },
        });
      }

      // Create or update the legal page
      let legalPage;

      if (input.id) {
        // Update existing legal page
        legalPage = await ctx.db.legalPage.update({
          where: { id: input.id },
          data: {
            type: input.type,
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
      } else {
        // Create new legal page
        legalPage = await ctx.db.legalPage.create({
          data: {
            type: input.type,
            title: input.title,
            content: input.content,
            isActive: input.isActive,
            createdById: ctx.session.user.id,
          },
          include: {
            createdBy: {
              select: { name: true, email: true },
            },
          },
        });
      }

      return legalPage;
    }),

  // Delete legal page (admin only)
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

      await ctx.db.legalPage.delete({
        where: { id: input.id },
      });

      return { success: true };
    }),
});
