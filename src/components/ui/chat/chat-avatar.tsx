"use client";
import { useVisitorStore } from "@/store/useVisitorStore";
import { User2 } from "lucide-react";

export default function ChatAvatar({ role }: { role: string }) {
  const visitorData = useVisitorStore((state) => state.visitorData);
  if (role === "user") {
    return (
      <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md border bg-background shadow">
        {/* <User2 className="h-4 w-4" /> */}
        {visitorData?.profileImage ? (
          <img
            className="rounded-md h-full w-full"
            src={visitorData?.profileImage}
            alt="visitor Image"
            width={24}
            height={24}
          />
        ) : (
          <User2 className="h-4 w-4" />
        )}
      </div>
    );
  }
  return (
    <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md border bg-black text-white shadow">
      <img
        className="rounded-md h-full w-full"
        src={
          visitorData?.companyLogo ? visitorData?.companyLogo : "/engram.png"
        }
        alt="engram Logo"
        width={24}
        height={24}
      />
    </div>
  );
}
