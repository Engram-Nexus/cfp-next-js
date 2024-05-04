"use client";
import React, { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import {
  SquareChevronLeft,
  SquareChevronRight,
} from "lucide-react";
import { experimental_useAssistant as useAssistant } from "ai/react";
import { ChatInput, ChatMessages } from "@/components/ui/chat";
import { Button } from "@/components/ui/button";
const GoogleSlidesChat = () => {
  const [open, setOpen] = useState(true);
  const chatSectionRef = useRef<HTMLDivElement>(null);

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

  const toggleChatBox = () => {
    setOpen(!open);
  };
  // const getSlides = ()=>{

  // }
  const onsubmit = () => {
    
  }
  console.log("messages", messages);

  return (
    <div className="md:flex h-[100vh] w-full">
      <div
        className={cn(
          "h-full relative ease-in-out duration-700",
          open === true ? "md:w-3/4" : "w-full"
        )}
      >
        <iframe
          id="googleSlideIframe"
          className="w-full h-full"
          // src="https://docs.google.com/presentation/d/e/2PACX-1vSOwXWZZMSVJ3Lk03_mz7pFlpMDuf1FRBxPAbUsvS_hVvzmlk-uz2vI78avvBairfM2vdBLbrEnr5yX/embed?start=false&loop=false&delayms=3000"
          src="  https://docs.google.com/presentation/d/1CrUeeIpwJCqlmicm8T3UpQG9XAMZAX9bs3-VeX2F8sg/embed?start=false&loop=false&delayms=3000"
          allowFullScreen={true}
        ></iframe>
        <button
          className="absolute top-2 right-2 text-xl"
          onClick={toggleChatBox}
        >
          {" "}
          {open ? (
            <SquareChevronRight className="text-white bg-black" size={30} />
          ) : (
            <SquareChevronLeft className="text-white bg-black" size={30} />
          )}
        </button>
      </div>
      <div
        ref={chatSectionRef}
        className={cn(
          "flex my-6 md:my-0 flex-col shadow-md justify-between bg-[#f7f4f4d1] ease-in-out duration-700",
          open === true ? "md:w-1/4 p-4" : "w-0"
        )}
      >
        <div className="overflow-y-auto h-full">
          <p className="text-center bg-[#0f172a] p-2 rounded-md text-shadow:2px 2px 20px #085FA0 text-[#FFFFFF] ">
            Ask questions about your slides !
          </p>
          {/* {chats.map((msg: any) => (
            <div key={msg.message} className="mt-6">
              <div className="flex justify-end">
                <p className="break-all bg-[#007bff] font-normal p-2 my-2 shadow-sm rounded-tl-xl rounded-br-xl w-fit text-white">
                  {msg.question}
                </p>
              </div>
              {msg.answer && (
                <p className="break-all font-normal rounded-tr-xl rounded-bl-xl bg-white p-2 my-2 shadow-sm  w-fit text-black">
                  {msg.answer}
                </p>
              )}
            </div>
          ))} */}
    
          <div className="flex flex-col justify-between gap-6">
            <ChatMessages
              from="slides"
              welcomeMessage={"how can i help you ?"}
              messages={messages}
              // chatHistory={chatHistory}
              isLoading={status === "in_progress"}
              reload={() => {
                console.log("reload");
              }}
              stop={() => {
                console.log("stop");
              }}
              // flex1={flex1}
              />
            <ChatInput
              input={input}
              handleSubmit={handleSubmit}
              handleInputChange={handleInputChange}
              isLoading={status === "in_progress"}
              threadId={threadId?threadId:""}
              assistantId={"asst_ud8uuERilaRiXv5W9XD3LHLJ"}
            />
          </div>
        </div>
        {/* {isLoading && <LoaderCircle className="animate-spin" />}
        <form onSubmit={handleSubmit} className="flex gap-2 items-center">
          <input
            value={input}
            id="chatInput"
            onChange={handleInputChange}
            className="w-full border-2 focus:outline-none border-slate-200 p-2 rounded-md placeholder:text-black"
            type="text"
            placeholder="Enter your message..."
            onKeyUp={(event) => {
              if (event.key === "Enter") handleSubmit();
            }}
          />
          <Button type="submit" className="text-md flex items-center">
            Send
            <span className="ml-2 text-2xl">&#8679;</span>
          </Button>
        </form> */}
                  {/* <Button type="submit" className="text-md flex items-center">
            Send
            <span className="ml-2 text-2xl">&#8679;</span>
          </Button> */}
      </div>
    </div>
  );
};

export default GoogleSlidesChat;
