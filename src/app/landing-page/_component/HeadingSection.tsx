import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function HeadingSection({ id, v }: { id: string; v: string }) {
  return (
    <section
      className={cn(
        "flex-1 font-medium text-4xl flex flex-col items-center justify-between overflow-auto",
        v === "3" ? "h-full" : "h-[100dvh]"
      )}
    >
      <h1 className="text-xl text-center">client-id :{id}</h1>

      <div className="px-8 flex flex-col items-center">
        <p className="text-center text-7xl font-medium text-balance py-8 transition-all duration-700 ease-in-out">
          We build brands and digital flagship stores
        </p>
        <p className="text-center text-balance text-2xl">
          Our work is driven by emotion and built on logic.
        </p>
        <Button className="mt-8 mx-auto">Explore</Button>
      </div>
      <p></p>
    </section>
  );
}
export default HeadingSection;
