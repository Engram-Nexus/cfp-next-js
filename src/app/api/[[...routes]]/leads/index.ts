import { insertLeadsSchema, leads, visitor } from "@/db/schema/schema";
import { generateUUID } from "@/lib/utils";
import { getRequestContext } from "@cloudflare/next-on-pages";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import { Hono } from "hono";
import { ZodError } from "zod";

const leadsApi = new Hono();
leadsApi.post("/", async (c) => {
  try {
    const {
      firstName,
      lastName,
      email,
      linkedinUrl,
      campaignId,
      linkedinRawProfileId,
    } = await c.req.json<{
      firstName: string;
      lastName: string;
      email: string;
      linkedinUrl: string;
      campaignId: string;
      linkedinRawProfileId: string;
    }>();

    const payload = {
      Id: generateUUID(),
      dateCreated: Math.floor(Date.now() / 1000),
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
      if (error instanceof ZodError) {
        let errors: string[] = [];
        error.issues.forEach((issue) => {
          errors.push(issue.message);
        });
        console.error(errors);
        return c.json({ error: errors, message: "failed to validate" }, 403);
      }
    }
    const ENV = getRequestContext().env;
    const db = drizzle(ENV.DB2);
    await ENV.DB2.prepare(
      "CREATE TABLE IF NOT EXISTS leads (id TEXT PRIMARY KEY, firstName TEXT, lastName TEXT, email TEXT, linkedinUrl TEXT, campaignId TEXT, linkedinRawProfileId TEXT, dateCreated INTEGER)"
    ).run();
    const inserted = await db.insert(leads).values(payload).returning();
    return c.json({ message: "success", data: inserted });
  } catch (error: any) {
    console.error("error", error);
    return c.json(
      { error: error?.message, message: "failed to create new lead" },
      500
    );
  }
});

leadsApi.post("/bulk", async (c) => {
  try {
    const body = await c.req.json<
      {
        firstName: string;
        lastName: string;
        email: string;
        linkedinUrl: string;
        campaignId: string;
        linkedinRawProfileId: string;
      }[]
    >();

    const payload = body.map((element) => ({
      ...element,
      Id: generateUUID(),
      dateCreated: Math.floor(Date.now() / 1000),
    }));

    try {
      payload.forEach((element) => {
        insertLeadsSchema.parse(element);
      });
    } catch (error) {
      if (error instanceof ZodError) {
        let errors: string[] = [];
        error.issues.forEach((issue) => {
          errors.push(issue.message);
        });
        console.error(errors);
        return c.json({ error: errors, message: "failed to validate" }, 403);
      }
    }
    const ENV = getRequestContext().env;
    const db = drizzle(ENV.DB2);
    await ENV.DB2.prepare(
      "CREATE TABLE IF NOT EXISTS leads (id TEXT PRIMARY KEY, firstName TEXT, lastName TEXT, email TEXT, linkedinUrl TEXT, campaignId TEXT, linkedinRawProfileId TEXT, dateCreated INTEGER)"
    ).run();
    const inserted = await db.insert(leads).values(payload).returning();
    return c.json({ message: "success", data: inserted });
  } catch (error: any) {
    console.error("error", error);
    return c.json(
      { error: error?.message, message: "failed to create new leads" },
      500
    );
  }
});
leadsApi.get("/", async (c) => {
  try {
    const ENV = getRequestContext().env;
    const db = drizzle(ENV.DB2);
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

// Get leads by column value
leadsApi.post("/lead-by-column-value", async (c) => {
  try {
    const columnValue = await c.req.json<{ [key: string]: any }>();
    const ENV = getRequestContext().env;
    const db = drizzle(ENV.DB2);

    if (!Object.keys(columnValue)) {
      return c.json({ error: "Column name or value not provided" }, 400);
    }
    const columnName = Object.keys(columnValue)[0] as keyof typeof leads;

    type LeadsKeys = keyof typeof leads;
    const leadsKeys = Object.keys(leads) as LeadsKeys[];

    if (!leadsKeys.includes(columnName)) {
      return c.json({ error: "Column name not found" }, 400);
    }

    const result = await db
      .select()
      .from(leads)
      // @ts-ignore
      .where(eq(leads[columnName], columnValue[columnName]));
    // get the email address from the result
const email = result[0]?.email
    // identify the visitor by email
    // get the threadId from that visitor

    const threadId = await db.select().from(visitor).where(eq(visitor.email, email));
    

    // get all the chat hhistory using threadId and send it in the response
    return c.json({ result: result });
  } catch (error: any) {
    return c.json({ error: error?.message }, 500);
  }
});

leadsApi.put("/update", async (c) => {
  try {
    const { leadid } = c.req.query();
    const {
      firstName,
      lastName,
      email,
      linkedinUrl,
      campaignId,
      linkedinRawProfileId,
    } = await c.req.json<{
      firstName: string;
      lastName: string;
      email: string;
      linkedinUrl: string;
      campaignId: string;
      linkedinRawProfileId: string;
    }>();
    if (!leadid) {
      return c.json({ error: "No leadid provided" }, 400);
    }
    const payload = {
      dateCreated: Math.floor(Date.now() / 1000),
      firstName,
      lastName,
      email,
      linkedinUrl,
      campaignId,
      linkedinRawProfileId,
    };
    try {
      insertLeadsSchema.partial().parse(payload);
    } catch (error) {
      return c.json({ error: "Failed to validate data" }, 400);
    }
    const ENV = getRequestContext().env;
    const db = drizzle(ENV.DB2);

    const result = await db
      .update(leads)
      .set({
        firstName: firstName,
        lastName: lastName,
        email: email,
        linkedinUrl: linkedinUrl,
        campaignId: campaignId,
      })
      .where(eq(leads.Id, leadid))
      .returning();
    return c.json({ message: "success", data: result });
  } catch (error: any) {
    return c.json({ error: error?.message }, 500);
  }
});

export default leadsApi;
