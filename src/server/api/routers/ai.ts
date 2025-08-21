import { z } from "zod";
import { openai } from "@ai-sdk/openai";
import { generateObject, streamText } from "ai";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

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

// Schema for chat message input
const ChatMessageSchema = z.object({
  message: z.string().min(1, "Message cannot be empty"),
  context: z
    .string()
    .optional()
    .describe("Additional context about the user or their needs"),
});

// Schema for chat response (for post ideas)
const ChatResponseSchema = z.object({
  response: z.string(),
  postIdeas: z.array(PostIdeaSchema).optional(),
  suggestions: z.array(z.string()).optional(),
});

export const aiRouter = createTRPCRouter({
  /**
   * Generate a chat response using structured output for post ideas or streaming text for general chat
   */
  chat: publicProcedure
    .meta({
      openapi: {
        method: "POST",
        path: "/ai/chat",
        tags: ["ai"],
        summary: "Chat with AI assistant",
        description:
          "Send a message to the AI assistant. Uses structured output (generateObject) for post idea requests, and streaming text (streamText) for general chat",
      },
    })
    .input(ChatMessageSchema)
    .output(ChatResponseSchema)
    .mutation(async ({ input }) => {
      if (!process.env.OPENAI_API_KEY) {
        throw new Error("OpenAI API key is not configured");
      }

      try {
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

        if (isPostIdeaRequest) {
          // Generate structured post ideas
          const result = await generateObject({
            model: openai("gpt-4o-mini"),
            prompt: `
              User message: ${input.message}
              ${input.context ? `Context: ${input.context}` : ""}
              
              Generate 2-3 creative blog post ideas based on the user's request. 
              Consider current trends, practical value, and engaging content.
              Make the ideas specific and actionable.
            `,
            schema: z.object({
              response: z.string().describe("A helpful response to the user"),
              postIdeas: z
                .array(PostIdeaSchema)
                .describe("Generated post ideas"),
              suggestions: z
                .array(z.string())
                .describe("Additional suggestions or tips"),
            }),
          });

          return result.object;
        } else {
          // Regular chat response using streamText
          const result = await streamText({
            model: openai("gpt-4o-mini"),
            prompt: `
              User message: ${input.message}
              ${input.context ? `Context: ${input.context}` : ""}
              
              You are a helpful assistant that specializes in content creation and blogging.
              Provide a helpful, friendly response to the user's message.
              If they seem interested in content creation, offer to help generate post ideas.
            `,
          });

          // Convert stream to text for the response
          const responseText = await result.text;

          return {
            response: responseText,
          };
        }
      } catch (error) {
        console.error("AI chat error:", error);
        throw new Error("Failed to generate AI response");
      }
    }),
});

export type AIRouter = typeof aiRouter;
