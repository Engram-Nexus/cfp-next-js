import { Hono } from "hono";
import { runAssistant } from "../lib/assistant/assistantApi";

const assistantApi = new Hono();
assistantApi.post("/", async (c) => {
    // parse the request body
    const input: {
      threadId: string | null;
      message: string;
      data: {
        [key: string]: any;
      };
    } = await c.req.json();
  
    if (!input) {
      return c.json({ error: "No input provided" });
    }
    if (!input?.data?.assistantId) {
      return c.json({ error: "No assistantId provided" });
    }
    return runAssistant({
      ...input,
      assistantId: input?.data?.assistantId,
      threadId: input?.data?.threadId ? input?.data?.threadId : null,
    });
  });
  export default assistantApi