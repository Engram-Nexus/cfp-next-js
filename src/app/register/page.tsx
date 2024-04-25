"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";

const formSchema = z.object({
  companyName: z.string().min(1, { message: "Company Name is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  tagline: z.string().min(1, { message: "Tagline is required" }),
  website: z.string().min(1, { message: "Website is required" }),
  linkedinUrl: z.string().min(1, { message: "Linkedin Url is required" }),
  logo: z.string().min(1, { message: "Logo is required" }),
});

function RegisterPage() {
  const {toast} = useToast()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyName: "",
      description: "",
      tagline: "",
      website: "",
      linkedinUrl: "",
      logo: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    // #TODO : submit this info to the api
    fetch("/api/client-profile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data)
      toast({
        title:"Registered succefully."
      })
      })
      .catch((error) => console.error(error));
  }

  return (
    <div className="flex items-center justify-center">
      <Card className={cn("max-w-fit m-6 h-full")}>
        <CardHeader>
          <CardTitle className="text-2xl font-sans">Register</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div
                className="grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-8 xl:grid-cols-4 h-[65vh] overflow-y-auto"
                style={{
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                }}
              >
                <FormField
                  control={form.control}
                  name="companyName"
                  render={({ field }) => (
                    <FormItem className="col-span-4 mx-1">
                      <FormLabel>Company Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Engram Nexus" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="tagline"
                  render={({ field }) => (
                    <FormItem className="col-span-4 mx-1">
                      <FormLabel>Tagline</FormLabel>
                      <FormControl>
                        <Input placeholder="tagline" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="col-span-4 mx-1">
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Tell us a little bit about the company"
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="website"
                  render={({ field }) => (
                    <FormItem className="col-span-2 mx-1">
                      <FormLabel>Website</FormLabel>
                      <FormControl>
                        <Input placeholder="website" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="linkedinUrl"
                  render={({ field }) => (
                    <FormItem className="col-span-2 mx-1">
                      <FormLabel>Linkedin Url</FormLabel>
                      <FormControl>
                        <Input placeholder="linkedin url" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="logo"
                  render={({ field }) => (
                    <FormItem className="col-span-2 mx-1">
                      <FormLabel>Logo</FormLabel>
                      <FormControl>
                        <Input placeholder="logo" {...field} />
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

export default RegisterPage;
