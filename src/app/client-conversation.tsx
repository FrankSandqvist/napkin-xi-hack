"use client";

import { useConversation } from "@11labs/react";
import { useChat, useCompletion } from "@ai-sdk/react";
import { useCallback, useState } from "react";

export function ClientConversation() {
  const conversation = useConversation({
    onConnect: () => console.log("Connected"),
    onDisconnect: () => console.log("Disconnected"),
    onMessage: (message: any) => console.log("Message:", message),
    onError: (error: any) => console.error("Error:", error),
  });

  const startConversation = useCallback(async () => {
    try {
      // Request microphone permission
      await navigator.mediaDevices.getUserMedia({ audio: true });

      // Start the conversation with your agent
      await conversation.startSession({
        agentId: "ZF0EjZxj04nFzA35uymt",
        clientTools: {
          calculate: ({ parameters }: any) => {
            console.log(parameters);
            const func = new Function("parameters", code)
            
            return func(JSON.parse(parameters));
          },
        },
        overrides: {
          agent: {
            prompt: {
              prompt: `You are a support agent named Eric. You can access the calculate tool to calculate prices for the customer.
              
The signature of the parameters of the calculate function is:
{
  width: number,
  height: number,
  supplierPrice: number,
  order: number
}`,
            },
          },
        },
      });
    } catch (error) {
      console.error("Failed to start conversation:", error);
    }
  }, [conversation]);

  const stopConversation = useCallback(async () => {
    await conversation.endSession();
  }, [conversation]);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex gap-2">
        <button
          onClick={startConversation}
          disabled={conversation.status === "connected"}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
        >
          Start Conversation
        </button>
        <button
          onClick={stopConversation}
          disabled={conversation.status !== "connected"}
          className="px-4 py-2 bg-red-500 text-white rounded disabled:bg-gray-300"
        >
          Stop Conversation
        </button>
      </div>
    </div>
  );
}

const code = `
const width = parameters.width;
const height = parameters.height;
const supplierPrice = parameters.supplierPrice;
const order = parameters.order;

const profitMargin = 2 * supplierPrice + 20;
const squareMeterPrice = supplierPrice + profitMargin;

let price = width * height * squareMeterPrice;

if (order > 10) {
    price = price - (price * 0.2); // apply twenty percent discount
}

return price;
`;
