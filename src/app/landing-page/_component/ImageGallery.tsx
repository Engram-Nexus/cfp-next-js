"use client";
import { useVisitorStore } from "@/store/useVisitorStore";
import Image from "next/image";
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
      ) : (
        <div className="columns-3 h-full">
          {dummyImages.map((image) => (
            <div className="grid gap-4" key={image}>
              <ImageComp src={"image"} key={image} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
export default ImageGallery;

function ImageComp({ src }: { src: string }) {
  return (
    <div className="rounded-lg m-4">
      <div className="lg:scale-100 scale-75 h-full w-full">
        {/* <object
          data={src}
          type="image/png"
          width={0}
          height={0}
          className="h-full w-full rounded-lg object-cover"
        > */}
          <img
            src={src}
            width={0}
            height={0}
            sizes="100vw"
            className="h-full w-full rounded-lg object-cover"
            alt="image"
          />
        {/* </object> */}
      </div>
    </div>
  );
}

const dummyImages = [
  "https://images.unsplash.com/photo-1481349518771-20055b2a7b24?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MjF8fHJhbmRvbSUyMG9iamVjdHN8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=70",

  "https://images.unsplash.com/photo-1515266591878-f93e32bc5937?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTF8fGJsdWV8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=70",

  "https://images.unsplash.com/photo-1587590227264-0ac64ce63ce8?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8cmFuZG9tJTIwb2JqZWN0c3xlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=70",

  "https://images.unsplash.com/photo-1520121401995-928cd50d4e27?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8Z3JlZW58ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=70",

  "https://images.unsplash.com/photo-1511447333015-45b65e60f6d5?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8cHVycGxlfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=70",

  "https://images.unsplash.com/photo-1557800636-894a64c1696f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8b3JhbmdlfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=70",

  "https://images.unsplash.com/photo-1520338258525-606b90f95b04?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTR8fGRhcmslMjBibHVlfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=70",

  "https://images.unsplash.com/photo-1521127474489-d524412fd439?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NTh8fHJhbmRvbSUyMG9iamVjdHN8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=70",

  "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8OXx8cmFuZG9tJTIwb2JqZWN0c3xlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=70",
];
