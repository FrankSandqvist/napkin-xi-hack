"use client";

import { FakeDB } from "@/utils/fake-db";
import { useConversation } from "@11labs/react";
import { Phone, PhoneOff } from "lucide-react";
import dynamic from "next/dynamic";
import { useCallback } from "react";

export const ClientConversation = dynamic(
  () =>
    Promise.resolve(() => {
      const conversation = useConversation({
        onConnect: () => console.log("Connected"),
        onDisconnect: () => console.log("Disconnected"),
        onMessage: (message: any) => console.log("Message:", message),
        onError: (error: any) => console.error("Error:", error),
      });

      const startConversation = useCallback(async () => {
        const products = FakeDB.listProducts();

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
        <>
          <div
            className={`fixed w-full h-full duration-500 bg-white/50 backdrop-blur-lg z-40 ${
              conversation.status === "disconnected"
                ? `pointer-events-none opacity-0`
                : `opacity-100`
            }`}
          />
          <div className="absolute flex flex-col items-center gap-4 left-0 right-0 bottom-0 z-50">
            <button
              onClick={
                conversation.status === "disconnected"
                  ? startConversation
                  : stopConversation
              }
              className={`relative  bg-black text-white border-l-2 border-t-2 border-r-2 border-white`}
            >
              <div
                className={`absolute w-full h-full duration-1000 bg-gradient-to-br from-slate-800 via-black to-yellow-700 mix-blend-screen ${
                  conversation.status === "connected" && conversation.isSpeaking
                    ? "opacity-100"
                    : "opacity-0"
                }`}
              />
              <div
                className={`absolute w-full h-full duration-1000 bg-gradient-to-br from-slate-800 via-black to-emerald-500 mix-blend-screen ${
                  conversation.status === "connected" &&
                  !conversation.isSpeaking
                    ? "opacity-100"
                    : "opacity-0 hover:opacity-50"
                }`}
              />
              <div
                className={`flex flex-row items-center gap-4 font-rowdies text-xl duration-500 px-6 pt-4 pb-8 ${
                  conversation.status === "disconnected"
                    ? `hover:pb-12`
                    : `pb-32`
                }`}
              >
                {conversation.status === "disconnected" ? (
                  <Phone />
                ) : (
                  <PhoneOff />
                )}
                {conversation.status === "disconnected"
                  ? "CALL IN AS CUSTOMER"
                  : "END CUSTOMER CALL"}
              </div>
            </button>
          </div>
        </>
      );
    }),
  {
    ssr: false,
  }
);
