/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { db } from "~/server/db";
import { mkdir, writeFile } from "fs/promises";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { env } from "~/env";
import path from "path";
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

  updateProfileImage: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        email: z.string().email(),
        avatar: z
          .object({
            name: z.string(),
            type: z.string(),
            data: z.string(), // base64 string
          })
          .optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      let imageUrl = ctx.session.user.image;

      if (input.avatar) {
        if (!input.avatar.type.startsWith("image/")) {
          throw new Error("Invalid file type");
        }

        // Estimate size from base64 string
        const size = Math.ceil((input.avatar.data.length * 3) / 4);
        if (size > 2 * 1024 * 1024) {
          throw new Error("File too large (max 2MB)");
        }

        const buffer = Buffer.from(input.avatar.data, "base64");

        // Single file extension validation for both environments
        const allowedExtensions = ["jpg", "jpeg", "png", "gif", "webp"];
        const ext = input.avatar.type.split("/")[1]?.toLowerCase();
        if (!ext || !allowedExtensions.includes(ext)) {
          throw new Error(
            "Invalid file type. Allowed: jpg, jpeg, png, gif, webp",
          );
        }

        const fileName = `${ctx.session.user.id}_${Date.now()}.${ext}`;

        if (env.NODE_ENV === "production") {
          // Validate required environment variables
          if (
            !env.AWS_REGION ||
            !env.AWS_ACCESS_KEY_ID ||
            !env.AWS_SECRET_ACCESS_KEY ||
            !env.AWS_BUCKET_NAME
          ) {
            throw new Error("Missing required AWS environment variables");
          }

          // Upload to S3 with proper error handling
          try {
            const s3 = new S3Client({
              region: env.AWS_REGION,
              credentials: {
                accessKeyId: env.AWS_ACCESS_KEY_ID,
                secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
              },
            });

            const command = new PutObjectCommand({
              Bucket: env.AWS_BUCKET_NAME,
              Key: fileName,
              Body: buffer,
              ContentType: input.avatar.type,
              ACL: "public-read",
            });

            await s3.send(command);
            imageUrl = `https://${env.AWS_BUCKET_NAME}.s3.amazonaws.com/${fileName}`;
          } catch (error) {
            console.error("S3 upload failed:", error);
            if (error instanceof Error) {
              throw new Error(`Failed to upload image: ${error.message}`);
            }
            throw new Error("Failed to upload image to S3");
          }
        } else {
          // Local storage for development
          const filePath = path.join(
            process.cwd(),
            "public",
            "uploads",
            fileName,
          );

          try {
            const uploadsDir = path.join(process.cwd(), "public", "uploads");
            await mkdir(uploadsDir, { recursive: true }); // Ensure directory exists
            await writeFile(filePath, buffer);
            imageUrl = `/uploads/${fileName}`;
          } catch (error) {
            console.error("File write failed:", error);
            throw new Error("Failed to save image locally");
          }
        }
      }

      await db.user.update({
        where: { id: ctx.session.user.id },
        data: {
          name: input.name,
          email: input.email,
          image: imageUrl,
        },
      });

      return { success: true, image: imageUrl };
    }),
});
