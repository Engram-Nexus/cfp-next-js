import ChatSection from "@/components/chat-section";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import HeadingSection from "./HeadingSection";
import ImageGallery3 from "./ImageGallery3";
import ImageGalleryMobile from "./ImageGalleryMobile";

function V3({
  clientProfile,
  visitor,
  v,
}: {
  visitor: any;
  clientProfile: any;
  v: string;
}) {
  return (
    <>
      <div className="hidden lg:block h-[100dvh]">
        <ResizablePanelGroup
          direction="horizontal"
          className="h-full w-full rounded-lg border"
        >
          <ResizablePanel defaultSize={50} className="max-w-[50vw]">
            {/* <ImageGallery3 images={[]} /> */}
            {JSON.stringify(clientProfile)}
            {/* {JSON.stringify(visitor)} */}
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={50}>
            <ResizablePanelGroup direction="vertical">
              <ResizablePanel defaultSize={25}>
                <HeadingSection clientProfile={clientProfile} v={v} />
              </ResizablePanel>
              <ResizableHandle withHandle />
              <ResizablePanel defaultSize={75} className="h-full">
                <ChatSection
                  assistantId={visitor?.assistantId}
                  className="flex flex-col overflow-y-auto"
                  flex1={true}
                />
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
      <div className="lg:hidden h-screen">
        <HeadingSection clientProfile={clientProfile} v={v} />
        <ImageGalleryMobile images={[]} />

        <ChatSection
          assistantId={visitor?.assistantId}
          className="flex flex-col overflow-y-auto"
          flex1={true}
        />
      </div>
    </>
  );
}
export default V3;
