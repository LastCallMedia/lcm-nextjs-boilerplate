import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

// Add enum for user sort fields
const userSortFields = z.enum([
  "id",
  "name",
  "email",
  "role",
  "createdAt",
  "updatedAt",
  "emailVerified",
]);

// Add enum for post sort fields
const postSortFields = z.enum(["id", "name", "createdAt", "updatedAt"]);

// Admin-only procedure that checks user role
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.session.user.role !== "ADMIN") {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Admin access required",
    });
  }
  return next();
});

// Authenticated-only procedure (not admin-only)
const authenticatedProcedure = protectedProcedure;

export const adminRouter = createTRPCRouter({
  // Get current user's language
  getUserLanguage: authenticatedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;
    const user = await ctx.db.user.findUnique({
      where: { id: userId },
      select: { language: true },
    });
    let language = "en";
    if (user && typeof user.language === "string") {
      language = user.language;
    }
    return { language };
  }),
  // Update user language preference
  updateUserLanguage: authenticatedProcedure
    .input(
      z.object({
        language: z.string().min(2).max(5),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { language } = input;
      const userId = ctx.session.user.id;
      try {
        const user = await ctx.db.user.update({
          where: { id: userId },
          data: { language },
          select: {
            id: true,
            language: true,
          },
        });
        return user;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update user language",
          cause: error,
        });
      }
    }),
  // Get all users with pagination, sorting, and filtering
  getUsers: authenticatedProcedure
    .input(
      z.object({
        page: z.number().min(1).default(1),
        pageSize: z.number().min(1).max(100).default(10),
        sortBy: userSortFields.default("createdAt"),
        sortOrder: z.enum(["asc", "desc"]).default("desc"),
        search: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { page, pageSize, sortBy, sortOrder, search } = input;
      const skip = (page - 1) * pageSize;

      // Build where clause for search
      const where = search
        ? {
            OR: [
              { name: { contains: search, mode: "insensitive" as const } },
              { email: { contains: search, mode: "insensitive" as const } },
            ],
          }
        : {};

      // Get total count for pagination
      const totalCount = await ctx.db.user.count({ where });

      // Get users with pagination and sorting
      const users = await ctx.db.user.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { [sortBy]: sortOrder },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          emailVerified: true,
          image: true,
          _count: {
            select: {
              posts: true,
              sessions: true,
            },
          },
        },
      });

      return {
        users,
        pagination: {
          page,
          pageSize,
          totalCount,
          totalPages: Math.ceil(totalCount / pageSize),
        },
      };
    }),

  // Get all posts with user information, pagination, sorting, and filtering
  getPosts: authenticatedProcedure
    .input(
      z.object({
        page: z.number().min(1).default(1),
        pageSize: z.number().min(1).max(100).default(10),
        sortBy: postSortFields.default("createdAt"),
        sortOrder: z.enum(["asc", "desc"]).default("desc"),
        search: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { page, pageSize, sortBy, sortOrder, search } = input;
      const skip = (page - 1) * pageSize;

      // Build where clause for search
      const where = search
        ? {
            OR: [
              { name: { contains: search, mode: "insensitive" as const } },
              {
                createdBy: {
                  OR: [
                    {
                      name: { contains: search, mode: "insensitive" as const },
                    },
                    {
                      email: { contains: search, mode: "insensitive" as const },
                    },
                  ],
                },
              },
            ],
          }
        : {};

      // Get total count for pagination
      const totalCount = await ctx.db.post.count({ where });

      // Get posts with user information
      const posts = await ctx.db.post.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { [sortBy]: sortOrder },
        include: {
          createdBy: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
        },
      });

      return {
        posts,
        pagination: {
          page,
          pageSize,
          totalCount,
          totalPages: Math.ceil(totalCount / pageSize),
        },
      };
    }),

  // Get dashboard statistics
  getStats: authenticatedProcedure.query(async ({ ctx }) => {
    const [userCount, postCount, adminCount, recentUsers] = await Promise.all([
      ctx.db.user.count(),
      ctx.db.post.count(),
      ctx.db.user.count({ where: { role: "ADMIN" } }),
      ctx.db.user.findMany({
        take: 3,
        orderBy: { emailVerified: "desc" },
        select: {
          id: true,
          name: true,
          email: true,
          emailVerified: true,
          role: true,
        },
      }),
    ]);

    return {
      userCount,
      postCount,
      adminCount,
      recentUsers,
    };
  }),

  // Update user role
  updateUserRole: adminProcedure
    .input(
      z.object({
        userId: z.string(),
        role: z.enum(["USER", "ADMIN"]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, role } = input;

      // Prevent self-demotion
      if (userId === ctx.session.user.id && role === "USER") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "Cannot demote your own account. Ask another admin to change your role.",
        });
      }

      // Prevent demoting the last admin
      if (role === "USER") {
        const targetUser = await ctx.db.user.findUnique({
          where: { id: userId },
          select: { role: true },
        });

        if (targetUser?.role === "ADMIN") {
          const adminCount = await ctx.db.user.count({
            where: { role: "ADMIN" },
          });

          if (adminCount <= 1) {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: "Cannot demote the last admin user",
            });
          }
        }
      }

      try {
        return await ctx.db.user.update({
          where: { id: userId },
          data: { role },
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        });
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update user role",
          cause: error,
        });
      }
    }),

  // Delete user (admin only, with restrictions)
  deleteUser: adminProcedure
    .input(
      z.object({
        userId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { userId } = input;

      // Prevent deleting self
      if (userId === ctx.session.user.id) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Cannot delete your own account",
        });
      }

      // Prevent deleting the last admin
      const targetUser = await ctx.db.user.findUnique({
        where: { id: userId },
        select: { role: true },
      });

      if (targetUser?.role === "ADMIN") {
        const adminCount = await ctx.db.user.count({
          where: { role: "ADMIN" },
        });

        if (adminCount <= 1) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Cannot delete the last admin user",
          });
        }
      }

      try {
        // Delete user - cascading deletion will handle posts automatically
        return await ctx.db.user.delete({
          where: { id: userId },
        });
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete user and associated data",
          cause: error,
        });
      }
    }),
});
