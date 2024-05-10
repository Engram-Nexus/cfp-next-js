import { BASE_URL } from "@/constants";
import { decrypt, encrypt } from "@/lib/jwt";
import { Hono } from "hono";
import OpenAI from "openai";

const slidesControllerApi = new Hono();

slidesControllerApi.post("/", async (c) => {
  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    let { slidesData, assistantId ,  slideUrl } = await c.req.json<{
      slidesData: string[];
      assistantId?: string ;
      slideUrl: string;
    }>();

    if (!slidesData&&!slideUrl) {
      return c.json({ error: "Slides are required" }, { status: 400 });
    }

    const file = new File([JSON.stringify(slidesData)], "file.json", {
      type: "application/json",
    });


    const vectorStore = await openai.beta.vectorStores.create({
      name: "slides controller",
    });


    const res = await openai.beta.vectorStores.fileBatches.uploadAndPoll(
      vectorStore.id,
      {
        files: [file],
      }
    );

    if (!assistantId) {
      assistantId = (
        await openai.beta.assistants.create({
          model: "gpt-3.5-turbo",
          name: "google slides assistant",
            instructions:
            "read the data from slides document , and also send the slide number as a source of information",
          tool_resources: {
            file_search: {
              vector_store_ids: [vectorStore.id],
            },
          },
          tools: [
            {
              type: "file_search",
            },
          ],
        })
      ).id;
    } else {
      //here we are updating the assistant with the vector store
      await openai.beta.assistants.update(assistantId, {
        tool_resources: { file_search: { vector_store_ids: [vectorStore.id] } },
      });
    }
    const token = await encrypt({ assistantId, slideUrl });
    const url = BASE_URL+ "/slides?token=" + token;
    return c.json({ url }, { status: 200 });
  } catch (error) {
    console.log(error);
    return c.json({ error }, { status: 500 });
  }
});

slidesControllerApi.get("/", async (c) => {
  const { token } = c.req.query();
  if (!token) {
    return c.json({ error: "Token is required" }, { status: 400 });
  }
  const decodeData = await decrypt(token);
  return c.json({ decodeData }, { status: 200 });
});

export default slidesControllerApi;
