"use client";

import React from "react";
import { CopilotPopup } from "@copilotkit/react-ui";
import { api } from "~/trpc/react";
import { toast } from "sonner";

const Chatbot = () => {
  const chatMutation = api.ai.chat.useMutation();

  const onSubmitMessage = async (message: string) => {
    try {
      await chatMutation.mutateAsync({
        message,
        context: undefined,
      });
    } catch (error) {
      toast.error("Failed to send message");
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
