"use client";

import React from "react";
import { CopilotPopup } from "@copilotkit/react-ui";
import { useCopilotAction } from "@copilotkit/react-core";
import { api } from "~/trpc/react";
import { toast } from "sonner";

const Chatbot = () => {
  const chatMutation = api.ai.chat.useMutation();

  // Simple action for chat - let the router handle everything
  useCopilotAction({
    name: "chat",
    description:
      "Send a message to the AI assistant for help with content creation and blogging",
    parameters: [
      {
        name: "message",
        type: "string",
        description: "The user's message or question",
        required: true,
      },
    ],
    handler: async ({ message }) => {
      try {
        const response = await chatMutation.mutateAsync({
          message,
        });

        return response.response;
      } catch (error) {
        console.error("Error in chat:", error);
        const errorMessage =
          error instanceof Error ? error.message : "Failed to send message";
        toast.error(errorMessage);
        throw error;
      }
    },
  });

  return (
    <CopilotPopup
      labels={{
        title: "Content Assistant",
        initial: "How can I help you with content creation today?",
      }}
    />
  );
};

export default Chatbot;
