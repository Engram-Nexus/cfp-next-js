"use client";
import Script from "next/script";
import { useEffect, useState } from "react";
import {
  DialogDescription,
  DialogHeader,
  Dialog,
  DialogTitle,
  DialogContent,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "./ui/use-toast";

const Slides = () => {
  const [isloading, setIsloading] = useState(false);
  const [open, setOpen] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID;
  const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

  const DISCOVERY_DOC =
    "https://slides.googleapis.com/$discovery/rest?version=v1";
  const SCOPES = "https://www.googleapis.com/auth/presentations.readonly";

  const router = useRouter();

  function gapiLoaded() {
    gapi.load("client", initializeGapiClient);
  }

  const initializeGapiClient = async () => {
    await gapi.client.init({
      apikey: API_KEY,
      discoveryDocs: [DISCOVERY_DOC],
    });
  };

  const gisLoaded = () => {
    const initToken = google.accounts.oauth2.initTokenClient({
      client_id: CLIENT_ID,
      scope: SCOPES,
    });
  };

  const onSubmit = (data) => {
    handleAuthClick(data.slideUrl);
  };

  const handleAuthClick = async (slideUrl) => {
    setIsloading(true);
    const tokenClient = google.accounts.oauth2.initTokenClient({
      client_id: CLIENT_ID,
      scope: SCOPES,
      callback: async (resp) => {
        if (resp.error !== undefined) {
          toast({
            title: "Error",
            description: resp.error || "Authorization failed. Try again",
            variant: "destructive",
            className: "bg-red-500",
          })
          setIsloading(false);
          throw resp;
        }
        await listSlides(slideUrl);
      },
      error_callback: (error) => {
        console.log(error);
        if(error.type === "popup_closed" || error==="access_denied"){
          console.log("popup closed");
          toast({
            title: "Error",
            description: error.message || "Authorization failed. Try again",
            variant: "destructive",
            className: "bg-red-500",
          })
        }
        setIsloading(false);
      }
    });

    if (gapi.client.getToken() === null) {
      tokenClient.requestAccessToken({ prompt: "consent" });
    } else {
      tokenClient.requestAccessToken({ prompt: "" });
    }
  };
  const listSlides = async (slideUrl) => {
    try {
      const id = slideUrl.match(/\/d\/(?:e\/)?([^/]+)/);
      const response = await gapi.client.slides.presentations.get({
        presentationId: id[1],
      });

      try {
        const res = await fetch("/api/slides", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ slideUrl, slidesData: response.result }),
        }).then((res) => res.json());

        if (res.url) {
          router.push(res.url);
          setIsloading(false);
        } else {
          setIsloading(false);
          toast({
            title: "Error",
            description:
              res?.error?.error?.message ||
              "Something went wrong pleae try again",
            variant: "destructive",
            className: "bg-red-500",
          });
        }
      } catch (error) {
        setIsloading(false);
        toast({
          title: "Error",
          description: "Something went wrong pleae try again",
          variant: "default",
          className: "bg-red-500",
        });

        console.log(error, "error while creating assistant");
      } finally {
        setIsloading(false);
      }
    } catch (error) {
      setIsloading(false);
      toast({
        title: "Error",
        description: error?.result?.error?.message || "Something went wrong",
        variant: "destructive",
        className: "bg-red-500",
      });
      console.log(error);
    } finally {
      setIsloading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setOpen(true);
    }, 0);
    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <>
      <Script
        src="https://apis.google.com/js/api.js"
        onLoad={() => {
          gapiLoaded();
        }}
      />
      <Script
        src="https://accounts.google.com/gsi/client"
        onLoad={() => {
          gisLoaded();
        }}
      />

      <Dialog open={open}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enter your google slide url :</DialogTitle>
            {/* {!slidesPageUrl ? (
              <DialogTitle>Enter your google slide url :</DialogTitle>
            ) : (
              <DialogTitle className="text-base">
                Click on this link to ask question to our chat bot about your
                slide :
              </DialogTitle>
            )} */}
            <DialogDescription className="my-4">
              {/* {!slidesPageUrl ? ( */}
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="mx-4  md:mx-auto bg-[#F5F5F5] p-6 rounded-xl shadow-md"
              >
                <textarea
                  {...register("slideUrl", {
                    required: true,
                    pattern:
                      /https:\/\/docs.google.com\/presentation\/d\/(?:e\/)?([^/]+)/,
                  })}
                  placeholder="Slide url.."
                  className="border-2 border-gray-300 mt-2  rounded-md px-2 w-full"
                  type="text"
                  name="slideUrl"
                  // value={slideUrl}
                  // onChange={(e) => setSlideUrl(e.target.value)}
                  aria-invalid={errors.slideUrl ? "true" : "false"}
                />
                {errors?.slideUrl && (
                  <p className="text-red-500">
                    Please enter a valid google slide url
                  </p>
                )}
                <div className="grid justify-center mt-2">
                  {isloading ? (
                    <Button
                      disabled
                      className="flex items-center justify-center gap-4"
                    >
                      Authorizing
                      <LoaderCircle className="animate-spin" />
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      className="bg-[#0052CC] cursor-pointer p-2 grid mt-4 text-white rounded-md"
                      // onClick={handleAuthClick}
                    >
                      Authorize
                    </Button>
                  )}
                </div>
              </form>
              {/* ) : (
                <>
                  <a className="break-all text-blue-500" href={slidesPageUrl}>
                    {slidesPageUrl}
                  </a>

                  <Button
                    onClick={() => copyToClipboard(slidesPageUrl || "")}
                    size="icon"
                    variant="outline"
                    className="h-8 w-8 flex-shrink-0"
                  >
                    {isCopied ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </>
              )} */}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Slides;
