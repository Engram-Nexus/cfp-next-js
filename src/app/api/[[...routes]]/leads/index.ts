import { insertLeadsSchema, leads } from "@/db/schema/schema";
import { getRequestContext } from "@cloudflare/next-on-pages";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import { Hono } from "hono";

const leadsApi = new Hono();
leadsApi.post("/", async (c) => {
  try {
    const {
      Id,
      dateCreated,
      firstName,
      lastName,
      email,
      linkedinUrl,
      campaignId,
      linkedinRawProfileId,
    } = (await c.req.json()) as {
      Id: string;
      dateCreated: number;
      firstName: string;
      lastName: string;
      email: string;
      linkedinUrl: string;
      campaignId: string;
      linkedinRawProfileId: string;
    };
    const payload = {
      Id,
      dateCreated,
      firstName,
      lastName,
      email,
      linkedinUrl,
      campaignId,
      linkedinRawProfileId,
    };
    try {
      insertLeadsSchema.parse(payload);
    } catch (error) {
      console.error(error);
      return c.json({ error: error, message: "failed to validate" }, 403);
    }
    const ENV = getRequestContext().env;
    const db = drizzle(ENV.DB);
    await ENV.DB.prepare(
      "CREATE TABLE IF NOT EXISTS leads (id TEXT PRIMARY KEY, firstName TEXT, lastName TEXT, email TEXT, linkedinUrl TEXT, description TEXT, linkedinUrl TEXT, campaignId TEXT, linkedinRawProfileId TEXT)"
    ).run();
    const inserted = await db.insert(leads).values(payload).returning();
    return c.json({ message: "success", data: inserted });
  } catch (error: any) {
    console.error("error", error);
    return c.json({ error: error?.message }, 500);
  }
});

leadsApi.post("/bulk", async (c) => {
  try {
    const body = (await c.req.json()) as [
      {
        Id: string;
        dateCreated: number;
        firstName: string;
        lastName: string;
        email: string;
        linkedinUrl: string;
        campaignId: string;
        linkedinRawProfileId: string;
      }
    ];

    try {
      body.forEach((element) => {
        insertLeadsSchema.parse(element);
      });
    } catch (error) {
      console.error(error);
      return c.json({ error: error, message: "failed to validate" }, 403);
    }
    const ENV = getRequestContext().env;
    const db = drizzle(ENV.DB);
    await ENV.DB.prepare(
      "CREATE TABLE IF NOT EXISTS leads (id TEXT PRIMARY KEY, firstName TEXT, lastName TEXT, email TEXT, linkedinUrl TEXT, description TEXT, linkedinUrl TEXT, campaignId TEXT, linkedinRawProfileId TEXT)"
    ).run();
    const inserted = await db.insert(leads).values(body).returning();
    return c.json({ message: "success", data: inserted });
  } catch (error: any) {
    console.error("error", error);
    return c.json({ error: error?.message }, 500);
  }
});
leadsApi.get("/", async (c) => {
  try {
    const ENV = getRequestContext().env;
    const db = drizzle(ENV.DB);
    const { leadid } = c.req.query();
    if (!leadid) {
      return c.json({ error: "No leadid provided" }, 400);
    }
    const result = await db.select().from(leads).where(eq(leads.Id, leadid));
    return c.json({ result: result[0] });
  } catch (error: any) {
    return c.json({ error: error?.message }, 500);
  }
});

export default leadsApi;
