import { ENGRAM_API_URL } from "@/constants";
import { getRequestContext } from "@cloudflare/next-on-pages";
import { StreamingTextResponse } from "ai";
import { Hono } from "hono";
import OpenAI from "openai";

const chats = new Hono()

chats.get("/history", async (c) => {
    const { threadId } = c.req.query();
    const ENV = getRequestContext().env;
    try {
      const openAI = new OpenAI({
        apiKey: ENV.OPENAI_API_KEY,
      });
      if (!threadId) {
        return c.json({ error: "No threadId provided" }, 403);
      }
      const messages = await openAI.beta.threads.messages.list(threadId, {
        order: "asc",
      });
  
      return c.json({ messages });
    } catch (error) {
      console.error(error);
      return c.json({ error: error }, 500);
    }
  });

  chats.post("/", async (c) => {
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
  

  export default chats