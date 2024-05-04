import { decrypt, encrypt } from "@/lib/jwt";
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
      slideUrl?: string;
    }>();

    let file = body["file"];
    let assistantId = body["assistantId"];
    let slideUrl = body["slideUrl"];
    const filePath = body["filePath"];

    if (!filePath && !file && !slideUrl) {
      return c.json({ error: "File Path is required" }, { status: 400 });
    }
    if (slideUrl) {
      const match = slideUrl.match(/\/d\/(?:e\/)?([^/]+)/);
      if (match) {
        try {
          const presentationId = match[1];
          const reposnse = await fetch("http://localhost:3000/api/slides", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              presentationId,
            }),
          });
          let data = (await reposnse.json() as { data: any }).data;
          data={...data,slides:data.slides.map((s:string[],idx:number)=>({...s,slideNumber:idx+1}))}
          file = new File([JSON.stringify(data)], "file.json", {
            type: "application/json",
          });
        } catch (err) {
          console.log(err);
        }
        //  .then((res) => res.json() ).catch((err) => console.log(err))
      } else {
        return Response.json(
          { error: "Unable to extract presentation ID from the slide URL" },
          { status: 400 }
        );
      }
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
          instructions: "read the data from the slides and also send the source of the data to the user as a slide number in json format, slide number is mandatory and it start from 0 so add 1 to the slide number",
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
    const url = "http://localhost:3001" + "/slides-controller?token=" + token;
    return c.json({ url }, { status: 200 });
  } catch (error) {
    console.error(error);
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
