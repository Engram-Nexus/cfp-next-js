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
import { Input } from "./ui/input";

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
          });
          setIsloading(false);
          throw resp;
        }
        await listSlides(slideUrl);
      },
      error_callback: (error) => {
        console.log(error);
        if (error) {
          console.log("popup closed");
          toast({
            title: "Error",
            description: error.message || "Authorization failed. Try again",
            variant: "destructive",
            className: "bg-red-500",
          });
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
      <main className="flex min-h-screen w-full flex-col items-center justify-center bg-gray-100 px-4 py-12 dark:bg-gray-900">
        <div className="mx-auto w-full max-w-md space-y-6">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold tracking-tighter text-gray-900 dark:text-gray-50">
              Google Slides Q&A
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
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
                <LoaderCircle className="animate-spin" />
              </Button>
            ) : (
              <Button
                type="submit"
                className="w-full"
                // onClick={handleAuthClick}
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

export default Slides;
