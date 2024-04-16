import { Hono } from "hono";
import { handle } from "hono/vercel";
import { getRequestContext } from "@cloudflare/next-on-pages";
import { Environment } from "@/types";
import { StreamingTextResponse } from "ai";
import { ENGRAM_API_URL } from "@/constants";
// In the edge runtime you can use Bindings that are available in your application
// (for more details see:
//    - https://developers.cloudflare.com/pages/framework-guides/deploy-a-nextjs-site/#use-bindings-in-your-nextjs-application
//    - https://developers.cloudflare.com/pages/functions/bindings/
// )
//
// KV Example:
// const myKv = getRequestContext().env.MY_KV_NAMESPACE
// await myKv.put('suffix', ' from a KV store!')
// const suffix = await myKv.get('suffix')
// responseText += suffix

export const runtime = "edge";

const app = new Hono<{ Bindings: { NEXT_PUBLIC_BASE_URL: string } }>().basePath("/api");

app.get("/hello", (c) => {
  const ENV = getRequestContext().env as Environment;
  const BASE_URL = ENV?.NEXT_PUBLIC_BASE_URL || "https://example.com";
  return c.json({
    message: "Hello Next.js!",
    base_url: BASE_URL,
    env: ENV,
  });
});

app.post("time", async (c) => {
  const body = (await c.req.json()) as { time: string };
  const time = parseInt(body?.time) || 0;
  console.log(`running timeout for ${time} seconds`);

  await wait(time * 1000);

  return c.json({ message: `success after waiting for ${time} seconds` });
});

app.post("chat", async (c) => {
  const { messages } = (await c.req.json()) as { messages: string[] };

  const response = (await fetch(ENGRAM_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      type: "prompt",
      message: messages,
    }),
    // casting this type as HONO returns the body as a ReadableStream
  })) as { body: ReadableStream<Uint8Array> };

  return new StreamingTextResponse(response.body);
});

export const GET = handle(app);
export const POST = handle(app);

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
