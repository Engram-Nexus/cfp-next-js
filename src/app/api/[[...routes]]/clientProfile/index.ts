import { clientProfile, insertClientProfileSchema } from "@/db/schema/schema";
import { decrypt } from "@/lib/jwt";
import { generateUUID } from "@/lib/utils";
import { getRequestContext } from "@cloudflare/next-on-pages";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import { Hono } from "hono";
import { ZodError } from "zod";

const clientProfileApi = new Hono();
clientProfileApi.get("/", async (c) => {
  try {
    const ENV = getRequestContext().env;
    const db = drizzle(ENV.DB1);

    const { token } = c.req.query();
    if (!token) {
      return c.json({ error: "No token provided" }, 400);
    }
    const decrypted = await decrypt(token);
    if (decrypted === null) {
      return c.json({ error: "Invalid token" }, 400);
    }
    const id = decrypted.id;

    const result = await db
      .select()
      .from(clientProfile)
      .where(eq(clientProfile.Id, id))
      .all();
    console.log("result", JSON.stringify(result));
    return c.json({ result: result[0], id });
  } catch (error: any) {
    console.error(error);
    return c.json(
      { error: error?.message, message: "failed to get client profile" },
      500
    );
  }
});
clientProfileApi.post("/", async (c) => {
  try {
    const {
      companyName,
      description,
      linkedinUrl,
      logo,
      tagline,
      website,
      logoR2,
    } = await c.req.json<{
      companyName: string;
      logo: string;
      description: string;
      tagline: string;
      website: string;
      linkedinUrl: string;
      logoR2: string;
    }>();

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
      logoR2,
    };

    try {
      insertClientProfileSchema.parse(payload);
    } catch (error) {
      if (error instanceof ZodError) {
        let errors: string[] = [];
        error.issues.forEach((issue) => {
          errors.push(issue.message);
        });
        console.error(errors);
        return c.json(
          {
            error: errors,
            message: "failed to validate",
          },
          403
        );
      }
    }

    const ENV = getRequestContext().env;
    const db = drizzle(ENV.DB1);

    // await ENV.DB1.prepare(
    //   "CREATE TABLE IF NOT EXISTS client-profiles (id TEXT PRIMARY KEY, dateCreated INTEGER, companyName TEXT, description TEXT, linkedinUrl TEXT, logo TEXT, tagline TEXT, website TEXT logoR2 TEXT)"
    // ).run();

    const inserted = await db.insert(clientProfile).values(payload).returning();

    console.log(`inserted: ${JSON.stringify(inserted)}`);

    return c.json({
      message: `Registered ${companyName}`,
      data: inserted,
    });
  } catch (error: any) {
    console.error(error);
    return c.json(
      {
        error: error.message,
        message: "failed to register",
      },
      500
    );
  }
});

export default clientProfileApi;
