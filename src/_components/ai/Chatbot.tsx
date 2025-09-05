"use client";

import React, { useState } from "react";
import { CopilotPopup } from "@copilotkit/react-ui";
import { api } from "~/trpc/react";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

interface ConversationMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const Chatbot = () => {
  const { data: session } = useSession();
  const [conversationHistory, setConversationHistory] = useState<
    ConversationMessage[]
  >([]);
  const [sessionId, setSessionId] = useState<string | undefined>();

  const chatMutation = api.ai.chat.useMutation();
  const createSessionMutation = api.ai.createChatSession.useMutation();

  // Create a session for authenticated users when they first start chatting
  const initializeSession = async () => {
    if (session?.user && !sessionId) {
      try {
        const newSession = await createSessionMutation.mutateAsync({
          title: "New Conversation",
        });
        setSessionId(newSession.id);
      } catch (error) {
        // Continue without session if creation fails
        console.warn("Failed to create chat session:", error);
      }
    }
  };

  const onSubmitMessage = async (message: string) => {
    try {
      // Initialize session for authenticated users if needed
      await initializeSession();

      // Add user message to history
      const userMessage: ConversationMessage = {
        role: "user",
        content: message,
        timestamp: new Date(),
      };

      const updatedHistory = [...conversationHistory, userMessage];
      setConversationHistory(updatedHistory);

      // Send message to AI
      const response = await chatMutation.mutateAsync({
        message,
        conversationHistory: updatedHistory,
        sessionId: session?.user ? sessionId : undefined,
      });

      // Add AI response to history
      const aiMessage: ConversationMessage = {
        role: "assistant",
        content: response.response,
        timestamp: new Date(),
      };

      setConversationHistory([...updatedHistory, aiMessage]);

      // Update sessionId if returned (for new sessions)
      if (response.sessionId && !sessionId) {
        setSessionId(response.sessionId);
      }
    } catch (error) {
      console.error("Error in onSubmitMessage:", error);

      // Provide more specific error messages
      const errorMessage =
        error instanceof Error ? error.message : "Failed to send message";

      toast.error(errorMessage);

      // Remove the user message from history if the AI response failed
      setConversationHistory(conversationHistory);

      throw error;
    }
  };

  return (
    <CopilotPopup
      instructions={
        session?.user
          ? "You are a helpful assistant specializing in content creation and blogging. You have access to the user's previous posts and conversation history to provide personalized suggestions. Help users generate creative post ideas and provide guidance on content strategy."
          : "You are a helpful assistant specializing in content creation and blogging. Help users generate creative post ideas and provide guidance on content strategy. When users ask for post ideas, provide specific, actionable suggestions with titles, descriptions, and key points."
      }
      labels={{
        title: "Content Assistant",
        initial: session?.user
          ? "Need help with personalized post ideas?"
          : "Need help with post ideas?",
      }}
      onSubmitMessage={onSubmitMessage}
    />
  );
};

export default Chatbot;
