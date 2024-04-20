import { BASE_URL } from "@/constants";
import { notFound } from "next/navigation";
import ChatIcon from "./_component/ChatIcon";
import HeadingSection from "./_component/HeadingSection";
import ImageGallery from "./_component/ImageGallery";
import ImageGallery2 from "./_component/ImageGallery2";
import ImageGalleryMobile from "./_component/ImageGalleryMobile";
import V3 from "./_component/v3";

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
    return data as { result: [{ Id: string }] };
  } catch (error) {
    console.error(error);
    return null;
  }
}

async function getVisitorDetails(token: string) {
  try {
    const res = await fetch(BASE_URL + "/api/visitor?token=" + token);
    const data = (await res.json()) as
      | { error: any }
      | { visitor: any; clientProfile: any };
    console.log("data", data);
    // @ts-expect-error
    if (data?.error !== undefined) {
      return null;
    }
    return data as { clientProfile: any; visitor: any };
  } catch (error) {}
}

async function Landing({
  searchParams: { token, v },
}: {
  searchParams: { token: string; v: string };
}) {
  v = "3";
  const data = await getVisitorDetails(token);
  if (data === null) {
    notFound();
  }

  return (
    <>
      {v && v === "3" ? (
        <div className="h-screen w-screen">
          <V3
            clientProfile={data?.clientProfile}
            visitor={data?.visitor}
            v="3"
          />
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
          <HeadingSection clientProfile={data?.clientProfile} v="1" />
          <div className="fixed bottom-10 right-10">
            <ChatIcon />
          </div>
        </div>
      )}
    </>
  );
}

export default Landing;
