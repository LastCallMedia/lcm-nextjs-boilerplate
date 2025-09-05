import { z } from "zod";
import { openai } from "@ai-sdk/openai";
import { generateObject, streamText } from "ai";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

// Schema for post idea generation
const PostIdeaSchema = z.object({
  title: z.string().describe("A compelling title for the blog post"),
  description: z
    .string()
    .describe("A brief description of what the post would cover"),
  tags: z.array(z.string()).describe("Relevant tags for the post"),
  outline: z
    .array(z.string())
    .describe("Key points or sections the post should include"),
});

// Schema for conversation message (for client-side history)
const ConversationMessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string(),
  timestamp: z.date().optional(),
});

// Schema for public chat message input
const ChatMessageSchema = z.object({
  message: z.string().min(1, "Message cannot be empty"),
  conversationHistory: z
    .array(ConversationMessageSchema)
    .optional()
    .describe(
      "Previous conversation messages for context (client-side for anonymous users)",
    ),
  sessionId: z
    .string()
    .optional()
    .describe("Session ID for authenticated users to persist conversation"),
});

// Schema for chat response
const ChatResponseSchema = z.object({
  response: z.string(),
  postIdeas: z.array(PostIdeaSchema).optional(),
  suggestions: z.array(z.string()).optional(),
  sessionId: z.string().optional(),
});

