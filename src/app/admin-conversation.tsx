"use client";

import { useConversation } from "@11labs/react";
import { useChat, useCompletion } from "@ai-sdk/react";
import { useCallback, useState } from "react";

export function AdminConversation() {
  const [notes, setNotes] = useState<string[]>([
    "price = width * height * square meter price",
    "square meter price from supplier",
    "square meter price = supplier price + profit margin",
    "profit margin = 2 * supplier price + fixed cutting fee",
    "fixed cutting fee = twenty euros",
    "if order > ten sheets, then discount = twenty percent",
  ]);

  const { completion, complete } = useCompletion();

  const conversation = useConversation({
    onConnect: () => console.log("Connected"),
    onDisconnect: () => console.log("Disconnected"),
    onMessage: (message: any) => console.log("Message:", message),
    onError: (error: any) => console.error("Error:", error),
  });

  const handleGenerateCode = () => {
    complete(`Please generate javascript code to do price calculation for a small business. Only respond with the code.

Generate a function named "calculate" in this format:
calculate(parameters: object) -> number (the price)
        
These are the notes given:
        
${notes.map((note, index) => `${index + 1}. ${note}`).join("\n")}`);
  };

  const startConversation = useCallback(async () => {
    try {
      // Request microphone permission
      await navigator.mediaDevices.getUserMedia({ audio: true });

      // Start the conversation with your agent
      await conversation.startSession({
        agentId: "1iMLmMFoTYF77Yzjr5NA",
        clientTools: {
          takeNote: ({ note }: any) => {
            setNotes((prevNotes) => [...prevNotes, note]);
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
      {notes.map((note, index) => (
        <div key={index} className="bg-gray-200 p-2 rounded">
          {note}
        </div>
      ))}
      <button
        onClick={handleGenerateCode}
        className="px-4 py-2 bg-green-500 text-white rounded"
      >
        Generate code
      </button>
      <div className="flex flex-col items-center">
        <p>Status: {conversation.status}</p>
        <p>Agent is {conversation.isSpeaking ? "speaking" : "listening"}</p>
      </div>
      <div className=" bg-slate-950 text-white font-mono whitespace-pre-wrap">{completion}</div>
    </div>
  );
}
