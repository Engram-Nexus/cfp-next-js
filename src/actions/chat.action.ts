"use server";

import { BASE_URL } from "@/constants";
import { Message } from "ai";

export const chatAction = async function getChatResponse(messages: Omit<Message, "id">[]) {
  const url = BASE_URL + "/api/chat";
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messages,
    }),
  });
  return response;
};
