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
    return c.json({ error: "No input provided" }, 400);
  }
  if (!input?.data?.assistantId) {
    return c.json({ error: "No assistantId provided" }, 400);
  }
  return runAssistant({
    ...input,
    message: input?.data?.sendSlideNumber ?  input.message + "Given a presentation slide and a question, provide the relevant information along with the slide number in JSON format: {slideNumber: number}. Additionally, provide the same information in a normal format.": input.message,
    assistantId: input?.data?.assistantId,
    threadId: input?.data?.threadId ? input?.data?.threadId : null,
  });
});
export default assistantApi;
