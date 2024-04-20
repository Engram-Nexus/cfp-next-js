import { cn } from "@/lib/utils";

function HeadingSection({
  clientProfile,
  v,
}: {
  clientProfile: any;
  v: string;
}) {
  return (
    <section
      className={cn(
        "flex-1 font-medium text-4xl flex flex-col items-center justify-betwee overflow-auto",
        v === "3" ? "h-full justify-start" : "h-[100dvh]"
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
      </div>
      <p></p>
    </section>
  );
}
export default HeadingSection;
