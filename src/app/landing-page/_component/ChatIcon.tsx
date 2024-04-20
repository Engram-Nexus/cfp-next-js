"use client";
import ChatSection from "@/components/chat-section";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { MessageSquare } from "lucide-react";
import React from "react";

const ChatIcon = () => {
  const [open, setOpen] = React.useState(false);
  return (
    <Popover open={open}>
      <PopoverTrigger asChild>
        <div className="relative">
          <div className="flex items-end gap-2">
            {/* <p className="font-sans text-2xl py-4 text-orange-500 font-bold">Ask me</p> */}
            <button
              onClick={() => setOpen((prev) => !prev)}
              className="rounded-full h-20 w-20 bg-orange-500 flex justify-center items-center group hover:scale-110 transition-all ease-in-out duration-300 border border-transparent hover:border-orange-500 hover:-translate-y-4 cursor-pointer"
            >
              <div className="flex fle items-centerx-col lg:hidden text-xl text-white font-semibold font-sans animate-pulse">
                <MessageSquare size={44} />
              </div>
              <div className="flex-col items-center hidden lg:flex text-xl text-white font-semibold font-sans transition-all ease-in-out duration-300">
                <MessageSquare size={44} />
              </div>
            </button>
          </div>
          <div
            className={cn(
              "absolute w-full h-full bg-orange-500 rounded-full top-0 -z-10",
              {
                "animate-ping": !open,
                "hidden": open,
              }
            )}
          ></div>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-full mb-10" side="left">
        <ChatSection assistantId="123" />
      </PopoverContent>
    </Popover>
  );
};
export default ChatIcon;
