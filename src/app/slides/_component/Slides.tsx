import { ChatInput, ChatMessages } from "@/components/ui/chat";
import { cn } from "@/lib/utils";
import { experimental_useAssistant as useAssistant } from "ai/react";
import {
  LoaderCircle,
  SquareChevronLeft,
  SquareChevronRight,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";

function Slides({ data }: { data: any }) {
  const [open, setOpen] = useState(true);
  const [slideNumber, setSlideNumber] = useState<number|undefined>(undefined);

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

  const toggleChatBox = useCallback(() => {
    setOpen((prev) => !prev);
  }, [setOpen]);

  const updateSlide = useCallback(() => {
    const iframe = document.getElementById("googleSlideIframe") as HTMLIFrameElement;
    if (iframe && slideNumber !== null) {
      const baseIframeSrc =
        data?.slideUrl + "/embed?start=false&loop=false&delayms=3000";
      iframe.src = `${baseIframeSrc}&slide=${slideNumber}`;
    }
  }, [data?.slideUrl, slideNumber]);
  
  useEffect(()=>{
    const slideContent = messages[messages.length - 1]?.content;
    if (slideContent) {
      const match = slideContent.match(/["']?slideNumber["']?: (\d+)/);
      
      if (match && match[1]) {
        setSlideNumber(parseInt(match[1]));
      }
    }
  },[messages])
    

  useEffect(() => {
    updateSlide();
  }, [updateSlide, slideNumber]);

  return (
    <div className="md:flex h-[100vh] w-full">
      <div
        className={cn(
          "h-full relative ease-in-out duration-700",
          open === true ? "md:w-2/4 lg:w-4/6 xl:w-3/4" : "w-full"
        )}
      >
        {!data?.slideUrl ? (
          <LoaderCircle className="mx-auto flex h-screen justify-center  animate-spin" />
        ) : (
          <iframe
            id="googleSlideIframe"
            className="w-full h-full"
            // src="https://docs.google.com/presentation/d/e/2PACX-1vSOwXWZZMSVJ3Lk03_mz7pFlpMDuf1FRBxPAbUsvS_hVvzmlk-uz2vI78avvBairfM2vdBLbrEnr5yX/embed?start=false&loop=false&delayms=3000"
            src={data?.slideUrl.toString().split("edit")[0] + "/embed?start=false&loop=false&delayms=3000"}
            allowFullScreen={true}
          ></iframe>
        )}
        <button
          className="absolute top-2 right-2 text-xl"
          onClick={toggleChatBox}
        >
          {" "}
          {open ? (
            <SquareChevronRight
              className="text-white bg-black hidden md:block"
              size={30}
            />
          ) : (
            <SquareChevronLeft
              className="text-white bg-black hidden md:block"
              size={30}
            />
          )}
        </button>
      </div>
      <div
        className={cn(
          "flex my-6 md:my-0 flex-col shadow-md justify-between bg-[#f7f4f4d1] ease-in-out duration-700",
          open === true ? "md:w-2/4 lg:w-2/6 p-4 xl:w-1/4" : "w-0"
        )}
      >
        <div className="overflow-y-auto h-full">
          <div className="flex flex-col justify-between gap-6 h-full">
            <ChatMessages
              from="slides"
              welcomeMessage={"Hi , how can i help you ?"}
              messages={messages}
              isLoading={status === "in_progress"}
              reload={() => {
                console.log("reload");
              }}
              stop={() => {
                console.log("stop");
              }}
            />
            <ChatInput
              input={input}
              handleSubmit={handleSubmit}
              handleInputChange={handleInputChange}
              isLoading={status === "in_progress"}
              threadId={threadId ? threadId : ""}
              assistantId={data?.assistantId}
              sendSlideNumber={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
export default Slides;
