"use client";

import { useConversation } from "@11labs/react";
import { experimental_useObject } from "@ai-sdk/react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { codeGenObjectSchema } from "../../schemas/code-gen-object";
import { z } from "zod";
import { productSchema } from "@/schemas/product";
import { FakeDB } from "@/utils/fake-db";
import dynamic from "next/dynamic";
import {
  ArrowLeft,
  Hash,
  SparklesIcon,
  StopCircleIcon,
  Text,
  ToggleLeft,
  Trash,
} from "lucide-react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { useRouter } from "next/navigation";

const EditProduct = dynamic(
  () =>
    Promise.resolve(
      ({ params }: { params: Promise<{ productIdx: number }> }) => {
        const { productIdx } = React.use(params);
        const [product, setProduct] = useState<z.infer<typeof productSchema>>(
          FakeDB.getProduct(productIdx)
        );
        const router = useRouter();

        const [messages, setMessages] = useState<Array<[boolean, string]>>([]);
        const messagesRef = useRef(messages);
        const productRef = useRef(product);
        useEffect(() => {
          messagesRef.current = messages;
        }, [messages]);
        useEffect(() => {
          productRef.current = product;
        }, [product]);

        const codeCompletion = experimental_useObject({
          api: "/api/code",
          schema: codeGenObjectSchema,
          onFinish: (object) => {
            if (object.object === undefined) {
              console.error(object.error);
              return;
            }
            setProduct((p) =>
              FakeDB.editProduct(productIdx, {
                ...p,
                ...object.object,
                draft: false,
              })
            );
          },
          onError: (error) => console.error("Error:", error),
        });

        const conversation = useConversation({
          onConnect: () => console.log("Connected"),
          onDisconnect: () => console.log("Disconnected"),
          onMessage: (message: any) => {
            setMessages((prevMessages) => [
              ...prevMessages,
              [message.source === "ai", message.message],
            ]);
          },
          onError: (error: any) => console.error("Error:", error),
        });

        const stopConversation = useCallback(async () => {
          await conversation.endSession();
        }, [conversation]);

        const startConversation = useCallback(async () => {
          try {
            await navigator.mediaDevices.getUserMedia({ audio: true });

            await conversation.startSession({
              agentId: "1iMLmMFoTYF77Yzjr5NA",
              clientTools: {
                generateCode: async () => {
                  codeCompletion.submit({
                    messages: messagesRef.current,
                    editingProduct: productRef.current?.draft
                      ? null
                      : productRef.current,
                  });
                  await new Promise((resolve) => setTimeout(resolve, 4000));
                },
                setName: ({ name }: any) => {
                  setProduct((p) =>
                    FakeDB.editProduct(productIdx, {
                      ...p,
                      productName: name,
                    })
                  );
                },
              },
              overrides: {
                agent: {
                  prompt: {
                    prompt: `
        Your task is to interview the business owner as to how they price their services. You can also set the product name.

Don't overcomplicate it, if the user knows their pricing, generate the code according to that. But if they are unsure, you may need to dig a bit.

Please be as conicse as possible, and ask the right questions to get the information you need.

Get the name of the service first, if you don't have it.

Product name: ${productRef.current.productName || "NOT YET SET"}
${
  productRef.current.draft === false
    ? `We are currently editing this product:
Pricing explanation: ${productRef.current.explanation}`
    : ``
}`,
                  },
                  firstMessage: productRef.current.draft
                    ? productRef.current.productName
                      ? "All right, let's get started! How do you price this service?"
                      : "Let's get started. What's the name of your product or service?"
                    : `Let's fine-tune the pricing for ${productRef.current.productName}.`,
                },
              },
            });
          } catch (error) {
            console.error("Failed to start conversation:", error);
          }
        }, [conversation]);

        return (
          <div className="flex flex-col items-stretch">
            <div className="mb-12">
              <h1 className="font-rowdies text-4xl bg-black -mx-6 lg:-mx-12 text-white py-2 px-12 mb-4 flex flex-row gap-2 items-center group">
                <Link href="/">
                  <ArrowLeft className="mr-4 text-white -ml-4 duration-300 opacity-50 group-hover:ml-0 group-hover:opacity-100" />
                </Link>
                {productRef.current.productName || "New product"}
                <div className="flex-grow" />
                <button
                  onClick={() => {
                    FakeDB.deleteProduct(productIdx);
                    router.push("/");
                  }}
                >
                  <Trash className="mr-4 w-4 h-4 text-white opacity-50 duration-300 group-hover:opacity-100" />
                </button>
              </h1>
            </div>
            <h2 className="text-2xl font-rowdies mb-4">
              Let's build your pricing.
            </h2>
            <p className="mr-8">
              This page allows you to create the pricing function for your
              product, so the pricing agent can give quotes to your customers.
            </p>
            <div className="relative flex flex-col gap-2 overflow-y-auto pb-8 max-h-64">
              {messages
                .map((v, i) => [v, i] as const)
                .toReversed()
                .map(([[isAi, message], originalIndex]) => (
                  <div
                    key={originalIndex}
                    className={`p-2 border w-[90%] animate-appear-from-bottom text-sm ${
                      isAi
                        ? `self-start bg-slate-100 border-black`
                        : `self-end bg-black text-white`
                    }`}
                  >
                    {message}
                  </div>
                ))}
            </div>
            <button
              onClick={
                conversation.status !== "connected"
                  ? startConversation
                  : stopConversation
              }
              className={`relative text-white bg-black -mx-6 lg:mx-0 mb-8 shadow-emerald-400 duration-200 ${
                conversation.status !== "connected"
                  ? `shadow-md`
                  : `shadow-none`
              }`}
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
              <div className="px-4 py-2 font-rowdies text-xl flex flex-row items-center justify-center">
                {conversation.status === "disconnected" ? (
                  <SparklesIcon className="w-5 h-5 mr-2" />
                ) : (
                  <StopCircleIcon className="w-5 h-5 mr-2" />
                )}
                {conversation.status === "disconnected"
                  ? productRef.current.draft === false
                    ? "TAP TO START EDITING"
                    : "TAP TO START BUILDING"
                  : "STOP BUILDING"}
              </div>
            </button>
            {productRef.current.draft === false && (
              <>
                <h2 className="text-2xl font-rowdies mb-4">
                  How do we price this?
                </h2>
                <div className="text-sm mb-4">
                  We depend on the following factors:
                </div>
                <div className=" flex flex-row flex-wrap gap-4 text-sm mb-4">
                  {(codeCompletion.object?.signature ?? product.signature).map(
                    (signature, index) => {
                      if (!signature) return null;
                      return (
                        <div
                          className="flex flex-row text-nowrap bg-slate-100 border border-black px-2 py-1"
                          key={index}
                        >
                          {{
                            string: (
                              <Text className="w-5 h-5 align-middle mr-2" />
                            ),
                            boolean: (
                              <ToggleLeft className="w-5 h-5 align-middle mr-2" />
                            ),
                            number: (
                              <Hash className="w-5 h-5 align-middle mr-2" />
                            ),
                          }[signature.type!] ?? null}
                          {signature.prettyName}
                        </div>
                      );
                    }
                  )}
                </div>
                <div className=" whitespace-pre-wrap text-sm mb-8">
                  <ReactMarkdown
                    components={{
                      p: ({ children }) => <p className="">{children}</p>,
                      ul: ({ children }) => (
                        <ul className="list-disc list-inside">{children}</ul>
                      ),
                      li: ({ children }) => <li className="">{children}</li>,
                    }}
                  >
                    {codeCompletion.object?.explanation ?? product.explanation}
                  </ReactMarkdown>
                </div>
                <div className="bg-slate-950 text-white font-kodeMono text-sm -mx-6 lg:-mx-12 px-4 py-8 overflow-y-scroll whitespace-pre-wrap mb-32">
                  {codeCompletion.object?.code ||
                    product.code ||
                    "This is where the magic code sauce will go."}
                </div>
              </>
            )}
          </div>
        );
      }
    ),
  {
    ssr: false,
  }
);

export default EditProduct;
