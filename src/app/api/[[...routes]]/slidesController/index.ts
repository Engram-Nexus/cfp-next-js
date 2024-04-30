import { Hono } from "hono";
const slidesControllerApi = new Hono();

slidesControllerApi.post("/custom-channel", async (c) => {
    
})

export default slidesControllerApi