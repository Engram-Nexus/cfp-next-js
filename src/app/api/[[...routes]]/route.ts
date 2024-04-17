import { Hono } from "hono";
import { handle } from "hono/vercel";
import { getRequestContext } from "@cloudflare/next-on-pages";
import { StreamingTextResponse } from "ai";
import { BASE_URL, ENGRAM_API_URL } from "@/constants";
import { drizzle } from "drizzle-orm/d1";
import { clientProfile, customers } from "@/db/schema/schema";
import { decrypt, encrypt } from "@/lib/jwt";
import { generateUUID } from "@/lib/utils";
import { eq } from "drizzle-orm";
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

// app.get("d1", async (c) => {
//   const ENV = getRequestContext().env;
//   console.log("ENV", ENV);
//   console.log("DB", c.env.DB);
//   try {
//     const { results } = await ENV.DB.prepare("SELECT * FROM 'client-profiles'").all();
//     console.log("result", results);
//     return c.json({ results });
//   } catch (error) {
//     console.error(error);
//     return c.json({ error: error });
//   }
// });

// app.get("d3", async (c) => {
//   const ENV = getRequestContext().env;
//   console.log("ENV", ENV);
//   console.log("DB", c.env.DB);
//   try {
//     const db = drizzle(ENV.DB);
//     const result = await db.select().from(clientProfile).all();
//     console.log("result", result);
//     return c.json({ result });
//   } catch (error) {
//     console.error(error);
//     return c.json({ error: error });
//   }
// });

// app.post("register/d1", async (c) => {
//   try {
//     const ENV = getRequestContext().env;
//     const { firstName, imageUrls, messages } = (await c.req.json()) as {
//       firstName: string;
//       messages: string[];
//       imageUrls: string[];
//     };
//     console.log(`Registering ${firstName}`);
//     console.log(`imageUrls: ${JSON.stringify(imageUrls)}`);
//     console.log(`messages: ${JSON.stringify(messages)}`);
//     const id = generateUUID();
//     const inserted = await ENV.DB.prepare(
//       "INSERT INTO 'client-profiles' (id, companyName, logo, description, tagline, website, linkedinUrl) VALUES (?, ?, ?, ?, ?, ?)"
//     )
//       .bind(id, firstName, imageUrls[0], messages[0], messages[1], messages[2], messages[3])
//       .all();
//     // const inserted = await ENV.DB.prepare("SELECT * FROM 'client-profiles'").all();

//     console.log(`inserted: ${JSON.stringify(inserted)}`);
//     const token = await encrypt({ id });
//     console.log(`session token: ${token}`);
//     const url = "/user?token=" + token;

//     return c.json({ message: `Registered ${firstName}`, inserted, url });
//   } catch (error) {
//     console.error(error);
//     return c.json({ error: error });
//   }
// });

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

    const ENV = getRequestContext().env;
    const db = drizzle(ENV.DB);
    const Id = generateUUID();

    const inserted = await db
      .insert(clientProfile)
      .values({
        Id,
        companyName,
        description,
        linkedinUrl,
        logo,
        tagline,
        website,
      })
      .returning();

    console.log(`inserted: ${JSON.stringify(inserted)}`);
    const insertedId = inserted[0].Id;
    const token = await encrypt({ id: insertedId });
    const url = BASE_URL + "/user?token=" + token;

    return c.json({
      message: `Registered ${companyName}`,
      data: inserted,
      url,
    });
  } catch (error) {
    console.error(error);
    return c.json({ error: error });
  }
});

app.get("client-profile", async (c) => {
  try {
    const ENV = getRequestContext().env;
    const db = drizzle(ENV.DB);

    const { token } = c.req.query();
    const decrypted = await decrypt(token);
    const id = decrypted.id;

    const result = await db
      .select()
      .from(clientProfile)
      .where(eq(clientProfile.Id, id))
      .all();
    console.log("result", result);
    return c.json({ result, id });
  } catch (error) {
    console.error(error);
    return c.json({ error: error });
  }
});

export const GET = handle(app);
export const POST = handle(app);

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
