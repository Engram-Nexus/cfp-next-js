"use client";
import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "./ui/button";
import toast from "react-hot-toast";

const Authorize = () => {
  const [isloading, setIsloading] = useState(false);

  const router = useRouter();

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
    handleAuthClick(data?.slideUrl);
  };

  const handleAuthClick = async (slideUrl) => {
    setIsloading(true);
    const tokenClient = google.accounts.oauth2.initTokenClient({
      client_id: CLIENT_ID,
      scope: SCOPES,
      callback: async (resp) => {
        if (resp.error !== undefined) {
          toast.error(resp.error || "Authorization failed. Try again");
          setIsloading(false);
          throw resp;
        }
        await listSlides(slideUrl);
      },
      error_callback: (error) => {
        console.log(error);
        if (error) {
          console.log("popup closed");
          toast.error(error.message || "Authorization failed. Try again");
        }
        setIsloading(false);
      },
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
       
      // const data = response?.result?.slides
      //   ?.map((slide, index) => ({
      //     content: slide?.pageElements
      //       ?.map((element) =>
      //         element?.shape?.text?.textElements
      //           ?.map((textElement) => textElement?.textRun?.content)
      //           .filter(Boolean)
      //       )
      //       .filter(Boolean),
      //     slideNumber: index + 1,
      //   }))
      //   .filter(Boolean);

            const slides = response?.result?.slides || [];
            const data = slides.reduce((acc, slide, index) => {
              const pageElements = slide?.pageElements || [];
              const content = pageElements
                .reduce((acc, element) => {
                  const textElements = element?.shape?.text?.textElements || [];
                  return acc.concat(
                    textElements
                      .filter((textElement) => textElement?.textRun?.content)
                      .map((textElement) => textElement.textRun.content)
                  );
                }, [])
                .filter(Boolean);

              if (content.length) {
                acc.push({ content, slideNumber: index + 1 });
              }

              return acc;
            }, []);
   
      try {
        const res = await fetch("/api/slides", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ slideUrl, slidesData: data }),
        }).then((res) => res.json());
        if (res.url) {
          router.push(res.url);
          setIsloading(false);
        } else {
          setIsloading(false);
          toast.error(
            res?.error?.error?.message ||
              "Something went wrong. please try again"
          );
        }
      } catch (error) {
        setIsloading(false);
        toast.error("something went wrong. please try again");
        console.log(error, "error while creating assistant");
      } finally {
        setIsloading(false);
      }
    } catch (error) {
      setIsloading(false);
      toast.error(
        error?.result?.error?.message ||
          "Something went wrong. please try again"
      );
      console.log(error);
    } finally {
      setIsloading(false);
    }
  };

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
      <main className="flex min-h-screen w-full flex-col items-center justify-center bg-gray-100 px-4 py-12 dark:bg-gray-900">
        <div className="mx-auto w-full max-w-md space-y-6">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold tracking-tighter text-gray-900 dark:text-gray-50">
              Google Slides Q&A
            </h1>
            <p className="text-gray-500 font-medium dark:text-gray-400">
              Enter a Google Slides URL to start a chat-based Q&A session.
            </p>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <textarea
              name="slideUrl"
              {...register("slideUrl", {
                required: true,
                pattern:
                  /https:\/\/docs.google.com\/presentation\/d\/(?:e\/)?([^/]+)/,
              })}
              className="w-full p-2 rounded-md focus:outline-gray-200"
              placeholder="Enter Google Slides URL"
              type="url"
            />
            {errors?.slideUrl && (
              <p className="text-red-500">
                Please enter a valid google slide url
              </p>
            )}
            {isloading ? (
              <Button disabled className="w-full">
                Authorizing
                <LoaderCircle className="animate-spin mx-2" />
              </Button>
            ) : (
              <Button
                type="submit"
                className="w-full font-semibold"
              >
                Authorize
              </Button>
            )}
          </form>
        </div>
      </main>
    </>
  );
};

export default Authorize;
