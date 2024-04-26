"use client";
import { cn } from "@/lib/utils";
import { useVisitorStore } from "@/store/useVisitorStore";

function HeadingSection({ clientProfile }: { clientProfile: any }) {
  const visitorData = useVisitorStore((state) => state.visitorData);
  return (
    <section
      className={cn(
        "flex-1 font-medium text-4xl flex flex-col items-center justify-betwee overflow-auto h-full justify-start"
      )}
    >
      <div className="px-8 flex flex-col items-center">
        <p className="text-center text-4xl font-medium text-balance py-8 transition-all duration-700 ease-in-out">
          {clientProfile?.tagline ||
            "We build brands and digital flagship stores"}
        </p>
        <p className="text-center text-balance text-xl">
          {clientProfile?.description ||
            " Our work is driven by emotion and built on logic."}
        </p>
        {visitorData?.messages && (
          <div className=" flex gap-4 flex-wrap bg-[#f5f5f5] shadow-sm p-4 my-2 rounded-lg">
            {visitorData?.messages?.map((message: any) => (
              <p className="text-sm" key={message}>
                {message}
              </p>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
export default HeadingSection;
