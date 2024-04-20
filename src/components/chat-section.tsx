"use client";

import { cn } from "@/lib/utils";
import { experimental_useAssistant as useAssistant } from "ai/react";
import { ChatInput, ChatMessages } from "./ui/chat";
import { useEffect } from "react";

export default function ChatSection({ className, flex1, assistantId }: { className?: string, flex1?: boolean, assistantId: string }) {
const {
  messages,
  input,
  handleInputChange,
  submitMessage: handleSubmit,
  threadId,
  status
} = useAssistant({
  api: "/api/assistant",
});

useEffect(() => {
  console.log("threadId", threadId)
},[threadId])


  return (
    <div className={cn("space-y-4 max-w-5xl w-full h-full", className)}>
      <ChatMessages
        messages={messages}
        isLoading={status==="in_progress"}
        reload={()=>{
          console.log("reload")
        }}
        stop={()=>{
          console.log("stop")
        }}
        flex1={flex1}
      />
      <ChatInput
        input={input}
        handleSubmit={handleSubmit}
        handleInputChange={handleInputChange}
        isLoading={status==="in_progress"}
        assistantId={assistantId}
      />
    </div>
  );
}