export const aiRouter = createTRPCRouter({
  /**
   * Public chat endpoint that works for both authenticated and anonymous users.
   * - Anonymous users: Uses client-side conversation history
   * - Authenticated users: Can optionally persist conversation in database
   */
  chat: publicProcedure
    .meta({
      openapi: {
        method: "POST",
        path: "/ai/chat",
        tags: ["ai"],
        summary: "Chat with AI assistant",
        description:
          "Send a message to the AI assistant. Works for both anonymous and authenticated users with contextual responses.",
      },
    })
    .input(ChatMessageSchema)
    .output(ChatResponseSchema)
    .mutation(async ({ input, ctx }) => {
      if (!process.env.OPENAI_API_KEY) {
        throw new Error("OpenAI API key is not configured");
      }

      try {
        let conversationContext = "";
        let userContext = "";
        let sessionId = input.sessionId;

        // Build conversation context
        if (input.conversationHistory && input.conversationHistory.length > 0) {
          // Use client-side conversation history (for anonymous or as fallback)
          conversationContext = input.conversationHistory
            .slice(-10) // Last 10 messages for context
            .map((msg) => `${msg.role}: ${msg.content}`)
            .join("\n");
        }

        // If user is authenticated, get additional context and optionally persist
        if (ctx.session?.user?.id) {
          try {
            // Get user's recent posts for personalized context
            const recentPosts = await ctx.db.post.findMany({
              where: { createdById: ctx.session.user.id },
              orderBy: { createdAt: "desc" },
              take: 5,
              select: { name: true, createdAt: true },
            });

            if (recentPosts.length > 0) {
              userContext = `User's recent posts: ${recentPosts.map((p) => p.name).join(", ")}`;
            }

            // Optionally handle database conversation persistence
            if (input.sessionId) {
              // Try to get existing session
              const existingSession = await ctx.db.chatSession.findUnique({
                where: {
                  id: input.sessionId,
                  userId: ctx.session.user.id,
                },
                include: {
                  messages: {
                    orderBy: { createdAt: "asc" },
                    take: 10,
                  },
                },
              });

              if (existingSession && existingSession.messages.length > 0) {
                // Use database conversation history if available
                conversationContext = existingSession.messages
                  .map((msg) => `${msg.role.toLowerCase()}: ${msg.content}`)
                  .join("\n");
              }
            }
          } catch (error) {
            // If database operations fail, continue with client-side history
            console.warn("Database context retrieval failed:", error);
          }
        }

        // Check if the message is asking for post ideas
        const lowerMessage = input.message.toLowerCase();
        const postIdeaKeywords = [
          "post idea",
          "blog idea",
          "content idea",
          "article idea",
          "what should i write",
          "writing ideas",
          "topic ideas",
          "blog topics",
          "post topics",
          "content topics",
          "what to write about",
          "writing suggestions",
          "blog post suggestions",
          "content suggestions",
        ];

        const isPostIdeaRequest = postIdeaKeywords.some((keyword) =>
          lowerMessage.includes(keyword),
        );

        // Build context for AI
        const contextParts = [];
        if (conversationContext) {
          contextParts.push(`Previous conversation:\n${conversationContext}`);
        }
        if (userContext) {
          contextParts.push(userContext);
        }
        const fullContext = contextParts.join("\n\n");

        let response;

        if (isPostIdeaRequest) {
          // Generate structured post ideas
          try {
            const result = await generateObject({
              model: openai("gpt-4o-mini"),
              prompt: `
                User message: ${input.message}
                ${fullContext ? `Context: ${fullContext}` : ""}
                
                Generate 2-3 creative blog post ideas based on the user's request. 
                Consider current trends, practical value, and engaging content.
                Make the ideas specific and actionable.
                ${userContext ? "Consider the user's previous posts to avoid repetition and suggest complementary topics." : ""}
                
                Please provide:
                1. A helpful response message to the user
                2. 2-3 detailed post ideas with titles, descriptions, tags, and outlines
                3. Additional suggestions or tips
              `,
              schema: z.object({
                response: z
                  .string()
                  .describe(
                    "A helpful response message to the user explaining the post ideas",
                  ),
                postIdeas: z
                  .array(PostIdeaSchema)
                  .describe("Generated post ideas"),
                suggestions: z
                  .array(z.string())
                  .describe("Additional suggestions or tips"),
              }),
            });

            response = result.object;
          } catch (error) {
            console.error("Error generating structured post ideas:", error);
            // Fallback to regular chat response if structured generation fails
            const fallbackResult = await streamText({
              model: openai("gpt-4o-mini"),
              prompt: `
                User message: ${input.message}
                ${fullContext ? `Context: ${fullContext}` : ""}
                
                The user is asking for post ideas. Provide helpful suggestions for blog post topics with brief descriptions.
                Be creative and specific in your recommendations.
                ${userContext ? "Consider their previous posts to avoid repetition and suggest complementary topics." : ""}
              `,
            });

            const responseText = await fallbackResult.text;
            response = {
              response: responseText,
            };
          }
        } else {
          // Regular chat response using streamText
          const result = await streamText({
            model: openai("gpt-4o-mini"),
            prompt: `
              User message: ${input.message}
              ${fullContext ? `Context: ${fullContext}` : ""}
              
              You are a helpful assistant that specializes in content creation and blogging.
              Provide a helpful, friendly response to the user's message.
              If they seem interested in content creation, offer to help generate post ideas.
              ${userContext ? "Use knowledge of their previous posts to provide personalized advice." : ""}
            `,
          });

          // Convert stream to text for the response
          const responseText = await result.text;

          response = {
            response: responseText,
          };
        }

        // Persist conversation for authenticated users with sessionId
        if (ctx.session?.user?.id && input.sessionId) {
          try {
            // Store the user message and AI response
            await ctx.db.chatMessage.createMany({
              data: [
                {
                  sessionId: input.sessionId,
                  role: "USER",
                  content: input.message,
                },
                {
                  sessionId: input.sessionId,
                  role: "ASSISTANT",
                  content: response.response,
                },
              ],
            });
          } catch (error) {
            // Continue if persistence fails
            console.warn("Message persistence failed:", error);
          }
        }

        return {
          ...response,
          sessionId,
        };
      } catch (error) {
        console.error("AI chat error:", error);

        // Provide more specific error messages based on error type
        if (error instanceof Error) {
          if (error.message.includes("API key")) {
            throw new Error("AI service is not properly configured");
          }
          if (error.message.includes("quota")) {
            throw new Error(
              "AI service quota exceeded. Please try again later",
            );
          }
          if (error.message.includes("timeout")) {
            throw new Error("AI service timeout. Please try again");
          }
        }

        throw new Error("Failed to generate AI response");
      }
    }),

  /**
   * Create a new chat session for authenticated users
   */
  createChatSession: protectedProcedure
    .input(
      z.object({
        title: z.string().optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const session = await ctx.db.chatSession.create({
        data: {
          userId: ctx.session.user.id,
          title: input.title || "New Conversation",
        },
      });

      return session;
    }),

  /**
   * Get chat sessions for authenticated users
   */
  getChatSessions: protectedProcedure.query(async ({ ctx }) => {
    const sessions = await ctx.db.chatSession.findMany({
      where: { userId: ctx.session.user.id },
      orderBy: { updatedAt: "desc" },
      include: {
        messages: {
          take: 1,
          orderBy: { createdAt: "desc" },
        },
      },
    });

    return sessions;
  }),

  /**
   * Get chat history for a specific session
   */
  getChatHistory: protectedProcedure
    .input(
      z.object({
        sessionId: z.string(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const session = await ctx.db.chatSession.findUnique({
        where: {
          id: input.sessionId,
          userId: ctx.session.user.id,
        },
        include: {
          messages: {
            orderBy: { createdAt: "asc" },
          },
        },
      });

      if (!session) {
        throw new Error("Session not found");
      }

      return session;
    }),
});

export type AIRouter = typeof aiRouter;
