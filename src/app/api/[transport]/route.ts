import { createMcpHandler } from "mcp-handler";
import type { NextRequest } from "next/server";
import { z } from "zod";
import { db } from "~/server/db";

/**
 * Schema definitions for MCP tools
 */
const getDataSchema = z.object({
  userName: z
    .string()
    .optional()
    .describe("Filter posts by specific user name"),
});

/**
 * Type inference for tool parameters
 */
type GetDataParams = z.infer<typeof getDataSchema>;

/**
 * Creates an MCP (Model Context Protocol) handler for database operations.
 * This handler provides tools to interact with users and posts in the database.
 */
const handler = createMcpHandler(
  (server) => {
    /**
     * Intelligent data retrieval tool that determines what data the user wants
     */
    server.tool(
      "getDataAboutUsersAndPostsFromDatabase",
      "Retrieve users and posts from the database based on user request",
      getDataSchema.shape,
      async ({ userName }: GetDataParams) => {
        try {
          const results: string[] = [];

          // Fetch users if requested
          const users = await db.user.findMany({
            where: userName ? { name: userName } : undefined,
            select: {
              name: true,
              email: true,
              posts: {
                select: {
                  name: true,
                  createdAt: true,
                },
              },
            },
          });

          const userText = `📊 USERS (${users.length} found):\n\n${users
            .map(
              (user) =>
                `• ${user.name ?? "No name"} (${user.email ?? "No email"})\n Posts: ${
                  user.posts.length > 0
                    ? user.posts
                        .map(
                          (post) =>
                            `"${post.name}" (Created: ${post.createdAt.toLocaleDateString()} ${post.createdAt.toLocaleTimeString()})`,
                        )
                        .join("; ")
                    : "No posts"
                }`,
            )
            .join("\n\n")}`;
          results.push(userText);

          return {
            content: [
              {
                type: "text" as const,
                text: results.join("\n\n" + "=".repeat(50) + "\n\n"),
              },
            ],
          };
        } catch (error) {
          return {
            content: [
              {
                type: "text" as const,
                text: `Error retrieving data: ${error instanceof Error ? error.message : "Unknown error"}`,
              },
            ],
          };
        }
      },
    );
  },
  {
    // Server configuration options
  },
  {
    streamableHttpEndpoint: "/mcp",
    sseEndpoint: "/sse",
    basePath: "/api/",
  },
);

/**
 * Next.js API route handlers for GET and POST requests
 * These handle the MCP transport protocol communication
 */
export const GET = (request: NextRequest) => handler(request);
export const POST = (request: NextRequest) => handler(request);
