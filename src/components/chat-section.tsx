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
  const [chatHistory, setChatHistory] = useState<any>([]);
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
    const res = await fetch("/api/chat/history?threadId=" + visitorThreadId);
    if (!res.ok) {
      throw new Error("Failed to fetch chat history");
    }
    const result = (await res.json()) as { messages: { data: any[] } };
    setChatHistory(result?.messages?.data);
  }, [visitorThreadId]);

  useEffect(() => {
    getChatsHistory();
  }, [getChatsHistory]);

  return (
    <div className={cn("space-y-4 max-w-5xl w-full h-full", className)}>
      <ChatMessages
        welcomeMessage={welcomeMessage}
        messages={messages}
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
