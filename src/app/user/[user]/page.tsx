import { Button } from "@/components/ui/button";
import ImageGallery from "./_component/ImageGallery";
import ImageGalleryMobile from "./_component/ImageGalleryMobile";

export const runtime = "edge";

function Landing({ params: { user } }: { params: { user: string } }) {
  return (
    <div className="flex flex-col-reverse lg:flex-row">
      <section className="flex-1 font-medium text-4xl min-h-[100dvh] bg-emerald-100/20">
        <div className="lg:flex hidden">
          <ImageGallery images={[]} />
        </div>
        <div className="flex lg:hidden">
          <ImageGalleryMobile images={[]} />
        </div>
      </section>
      <section className="flex-1 font-medium text-4xl min-h-[100dvh] flex flex-col items-center justify-between">
        <h1 className="text-xl text-center">UserName : {user}</h1>
        <div className="px-8 flex flex-col items-center">
          <p className="text-center text-7xl font-medium text-balance py-8 transition-all duration-700 ease-in-out">
            We build brands and digital flagship stores
          </p>
          <p className="text-center text-balance text-2xl">Our work is driven by emotion and built on logic.</p>
          <Button className="mt-8 mx-auto">Explore</Button>
        </div>
        <p></p>
      </section>
    </div>
  );
}

export default Landing;
