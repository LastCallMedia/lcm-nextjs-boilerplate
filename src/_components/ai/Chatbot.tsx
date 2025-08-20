"use client";

import React from "react";
import { CopilotPopup } from "@copilotkit/react-ui";
import { api } from "~/trpc/react";

const Chatbot = () => {
  const chatMutation = api.ai.chat.useMutation();

  const onSubmitMessage = async (message: string): Promise<void> => {
    try {
      const response = await chatMutation.mutateAsync({
        message,
        context: undefined,
      });

      if (response.postIdeas && response.postIdeas.length > 0) {
        console.log("Generated post ideas:", response.postIdeas);
      }
      console.log("AI Response:", response.response);
    } catch (error) {
      console.error("Failed to send message:", error);
      throw error;
    }
  };

  return (
    <CopilotPopup
      instructions={
        "You are a helpful assistant specializing in content creation and blogging. Help users generate creative post ideas and provide guidance on content strategy. When users ask for post ideas, provide specific, actionable suggestions with titles, descriptions, and key points."
      }
      labels={{
        title: "Content Assistant",
        initial: "Need help with post ideas?",
      }}
      onSubmitMessage={onSubmitMessage}
    />
  );
};

export default Chatbot;
