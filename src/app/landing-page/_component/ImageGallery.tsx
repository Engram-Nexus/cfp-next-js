"use client";
import { useVisitorStore } from "@/store/useVisitorStore";
function ImageGallery({ images }: { images: string[] }) {
  const visitorData = useVisitorStore((state) => state.visitorData);
  return (
    <div
      className="h-full lg:w-[50vw] w-dvw overflow-y-scroll overflow-x-hidden"
      style={{
        scrollbarWidth: "none",
        msOverflowStyle: "none",
      }}
    >
      {visitorData?.imageUrls ? (
        <div className="columns-3 h-full">
          {visitorData?.imageUrls.map((image: any) => (
            <div className="grid gap-4" key={image}>
              <ImageComp src={image} key={image} />
            </div>
          ))}
        </div>
      ) : 
      null}
    </div>
  );
}
export default ImageGallery;

function ImageComp({ src }: { src: string }) {
  return (
    <div className="rounded-lg m-4">
      <div className="lg:scale-100 scale-75 h-full w-full">
        <img
          src={src}
          width={0}
          height={0}
          sizes="100vw"
          className="h-full w-full rounded-lg object-cover"
          alt="image"
        />
      </div>
    </div>
  );
}

