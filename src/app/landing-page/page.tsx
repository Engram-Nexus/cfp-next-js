import { Button } from "@/components/ui/button";
import ImageGallery from "./_component/ImageGallery";
import ImageGalleryMobile from "./_component/ImageGalleryMobile";
import { BASE_URL } from "@/constants";
import ImageGallery2 from "./_component/ImageGallery2";
import ChatIcon from "./_component/ChatIcon";
import { notFound } from "next/navigation";

export const runtime = "edge";

async function getClientDetails(token: string) {
  try {
    const res = await fetch(BASE_URL + "/api/client-profile?token=" + token);
    const data = (await res.json()) as
      | { error: any }
      | { result: { Id: string } };
    console.log("data", data);
    // @ts-expect-error
    if (data?.error !== undefined) {
      return null;
    }
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

async function Landing({
  searchParams: { token, v },
}: {
  searchParams: { token: string; v: string };
}) {
  const data = await getClientDetails(token);
  if (data === null) {
    notFound();
  }
  return (
    <div className="flex flex-col-reverse lg:flex-row relative">
      <ChatIcon />
      <section className="flex-1 font-medium text-4xl min-h-[100dvh] bg-emerald-100/20">
        <div className="lg:flex hidden">
          {v && v === "2" ? (
            <ImageGallery2 images={[]} />
          ) : (
            <ImageGallery images={[]} />
          )}
        </div>
        <div className="flex lg:hidden">
          <ImageGalleryMobile images={[]} />
        </div>
      </section>
      <section className="flex-1 font-medium text-4xl min-h-[100dvh] flex flex-col items-center justify-between">
        {/* @ts-expect-error */}
        <h1 className="text-xl text-center">client-id :{data?.result?.Id}</h1>
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
    </div>
  );
}

export default Landing;
