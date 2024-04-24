import ChatSection from "@/components/chat-section";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { BASE_URL } from "@/constants";
import HeadingSection from "./_component/HeadingSection";
import ImageGallery from "./_component/ImageGallery";
import ImageGalleryMobile from "./_component/ImageGalleryMobile";

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
    // @ts-expect-error
    if (data?.error !== undefined) {
      return null;
    }
    return data as { clientProfile: any; visitor: any };
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
  const data = await getVisitorDetails(token);
  console.log("data", data);

  if (data === null) {
    // notFound();
  }

  return (
    <div className="h-screen w-screen">
      <div className="hidden lg:block h-[100dvh]">
        <ResizablePanelGroup
          direction="horizontal"
          className="h-full w-full rounded-lg border"
        >
          <ResizablePanel defaultSize={50} className="max-w-[50vw]">
            <ImageGallery images={[]} />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={50}>
            <ResizablePanelGroup direction="vertical">
              <ResizablePanel defaultSize={25}>
                <HeadingSection clientProfile={data?.clientProfile} />
              </ResizablePanel>
              <ResizableHandle withHandle />
              <ResizablePanel defaultSize={75} className="h-full">
                <ChatSection
                welcomeMessage = "Hi, I'm your virtual assistant. How can I help you?"
                  visitorThreadId={data?.visitor?.threadId}
                  assistantId={data?.visitor?.assistantId}
                  className="flex flex-col overflow-y-auto"
                  flex1={true}
                />
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
      {/* #NOTE: Mobile */}
      <div className="lg:hidden h-screen">
        <HeadingSection clientProfile={data?.clientProfile} />
        <ImageGalleryMobile images={[]} />

        <ChatSection
           welcomeMessage ="Hi, I'm your virtual assistant. How can I help you?"
          visitorThreadId={data?.visitor?.threadId}
          assistantId={data?.visitor?.assistantId}
          className="flex flex-col overflow-y-auto"
          flex1={true}
        />
      </div>
    </div>
  );
}

export default Landing;
