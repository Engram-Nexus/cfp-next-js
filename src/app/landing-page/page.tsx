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

async function getVisitorDetails(token: string): Promise<{
  clientProfile: any;
  visitor: any;
} | null> {
  try {
    const res = await fetch(BASE_URL + "/api/visitor?token=" + token);

    if (!res.ok) {
      throw new Error("Failed to fetch visitor details");
    }
    const data = (await res.json()) as
      | { clientProfile: any; visitor: any }
      | { error: any };

    if ("error" in data) {
      return null;
    }

    return data as {
      clientProfile: any;
      visitor: any;
    };
  } catch (error) {
    console.error(error);
    return null;
  }
}

async function Landing({
  searchParams: { token },
}: {
  searchParams: { token: string };
}) {
  const data = await getVisitorDetails(token);

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
                  welcomeMessage={data?.visitor?.welcomeMessage}
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
          welcomeMessage={data?.visitor?.welcomeMessage}
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
