"use client";

import { useConversation } from "@11labs/react";
import { experimental_useObject } from "@ai-sdk/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { codeGenObjectSchema } from "../schemas/code-gen-object";
import { z } from "zod";
import { productSchema } from "@/schemas/product";

export function AdminConversation() {
  const [products, setProducts] = useState<
    Array<z.infer<typeof productSchema>>
  >(
    localStorage.getItem("products")
      ? JSON.parse(localStorage.getItem("products")!)
      : []
  );
  useEffect(() => {
    localStorage.setItem("products", JSON.stringify(products));
  }, [products]);

  const [currentProductIdx, setCurrentProductIdx] = useState<number | null>(
    null
  );
  const currentProduct = useMemo(() => {
    return currentProductIdx !== null ? products[currentProductIdx] : null;
  }, [currentProductIdx, products]);

  const [messages, setMessages] = useState<string[]>([]);
  const messagesRef = useRef(messages);
  const currentProductRef = useRef(currentProduct);
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    currentProductRef.current = currentProduct;
  }, [currentProduct]);

  const codeCompletion = experimental_useObject({
    api: "/api/code",
    schema: codeGenObjectSchema,
    onFinish: (object) => {
      console.log(object);
      if (object.object === undefined) {
        console.error(object.error);
        return;
      }
      editCurrentProduct({ ...object.object, draft: false });
    },
    onError: (error) => console.error("Error:", error),
  });

  const conversation = useConversation({
    onConnect: () => console.log("Connected"),
    onDisconnect: () => console.log("Disconnected"),
    onMessage: (message: any) => {
      console.log("Message:", message);
      setMessages((prevMessages) => [
        ...prevMessages,
        `${message.source}: ${message.message}`,
      ]);
    },
    onError: (error: any) => console.error("Error:", error),
  });

  const stopConversation = useCallback(async () => {
    await conversation.endSession();
  }, [conversation]);

  const editCurrentProduct = useCallback(
    (newProduct: Partial<z.infer<typeof productSchema>>) => {
      setProducts((prevProducts) =>
        prevProducts.map((product, index) =>
          index === currentProductIdx
            ? {
                ...product,
                ...newProduct,
              }
            : product
        )
      );
    },
    [currentProductIdx]
  );

  const startConversation = useCallback(async () => {
    try {
      // Request microphone permission
      await navigator.mediaDevices.getUserMedia({ audio: true });

      // Start the conversation with your agent
      await conversation.startSession({
        agentId: "1iMLmMFoTYF77Yzjr5NA",
        clientTools: {
          // takeNote: ({ note }: any) => {
          //   console.log(currentProduct?.productName);
          //   setNotes((prevNotes) => [...prevNotes, note]);
          // },
          generateCode: async () => {
            console.log("Generate code");
            console.log(messagesRef.current, currentProductRef.current);
            codeCompletion.submit({
              messages: messagesRef.current,
              editingProduct: currentProductRef.current?.draft
                ? null
                : currentProductRef.current,
            });
            await new Promise((resolve) => setTimeout(resolve, 4000));
          },
          setName: ({ name }: any) => {
            console.log(name);
            editCurrentProduct({ productName: name });
          },
        },
        overrides: {
          agent: {
            prompt: {
              prompt: `
        Your task is to interview the business owner as to how they price their services. You can also set the product name.

Don't overcomplicate it, if the user knows their pricing, generate the code according to that. But if they are unsure, you may need to dig a bit.

${
  currentProduct?.draft === false
    ? `We are currently editing this product:
Product name: ${currentProduct?.productName}
Pricing explanation: ${currentProduct?.explanation}`
    : ``
}`,
            },
          },
        },
      });
    } catch (error) {
      console.error("Failed to start conversation:", error);
    }
  }, [conversation, currentProduct, editCurrentProduct]);

  const addNewProduct = () => {
    setProducts((prevProducts) => [
      ...prevProducts,
      {
        productName: "",
        signature: [],
        code: "",
        draft: true,
        explanation: "",
      },
    ]);
    setCurrentProductIdx(products.length);
  };

  if (currentProduct === null) {
    return (
      <div className="flex flex-col items-center gap-4">
        <h1 className=" text-white font-rowdies text-2xl">My products</h1>
        <div className=" grid grid-cols-2 gap-4">
          {products.map((product, index) => (
            <div key={index} className="bg-gray-200 p-2 rounded">
              <div>{product.productName}</div>
              <button onClick={() => setCurrentProductIdx(index)}>Edit</button>
            </div>
          ))}
        </div>
        <button onClick={addNewProduct}>Add new product</button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <h1 className="text-white font-rowdies text-2xl">
        {currentProduct?.productName || "New product"}
      </h1>
      <div className="flex gap-2">
        {conversation.status !== "connected" ? (
          <button
            onClick={startConversation}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
          >
            Start Conversation
          </button>
        ) : (
          <button
            onClick={stopConversation}
            className="px-4 py-2 bg-red-500 text-white rounded disabled:bg-gray-300"
          >
            Stop Conversation
          </button>
        )}
      </div>
      {messages.map((message, index) => (
        <div key={index} className="bg-gray-200 p-2 rounded">
          {message}
        </div>
      ))}
      <div className="flex flex-col items-center">
        <p>Status: {conversation.status}</p>
        <p>Agent is {conversation.isSpeaking ? "speaking" : "listening"}</p>
      </div>
      <div className=" bg-slate-950 text-white font-mono whitespace-pre-wrap">
        {codeCompletion.object?.code ?? currentProduct.code ?? ""}
      </div>
      <div className=" bg-white whitespace-pre-wrap">
        {codeCompletion.object?.explanation ?? currentProduct.explanation ?? ""}
      </div>
      <div className=" bg-white whitespace-pre-wrap">
        {(codeCompletion.object?.signature ?? currentProduct.signature).map(
          (signature, index) => {
            if (!signature) return null;
            return (
              <div key={index}>
                {signature.prettyName}: {signature.type}
              </div>
            );
          }
        )}
      </div>
      <button></button>
    </div>
  );
}
