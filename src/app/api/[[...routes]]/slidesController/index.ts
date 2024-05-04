import { Hono } from "hono";
import OpenAI from "openai";

const slidesControllerApi = new Hono();

slidesControllerApi.post("/", async (c) => {
  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    const body = await c.req.parseBody<{
      file?: File;
      assistantId?: string;
      filePath?: string;
      prompt?: string;
    }>();

    let file = body["file"];
    let assistantId = body["assistantId"];
    const filePath = body["filePath"];

    if (!filePath && !file) {
      return c.json({ error: "File Path is required" }, { status: 400 });
    }
    
    if (filePath && !file) {
      // here we are creating a file from the filePath
      const response = await fetch(filePath);
      const data = await response.blob();
      file = new File([data], "file.json");
    }
    const vectorStore = await openai.beta.vectorStores.create({
      name: "slides controller",
    });

    if (!file) {
      return c.json({ error: "File Path is required" }, { status: 400 });
    }

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
          name: "slides controller new",
          instructions: "read the data from the slides",
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
    return c.json({ assistantId });
  } catch (error) {
    console.error(error);
    return c.json({ error}, { status: 500 });
  }
});

export default slidesControllerApi;
