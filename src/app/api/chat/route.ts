import type { NextRequest } from "next/server";
import { getRequestContext } from "@cloudflare/next-on-pages";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { ENGRAM_API_URL } from "@/constants";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  let responseText = "Hello World";

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

  return new Response(responseText);
}

export async function POST(request: NextRequest) {
  const { messages } = (await request.json()) as { messages: string[] };

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
}
