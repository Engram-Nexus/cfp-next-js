import { Hono } from "hono";
import { handle } from "hono/vercel";
import { getRequestContext } from "@cloudflare/next-on-pages";
import { StreamingTextResponse } from "ai";
import { BASE_URL, ENGRAM_API_URL } from "@/constants";
import { drizzle } from "drizzle-orm/d1";
import {
  clientProfile,
  insertClientProfileSchema,
  insertVisitorSchema,
  visitor,
} from "@/db/schema/schema";
import { decrypt, encrypt } from "@/lib/jwt";
import { generateUUID } from "@/lib/utils";
import { eq } from "drizzle-orm";
import { runAssistant } from "./assistant/assistantApi";

export const runtime = "edge";

const app = new Hono<{
  Bindings: { NEXT_PUBLIC_BASE_URL: string; DB: D1Database };
}>().basePath("/api");

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

app.post("assistant", async (c) => {
  // parse the request body
  const input: {
    threadId: string | null;
    message: string;
    data:{
      [key:string]: any
    }
  } = await c.req.json();

  if (!input) {
    return c.json({ error: "No input provided" });
  }
  if (!input?.data?.assistantId) {
    return c.json({ error: "No assistantId provided" });
  }

  return runAssistant({...input, assistantId: input?.data?.assistantId});
});

// D1 database
app.post("register", async (c) => {
  try {
    const { companyName, description, linkedinUrl, logo, tagline, website } =
      (await c.req.json()) as {
        companyName: string;
        logo: string;
        description: string;
        tagline: string;
        website: string;
        linkedinUrl: string;
      };
    const Id = generateUUID();

    const payload = {
      Id,
      companyName,
      description,
      linkedinUrl,
      logo,
      tagline,
      website,
      dateCreated: Math.floor(Date.now() / 1000),
      logoR2:undefined
    };

    try {
      insertClientProfileSchema.parse(payload);
    } catch (error) {
      console.error(error);
      return c.json({ error: JSON.stringify(error), message : "failed to validate" });
    }

    const ENV = getRequestContext().env;
    const db = drizzle(ENV.DB);

    // await ENV.DB.prepare(
    //   "CREATE TABLE IF NOT EXISTS client-profiles (id TEXT PRIMARY KEY, dateCreated INTEGER, companyName TEXT, description TEXT, linkedinUrl TEXT, logo TEXT, tagline TEXT, website TEXT logoR2 TEXT)"
    // ).run();

    const inserted = await db.insert(clientProfile).values(payload).returning();

    console.log(`inserted: ${JSON.stringify(inserted)}`);

    return c.json({
      message: `Registered ${companyName}`,
      data: inserted,
    });
  } catch (error) {
    console.error(error);
    return c.json({ error: JSON.stringify(error), message: "failed to register" });
  }
});

app.post("visitor", async (c) => {
  try {
    const { email, messages, imageUrls, firstName, clientProfileId, colors, assistantId } =
      (await c.req.json()) as {
        email: string;
        messages: string[];
        imageUrls: string[];
        firstName: string;
        clientProfileId: string;
        colors: string[];
        assistantId: string;
      };

    const Id = generateUUID();
    const payload = {
      Id,
      email,
      messages,
      imageUrls,
      firstName,
      clientProfileId,
      colors,
      assistantId,
      dateCreated: Math.floor(Date.now() / 1000),
    };

    try {
      insertVisitorSchema.parse(payload);
    } catch (error) {
      console.error(error);
      return c.json({ error: error, message : "failed to validate" });
    }

    const ENV = getRequestContext().env;
    const db = drizzle(ENV.DB);

    await ENV.DB.prepare(
      "CREATE TABLE IF NOT EXISTS visitors (id TEXT PRIMARY KEY, dateCreated INTEGER, email TEXT, messages JSON, imageUrls JSON, firstName TEXT, clientProfileId TEXT, colors TEXT assistantId TEXT)"
    ).run();

    const result = await db.insert(visitor).values(payload).returning();
    const insertedId = result[0].Id;
    const token = await encrypt({ id: insertedId, clientProfileId });
    const url = BASE_URL + "/landing-page?token=" + token;
    return c.json({ url });
  } catch (error) {
    console.error(error);
    return c.json({ error: error, message: "failed to register new visitor" });
  }
});

app.get("visitor", async (c) => {
  try {
  const { token } = c.req.query();
  if (!token) {
    return c.json({ error: "No token provided" });
  }
  const decrypted = await decrypt(token);
  if (decrypted === null) {
    return c.json({ error: "Invalid token" });
  }
  const id = decrypted.id;
  const clientProfileId = decrypted.clientProfileId;
    const ENV = getRequestContext().env;
    const db = drizzle(ENV.DB);

    const result = await db.select().from(visitor).where(eq(visitor.Id, id)).all();
    const clientProfileData = await db.select().from(clientProfile).where(eq(clientProfile.Id, clientProfileId)).all();
    console.log("result", JSON.stringify(result));
    return c.json({ visitor: result[0], clientProfile: clientProfileData[0] });

  } catch (error) {
    console.error(error);
    return c.json({ error: error });
  }

})

app.get("client-profile", async (c) => {
  try {
    const ENV = getRequestContext().env;
    const db = drizzle(ENV.DB);

    const { token } = c.req.query();
    if (!token) {
      return c.json({ error: "No token provided" });
    }
    const decrypted = await decrypt(token);
    if (decrypted === null) {
      return c.json({ error: "Invalid token" });
    }
    const id = decrypted.id;

    const result = await db
      .select()
      .from(clientProfile)
      .where(eq(clientProfile.Id, id))
      .all();
    console.log("result", JSON.stringify(result));
    return c.json({ result:result[0], id });
  } catch (error) {
    console.error(error);
    return c.json({ error: error });
  }
});

export const GET = handle(app);
export const POST = handle(app);

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
