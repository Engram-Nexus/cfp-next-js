import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Badge, X } from "lucide-react";

const ChatIcon = () => {
  return (
    <Drawer>
      <DrawerTrigger>
        <div className="rounded-full h-24 w-24 bg-orange-500 fixed z-20 bottom-10 right-1/2 translate-x-1/2 flex justify-center items-center group hover:scale-110 transition-all ease-in-out duration-300 border border-transparent hover:border-orange-500 hover:-translate-y-4 cursor-pointer">
          <p className="text-2xl text-orange-500 font-semibold font-sans transition-all ease-in-out duration-300 opacity-0 group-hover:opacity-100 absolute left-0 -top-9 group-hover:top-1/3 group-hover:right-0 translate-x-3/4 group-hover:rotate-90">
            Chat
          </p>
          <p className="lg:hidden text-xl text-white font-semibold font-sans animate-pulse">
            Ask me
          </p>
          <p className="hidden lg:flex text-xl text-white font-semibold font-sans group-hover:opacity-0 transition-all ease-in-out duration-300">
            Ask me
          </p>
          <Badge className="h-28 w-28 absolute" color={"rgb(249 115 22"} style={{
              animation: "ping 2s cubic-bezier(0.75, -0.15, 0.39, 0.83) 0s infinite normal none running"
          }}/>
        </div>
      </DrawerTrigger>
      <DrawerContent className="">
        <DrawerHeader>
          <DrawerTitle className="flex justify-between">
            <h1 className="font-sans text-xl font-semibold">Ask a Question</h1>
            <DrawerClose>
              <Button variant="outline">
                <X />
              </Button>
            </DrawerClose>
          </DrawerTitle>
        </DrawerHeader>
        <DrawerFooter>
          <div className="flex gap-4">
            <Input
              className="border border-zinc-900"
              placeholder="Enter your question"
            />
            <Button className="w-32">Submit</Button>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
export default ChatIcon;
