"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
import { cn } from "@/lib/utils";
import { useState } from "react";

const formSchema = z.object({
  firstName: z.string().min(1, { message: "First Name is required" }),
  imageUrls: z.string(),
  messages: z.string(),
//   colors: z.array(z.string()),
});

function VisistorRegister(){
    const [messages,setMessages] = useState<string>("");
    const [imageUrls,setImageUrls] = useState<string>("");

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          firstName: "",
          imageUrls: "",
          messages: "",
        },
      });

    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log("messages",messages);
        console.log("imageUrls",imageUrls);
        console.log(values);
        // #TODO : submit this info to the api
      }

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
                    name="firstName"
                    render={({ field }) => (
                      <FormItem className="col-span-2 mx-1">
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
                    name="imageUrls"
                    render={({ field }) => (
                      <FormItem className="col-span-4 mx-1">
                        <FormLabel>Images Urls</FormLabel>
                        <FormControl>
                        <TagInput
                            placeholder="Messages"
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
                </div>
                <Button type="submit">Submit</Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    )
}
export default VisistorRegister