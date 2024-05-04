import { Hono } from "hono";

const fileUploadApi = new Hono();

fileUploadApi.post('/', async (c) => {
  const body = await c.req.parseBody()
  console.log(body['file']) // File | string
  console.log(body['assistantId'])
  return c.json({file:body['file']})
})
export default fileUploadApi