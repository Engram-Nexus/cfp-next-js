"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

const SPEED = 10 * 1000;

function ImageGallery({ images }: { images: string[] }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const viewRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (viewRef.current === null || containerRef.current === null) return;
    const view = viewRef.current;
    const container = containerRef.current;

    if (containerRef.current === null) return;
    container.onmousemove = (e) => {
      const mouseX = e.clientX,
        mouseY = e.clientY;

      const xDecimal = mouseX / container.clientWidth,
        yDecimal = mouseY / container.clientHeight;

      const maxX = view.offsetWidth - container.clientWidth,
        maxY = container.clientHeight || 0;

      const panX = maxX * xDecimal * -1,
        panY = maxY * yDecimal * -1;

      view.animate(
        {
          transform: `translate(${panX}px, ${panY}px)`,
        },
        {
          duration: SPEED,
          fill: "forwards",
          easing: "ease",
        }
      );
    };

    return () => {
      container.onmousemove = null;
    };
  }, []);
  return (
    <div ref={containerRef} className="h-dvh lg:w-[50vw] transition-all ease-in-out duration-700 w-dvw overflow-hidden">
      <div
        ref={viewRef}
        style={{
          height: "140vmax",
          width: "140vmax",
          transform: "translate(-25%, -25%)",
        }}
        className="overflow-hidden columns-4 pt-96 px-40 pb-40"
      >
        {dummyImages.map((image) => (
          <ImageComp src={image} key={image} />
        ))}
      </div>
    </div>
  );
}
export default ImageGallery;

const maxHeight = 300;
const maxWidth = 300;
const minHeight = 250;
const minWidth = 250;
const maxMargin = 25;
const minMargin = 1;

function ImageComp({ src }: { src: string }) {
  const randomHeight = Math.floor(Math.random() * maxHeight) + minHeight;

  const randomWidth = Math.floor(Math.random() * maxWidth) + minWidth;

  const randomX = Math.floor(Math.random() * maxMargin) + minMargin;

  const randomBackgroundColor = dummyColors[Math.floor(Math.random() * dummyColors.length)];

  return (
    <div
      className="hover:scale-110 hover:z-10 relative scale-100 transition-all ease-linear duration-700 group"
      style={{ height: `${randomHeight}px`, width: `${randomWidth}px`, margin: `${randomX}%` }}
    >
      <div style={{ backgroundColor: randomBackgroundColor, }}>
        <span className="opacity-80 grayscale-[10%] group-hover:grayscale-0 group-hover:opacity-100 transition-all ease-linear duration-700 hover:scale-[101] scale-100">
          <Image src={src} width={0} height={0} sizes="100vw" style={{ width: "100%", height: "auto" }} alt="image" />
        </span>
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

const dummyColors = [
  "rgb(255, 238, 88)",

  "rgb(66, 165, 245)",

  "rgb(239, 83, 80)",

  "rgb(102, 187, 106)",

  "rgb(171, 71, 188)",

  "rgb(255, 167, 38)",

  "rgb(63, 81, 181)",

  "rgb(141, 110, 99)",

  "rgb(250, 250, 250)",
];
