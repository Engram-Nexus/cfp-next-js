
import { getRequestContext } from "@cloudflare/next-on-pages";
import { Hono } from "hono";
import { handle } from "hono/vercel";
import clientProfileApi from "./clientProfile";
import visitorApi from "./visitor";
import chats from "./chats";
import assistantApi from "./assistant";
import leadsApi from "./leads";

export const runtime = "edge";

const app = new Hono<{
  Bindings: { NEXT_PUBLIC_BASE_URL: string; DB: D1Database };
}>().basePath("/api");

app.route("/visitor", visitorApi)
app.route("/chat",chats)
app.route("/client-profile", clientProfileApi)
app.route("/assistant", assistantApi)
app.route("/leads", leadsApi)

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
