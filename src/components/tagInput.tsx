"use client";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import React from "react";

export interface TagInputProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  setVal: (val: string[] | undefined) => void;
}

const TagInput = React.forwardRef<HTMLTextAreaElement, TagInputProps>(
  ({ className, setVal, ...props }, ref) => {
    const [tags, setTags] = React.useState<string[] | undefined>();
    const [input, setInput] = React.useState<string>("");

    React.useEffect(() => {
      setVal(tags);
    }, [tags, setVal]);

    return (
      <>
        <div className="flex flex-col min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
          <div className="flex flex-col gap-2 justify-center my-2">
            {tags?.map((tag, index) => (
              <span
                key={index}
                className="flex justify-between mr-1 bg-zinc-300 text-black px-4 py-1 rounded-sm"
              >
                {tag}
                <span
                  className="cursor-pointer"
                  onClick={() =>
                    setTags((prev) => prev?.filter((t) => t !== tag))
                  }
                >
                  <X size={16} />
                </span>
              </span>
            ))}
          </div>
          <textarea
            className={cn(
              "disabled:cursor-not-allowed disabled:opacity-50 border-0 ring-offset-background focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-ring focus-visible:ring-offset-0",
              className
            )}
            ref={ref}
            {...props}
            value={input}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                if (input) {
                  setTags((prev) => {
                    const newTagArray = [...(prev ? prev : []), input];
                    const unique = new Set(newTagArray);
                    return Array.from(unique);
                  });
                  setInput("");
                }
              }
            }}
            onChange={(e) => {
              setInput(e.target.value);
            }}
          />
        </div>
      </>
    );
  }
);
TagInput.displayName = "TagInput";
export default TagInput;
