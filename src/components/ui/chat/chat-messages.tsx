import { Loader2 } from "lucide-react";
import { useEffect, useRef } from "react";

import { cn } from "@/lib/utils";
import ChatActions from "./chat-actions";
import ChatMessage from "./chat-message";
import { ChatHandler } from "./chat.interface";

export default function ChatMessages(
  props: Pick<ChatHandler, "messages" | "isLoading" | "reload" | "stop"> & {
    flex1?: boolean;
    chatHistory?: any;
    welcomeMessage: string;
    from?: "slides" | undefined;
  }
) {
  const scrollableChatContainerRef = useRef<HTMLDivElement>(null);
  const messageLength = props.messages.length;
  const lastMessage = props.messages[messageLength - 1];

  const scrollToBottom = () => {
    if (scrollableChatContainerRef.current) {
      scrollableChatContainerRef.current.scrollTop =
        scrollableChatContainerRef.current.scrollHeight;
    }
  };

  const isLastMessageFromAssistant =
    messageLength > 0 && lastMessage?.role !== "user";
  const showReload =
    props.reload && !props.isLoading && isLastMessageFromAssistant;
  const showStop = props.stop && props.isLoading;

  // `isPending` indicate
  // that stream response is not yet received from the server,
  // so we show a loading indicator to give a better UX.
  const isPending = props.isLoading && !isLastMessageFromAssistant;

  useEffect(() => {
    scrollToBottom();
  }, [messageLength, lastMessage]);

  // const reversedChats = props?.newMessages?.toReversed();

  return (
    <div
      className={cn("w-full rounded-xl bg-white p-4 shadow-xl pb-0", {
        "flex-1": props.flex1,
        "h-full": props.from === "slides",
      })}
    >
      <div
        className={cn(
          "flex h-[50vh] flex-col gap-5 divide-y overflow-y-auto pb-4 ",
          {
            "overflow-y-auto flex-grow h-[75vh] no-scrollbar": props.from === "slides",
          }
        )}
        ref={scrollableChatContainerRef}
      >
        {props?.welcomeMessage ? (
          <ChatMessage
            role="assistant"
            id="welcome"
            content={props.welcomeMessage}
          />
        ) : null}
        {props?.chatHistory?.map((m: any) =>
          m?.content?.map((messages: any) => {
            return (
              <ChatMessage key={m.id} {...m} content={messages.text.value} />
            );
          })
        )}
        {props?.messages.map((m) => (
          <ChatMessage key={m.id} {...m} />
        ))}
        {isPending && (
          <div className="flex justify-center items-center pt-10">
            <Loader2 className="h-4 w-4 animate-spin" />
          </div>
        )}
      </div>
      <div className="flex justify-end py-4">
        <ChatActions
          reload={props.reload}
          stop={props.stop}
          showReload={false}
          showStop={false}
        />
      </div>
    </div>
  );
}
