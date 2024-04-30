"use client";
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  SquareChevronLeft,
  SquareChevronRight,
} from "lucide-react";
const GoogleSlidesChat = () => {
  const [chatMessages, setChatMessages] = useState<any>([]);
  const [inputValue, setInputValue] = useState<any>("");
  const [open, setOpen] = useState(true);
  const [answer, setAnswer] = useState<any>();

  const sendChat = () => {
    if (inputValue !== "") {
      setChatMessages([...chatMessages, { message: inputValue }]);
    }
    setInputValue("");
  };

  const handleInputChange = (event: any) => {
    setInputValue(event.target.value);
  };
  const toggleChatBox = () => {
    setOpen(!open);
  };

  return (
    <div className="md:flex h-[100vh] w-full">
      <div
        className={cn(
          "h-full relative ease-in-out duration-700",
          open === true ? "w-3/4" : "w-full"
        )}
      >
        <iframe
          className="w-full h-full"
          src="https://docs.google.com/presentation/d/e/2PACX-1vSOwXWZZMSVJ3Lk03_mz7pFlpMDuf1FRBxPAbUsvS_hVvzmlk-uz2vI78avvBairfM2vdBLbrEnr5yX/embed?start=false&loop=false&delayms=3000"
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
        className={cn(
          "flex my-6 md:my-0 flex-col shadow-md justify-between bg-[#f7f4f4d1] ease-in-out duration-700",
          open === true ? "w-1/4 p-4" : "w-0"
        )}
      >
        <div className="overflow-y-auto ">
          {chatMessages.map((msg: any) => (
            <p className="break-words text-wrap bg-[#007bff]  font-semibold p-2 my-2 shadow-sm rounded-2xl w-fit text-white">
              {msg.message}
            </p>
          ))}
          {answer ? (
            <div className="flex justify-end">
              <p className="break-words font-semibold bg-white p-2 my-2 shadow-sm rounded-2xl w-fit  text-black ">
                {/* {answer} */}
              </p>
            </div>
          ) : null}
        </div>
        <div className="flex gap-2 items-center">
          <input
            value={inputValue}
            id="chatInput"
            onChange={handleInputChange}
            className="w-full border-2 focus:outline-none border-slate-200 p-2 rounded-md placeholder:text-black"
            type="text"
            placeholder="Enter your message..."
            onKeyUp={(event) => {
              if (event.key === "Enter") sendChat();
            }}
          />
          <Button onClick={sendChat} className="text-md flex items-center">
            Send
            {/* <SendHorizontal size={16} /> */}
            <span className="ml-2 text-2xl">&#8679;</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GoogleSlidesChat;
