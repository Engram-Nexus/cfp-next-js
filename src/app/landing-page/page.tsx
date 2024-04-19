import { BASE_URL } from "@/constants";
import ChatIcon from "./_component/ChatIcon";
import HeadingSection from "./_component/HeadingSection";
import ImageGallery from "./_component/ImageGallery";
import ImageGallery2 from "./_component/ImageGallery2";
import ImageGalleryMobile from "./_component/ImageGalleryMobile";
import V3 from "./_component/v3";
import { notFound } from "next/navigation";

export const runtime = "edge";

async function getClientDetails(token: string) {
  try {
    const res = await fetch(BASE_URL + "/api/client-profile?token=" + token);
    const data = (await res.json()) as
      | { error: any }
      | { result: [{ Id: string }] };
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
  // v = "3";
  return (
    <>
      {v && v === "3" ? (
        <div className="h-screen w-screen">
          {/* @ts-expect-error */}
          <V3 id={data?.result[0]?.Id} v="3" />
        </div>
      ) : (
        <div className="flex flex-col-reverse lg:flex-row relative">
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
          {/* @ts-expect-error */}
          <HeadingSection id={data?.result[0]?.Id} v="1" />
          <div className="fixed bottom-10 right-10">
            <ChatIcon />
          </div>
        </div>
      )}
    </>
  );
}

export default Landing;
