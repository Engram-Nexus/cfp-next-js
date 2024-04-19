import ChatSection from "@/components/chat-section";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import HeadingSection from "./HeadingSection";
import ImageGallery from "./ImageGallery";
import ImageGalleryMobile from "./ImageGalleryMobile";

function V3({ id, v }: { id: string; v: string }) {
  return (
    <>
      <div className="hidden lg:block">
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
                <HeadingSection id={id} v={v} />
              </ResizablePanel>
              <ResizableHandle withHandle />
              <ResizablePanel defaultSize={75} className="h-full">
                <ChatSection
                  className="flex flex-col overflow-y-auto"
                  flex1={true}
                />
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
      <div className="lg:hidden h-screen">
        <HeadingSection id={id} v={v} />
        <ImageGalleryMobile images={[]} />

        <ChatSection className="flex flex-col overflow-y-auto" flex1={true} />
      </div>
    </>
  );
}
export default V3;
