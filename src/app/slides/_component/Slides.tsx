import { ChatInput, ChatMessages } from "@/components/ui/chat";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { cn } from "@/lib/utils";
import {
  AssistantStatus,
  experimental_useAssistant as useAssistant,
} from "ai/react";
import { LoaderCircle } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

function Slides({ data }: { data: any }) {
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

  return (
    <>
    {/* For Desktop View */}
      <div className="hidden md:flex h-[100vh] w-full ">
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel defaultSize={75}>
            <GoogleSLides data={data} messages={messages} />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={25}>
            <ChatBot
              data={data}
              input={input}
              handleInputChange={handleInputChange}
              handleSubmit={handleSubmit}
              status={status}
              threadId={threadId}
              messages={messages}
            />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>

      {/*For Mobile View */}
      <div className=" md:hidden h-[100vh] w-full ">
        <GoogleSLides data={data} messages={messages} />
        <ChatBot
          data={data}
          input={input}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          status={status}
          threadId={threadId}
          messages={messages}
        />
      </div>
    </>
  );
}
export default Slides;

export const GoogleSLides = ({
  data,
  messages,
}: {
  data: { slideUrl: string };
  messages: any;
}) => {
  const [slideNumber, setSlideNumber] = useState<number | undefined>(undefined);

  const updateSlide = useCallback(() => {
    const iframe = document.getElementById(
      "googleSlideIframe"
    ) as HTMLIFrameElement;
    if (iframe && slideNumber !== null) {
      const baseIframeSrc =
        data?.slideUrl.toString().split("/edit")[0] +
        "/embed?start=false&loop=false&delayms=3000";
      iframe.src = `${baseIframeSrc}&slide=${slideNumber}`;
    }
  }, [data?.slideUrl, slideNumber]);

  useEffect(() => {
    const slideContent = messages[messages.length - 1]?.content;
    if (slideContent) {
      const match = slideContent.match(/["']?slideNumber["']?: (\d+)/);

      if (match && match[1]) {
        setSlideNumber(parseInt(match[1]));
      }
    }
  }, [messages]);

  useEffect(() => {
    updateSlide();
  }, [updateSlide, slideNumber]);
  return (
    <div className={cn("h-full relative ease-in-out duration-700")}>
      {!data?.slideUrl ? (
        <LoaderCircle className="mx-auto flex h-screen justify-center  animate-spin" />
      ) : (
        <iframe
          id="googleSlideIframe"
          className="w-full h-full"
          // src="https://docs.google.com/presentation/d/e/2PACX-1vSOwXWZZMSVJ3Lk03_mz7pFlpMDuf1FRBxPAbUsvS_hVvzmlk-uz2vI78avvBairfM2vdBLbrEnr5yX/embed?start=false&loop=false&delayms=3000"
          src={
            data?.slideUrl.toString().split("/edit")[0] +
            "/embed?start=false&loop=false&delayms=3000"
          }
          allowFullScreen={true}
        ></iframe>
      )}
    </div>
  );
};

export const ChatBot = (props: {
  data: { assistantId: string };
  input: string;
  handleInputChange: any;
  handleSubmit: any;
  status: AssistantStatus;
  threadId: string | undefined;
  messages: any;
}) => {
  return (
    <div
      className={cn(
        "flex my-6 md:my-0 flex-col shadow-md justify-between bg-[#f7f4f4d1] ease-in-out duration-700"
        // open === true ? "md:w-2/4 lg:w-2/6 p-4 xl:w-1/4" : "w-0"
      )}
    >
      <div className="overflow-y-auto h-full">
        <div className="flex flex-col justify-between gap-6 h-screen">
          <ChatMessages
            from="slides"
            welcomeMessage={"Hi , how can i help you ?"}
            messages={props.messages}
            isLoading={props.status === "in_progress"}
            reload={() => {
              console.log("reload");
            }}
            stop={() => {
              console.log("stop");
            }}
          />
          <ChatInput
            input={props.input}
            handleSubmit={props.handleSubmit}
            handleInputChange={props.handleInputChange}
            isLoading={props.status === "in_progress"}
            threadId={props.threadId ? props.threadId : ""}
            assistantId={props.data?.assistantId}
            sendSlideNumber={true}
          />
        </div>
      </div>
    </div>
  );
};
