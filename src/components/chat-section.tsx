"use client";

import { cn } from "@/lib/utils";
import { experimental_useAssistant as useAssistant } from "ai/react";
import { useCallback, useEffect, useState } from "react";
import { ChatInput, ChatMessages } from "./ui/chat";

export default function ChatSection({
  className,
  flex1,
  assistantId,
  visitorThreadId,
  welcomeMessage,
}: {
  className?: string;
  flex1?: boolean;
  assistantId: string;
  visitorThreadId: string;
  welcomeMessage: string;
}) {
  const [chatHistory, setChatHistory] = useState([]);
  const {
    messages,
    input,
    handleInputChange,
    submitMessage: handleSubmit,
    threadId,
    status,
  } = useAssistant({
    api: "/api/assistant",
  });

  const getChatsHistory = useCallback(async () => {
    const messages = await fetch(
      "/api/chat/history?threadId=" + visitorThreadId
    )
      .then((res) => res.json())
      .then((result) => {
        console.log("result", result);
        // @ts-ignore
        setChatHistory(result?.messages?.data);
      });
    return messages;
  }, [visitorThreadId]);

  useEffect(() => {
    getChatsHistory();
  }, [getChatsHistory]);

  return (
    <div className={cn("space-y-4 max-w-5xl w-full h-full", className)}>
      <ChatMessages
        welcomeMessage={welcomeMessage}
        messages={messages}
        // @ts-ignore
        chatHistory={chatHistory}
        isLoading={status === "in_progress"}
        reload={() => {
          console.log("reload");
        }}
        stop={() => {
          console.log("stop");
        }}
        flex1={flex1}
      />
      <ChatInput
        input={input}
        handleSubmit={handleSubmit}
        handleInputChange={handleInputChange}
        isLoading={status === "in_progress"}
        threadId={visitorThreadId}
        assistantId={assistantId}
      />
    </div>
  );
}
