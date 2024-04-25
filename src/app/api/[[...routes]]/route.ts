import { BASE_URL, ENGRAM_API_URL } from "@/constants";
import {
  clientProfile,
  insertClientProfileSchema,
  insertVisitorSchema,
  visitor,
} from "@/db/schema/schema";
import { decrypt, encrypt } from "@/lib/jwt";
import { generateUUID } from "@/lib/utils";
import { getRequestContext } from "@cloudflare/next-on-pages";
import { StreamingTextResponse } from "ai";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import { Hono } from "hono";
import { handle } from "hono/vercel";
import OpenAI from "openai";
import { runAssistant } from "./lib/assistant/assistantApi";
import clientProfileApi from "./clientProfile";
import visitorApi from "./visitor";
import chats from "./chats";
import assistantApi from "./assistant";

export const runtime = "edge";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
const app = new Hono<{
  Bindings: { NEXT_PUBLIC_BASE_URL: string; DB: D1Database };
}>().basePath("/api");

app.route("/visitor", visitorApi)
app.route("/chat",chats)
app.route("/client-profile", clientProfileApi)
app.route("/assistant", assistantApi)

app.get("/hello", (c) => {
  const ENV = getRequestContext().env;
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



// D1 database


export const GET = handle(app);
export const POST = handle(app);

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
