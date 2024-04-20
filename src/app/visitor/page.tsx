"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import ColorPicker from "@/components/color-picker";
import TagInput from "@/components/tagInput";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { useCallback } from "react";

const formSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email("Invalid email"),
  firstName: z.string().min(1, { message: "First Name is required" }),
  assistantId: z.string().min(1, { message: "Assistant Id is required" }),
  imageUrls: z.array(z.string().min(1, { message: "Image Urls is required" })),
  messages: z.array(
    z.string().min(1, { message: "messages Urls is required" })
  ),
  clientProfileId: z
    .string()
    .min(36, { message: "Invalid clientProfileId" })
    .max(36, { message: "Invalid clientProfileId" }),
  colors: z.array(z.string().min(1, { message: "Colors are required" })),
});

function VisistorRegister() {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      imageUrls: undefined,
      messages: undefined,
      clientProfileId: "",
      email: "",
      colors: undefined,
      assistantId: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    // #TODO : submit this info to the api
    const payload = {
      email: values.email,
      firstName: values.firstName,
      imageUrls: values.imageUrls,
      messages: values.messages,
      clientProfileId: values.clientProfileId,
      colors: values.colors,
      assistantId: values.assistantId,
    };
    fetch("/api/visitor", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json() as Promise<{ url: string }>)
      .then((data) => {
        console.log(data);
        toast({
          title: "Visitor created succefully. here is the link",
          description: data?.url,
          duration: 6 * 60 * 1000,
        });
      })
      .catch((error) => console.error(error));
  }

  const setMessages = useCallback(
    (messages: string[] | undefined) => {
      if (messages === undefined) return;
      form.setValue("messages", messages);
    },
    [form]
  );
  const setImageUrls = useCallback(
    (imageUrls: string[] | undefined) => {
      if (imageUrls === undefined) return;
      form.setValue("imageUrls", imageUrls);
    },
    [form]
  );
  const setColors = useCallback(
    (colors: string[] | undefined) => {
      if (colors === undefined) return;
      form.setValue("colors", colors);
    },
    [form]
  );

  return (
    <div className="flex items-center justify-center">
      <Card className={cn("max-w-fit m-6 h-full")}>
        <CardHeader>
          <CardTitle className="text-2xl font-sans">Visitor</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div
                className="grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-8 xl:grid-cols-4 overflow-y-auto"
                style={{
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                }}
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2 col-span-4 mx-1">
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2 col-span-4 mx-1">
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input placeholder="first name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="clientProfileId"
                  render={({ field }) => (
                    <FormItem className="col-span-4 mx-1">
                      <FormLabel>Client Profile Id</FormLabel>
                      <FormControl>
                        <Input placeholder="clientProfileId" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="assistantId"
                  render={({ field }) => (
                    <FormItem className="col-span-4 mx-1">
                      <FormLabel>Assistant Id</FormLabel>
                      <FormControl>
                        <Input placeholder="assistant id...." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="imageUrls"
                  render={({ field }) => (
                    <FormItem className="col-span-4 mx-1">
                      <FormLabel>Images Urls</FormLabel>
                      <FormControl>
                        <TagInput
                          placeholder="Image urls"
                          className="resize-none"
                          {...field}
                          setVal={setImageUrls}
                        />
                      </FormControl>
                      <FormDescription>
                        You can separate urls with a return.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="messages"
                  render={({ field }) => (
                    <FormItem className="col-span-4 mx-1">
                      <FormLabel>Messages</FormLabel>
                      <FormControl>
                        <TagInput
                          placeholder="Messages"
                          className="resize-none"
                          {...field}
                          setVal={setMessages}
                        />
                      </FormControl>
                      <FormDescription>
                        You can separate messages with a return.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="colors"
                  render={({ field }) => (
                    <FormItem className="col-span-3 mx-1">
                      <FormControl>
                        <ColorPicker setColors={setColors} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button type="submit">Submit</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
export default VisistorRegister;
