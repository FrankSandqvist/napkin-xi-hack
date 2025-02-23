"use client";

import { productSchema } from "@/schemas/product";
import { FakeDB } from "@/utils/fake-db";
import { useConversation } from "@11labs/react";
import dynamic from "next/dynamic";
import { useCallback, useState } from "react";
import { z } from "zod";

export const ClientConversation = dynamic(
  () =>
    Promise.resolve(() => {
      const [products] = useState<Array<z.infer<typeof productSchema>>>(
        FakeDB.listProducts()
      );

      const conversation = useConversation({
        onConnect: () => console.log("Connected"),
        onDisconnect: () => console.log("Disconnected"),
        onMessage: (message: any) => console.log("Message:", message),
        onError: (error: any) => console.error("Error:", error),
      });

      const startConversation = useCallback(async () => {
        console.log(`You are a support agent named Eric. 

You can access the calculate tool to calculate prices for the customer, when you have everything you need.

Here are the products, and what parameters gather from the customer.
${products.map(
  (product, idx) =>
    `${idx}. ${product.productName}
${product.signature.map(
  (signature) => `${signature.name}: ${signature.type}
`
)}
`
)}
`);

        try {
          // Request microphone permission
          await navigator.mediaDevices.getUserMedia({ audio: true });

          // Start the conversation with your agent
          await conversation.startSession({
            agentId: "ZF0EjZxj04nFzA35uymt",
            clientTools: {
              calculate: ({ params, productIdx }: any) => {
                console.log(params, productIdx);
                const code = JSON.parse(localStorage.getItem("products")!)[
                  productIdx
                ].code;
                const func = new Function("params", code);

                return func(JSON.parse(params));
              },
            },
            overrides: {
              agent: {
                prompt: {
                  prompt: `You are a support agent named Eric. 

You can access the calculate tool to calculate prices for the customer, when you have everything you need.

Here are the products, and what parameters gather from the customer.
${products
  .map(
    (product, idx) =>
      `${idx}. ${product.productName}
${product.signature
  .map((signature) => `${signature.name}: ${signature.type}`)
  .join("\n")}`
  )
  .join("\n")}
`,
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
        <div className="absolute flex flex-col items-center gap-4 left-0 right-0 bottom-0">
          <div className="w-[26rem] flex items-end justify-center gap-2 from-transparent to-white bg-gradient-to-b h-32">
            <button
              onClick={
                conversation.status === "disconnected"
                  ? startConversation
                  : stopConversation
              }
              className="px-4 py-2 bg-black text-white"
            >
              {conversation.status === "disconnected"
                ? "Test Customer Conversation"
                : "End Conversation"}
            </button>
          </div>
        </div>
      );
    }),
  {
    ssr: false,
  }
);
