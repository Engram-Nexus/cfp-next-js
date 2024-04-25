import { BASE_URL } from "@/constants";
import {
  clientProfile,
  insertVisitorSchema,
  visitor,
} from "@/db/schema/schema";
import { decrypt, encrypt } from "@/lib/jwt";
import { generateUUID } from "@/lib/utils";
import { getRequestContext } from "@cloudflare/next-on-pages";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import { Hono } from "hono";
import OpenAI from "openai";

const visitorApi = new Hono();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

visitorApi.post("/", async (c) => {
  try {
    const {
      email,
      messages,
      imageUrls,
      firstName,
      clientProfileId,
      colors,
      assistantId,
      welcomeMessage,
    } = (await c.req.json()) as {
      email: string;
      messages: string[];
      imageUrls: string[];
      firstName: string;
      clientProfileId: string;
      colors: string[];
      assistantId: string;
      welcomeMessage: string;
    };

    const Id = generateUUID();
    const threadId = (await openai.beta.threads.create({})).id;

    const payload = {
      Id,
      email,
      messages,
      imageUrls,
      firstName,
      clientProfileId,
      colors,
      assistantId,
      threadId: threadId,
      welcomeMessage,
      dateCreated: Math.floor(Date.now() / 1000),
    };

    try {
      insertVisitorSchema.parse(payload);
    } catch (error) {
      console.error(error);
      return c.json({ error: error, message: "failed to validate" }, 403);
    }

    const ENV = getRequestContext().env;
    const db = drizzle(ENV.DB);
    // const db = drizzle(c.env.DB);
    await ENV.DB.prepare(
      "CREATE TABLE IF NOT EXISTS visitors (id TEXT PRIMARY KEY, dateCreated INTEGER, email TEXT, messages JSON, imageUrls JSON, firstName TEXT, clientProfileId TEXT, colors TEXT, assistantId TEXT, threadId TEXT, welcomeMessage TEXT)"
    ).run();

    const result = await db.insert(visitor).values(payload).returning();
    const insertedId = result[0].Id;
    const token = await encrypt({ id: insertedId, clientProfileId });
    const url = BASE_URL + "/landing-page?token=" + token;
    return c.json({ url });
  } catch (error) {
    console.error(error);
    return c.json(
      { error: error, message: "failed to register new visitor" },
      500
    );
  }
});
visitorApi.get("/", async (c) => {
  try {
    const { token } = c.req.query();
    if (!token) {
      return c.json({ error: "No token provided" }, 400);
    }
    const decrypted = await decrypt(token);
    if (decrypted === null) {
      return c.json({ error: "Invalid token" }, 400);
    }
    const id = decrypted.id;
    const clientProfileId = decrypted.clientProfileId;
    const ENV = getRequestContext().env;
    const db = drizzle(ENV.DB);
    // const db = drizzle(c.env.DB);

    const result = await db
      .select()
      .from(visitor)
      .where(eq(visitor.Id, id))
      .all();
    const clientProfileData = await db
      .select()
      .from(clientProfile)
      .where(eq(clientProfile.Id, clientProfileId))
      .all();
    console.log("result", JSON.stringify(result));
    return c.json({ visitor: result[0], clientProfile: clientProfileData[0] });
  } catch (error) {
    console.error(error);
    return c.json({ error: error }, 500);
  }
});

export default visitorApi;
