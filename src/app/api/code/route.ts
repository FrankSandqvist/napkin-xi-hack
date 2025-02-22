import { openai } from "@ai-sdk/openai";
import { streamObject } from "ai";
import { codeGenObjectSchema } from "../../../schemas/code-gen-object";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const context = await req.json();

  const prompt = `You have three tasks.

## Task 1
Please generate a javascript function body to do price calculation for a small business.
Please follow the discussions that were had, respecting also the old code unless it's now incorrect.
The parameters are available in an object named "params".
IMPORTANT: ONLY RETURN THE BODY (NOT THE FULL SIGNATURE)
      
# Task 2
Generate a typescript signature of the parameters object. You will also provide a "prettified" name just to show in the interface.

# Task 3
Explain how this price calculation logic works. Please explain it in a simple way, formatted in markdown, that a non-technical person can understand.

${
  context.editingProduct
    ? `You are currently editing this product:
${JSON.stringify(context.editingProduct)}`
    : ""
}

Generate based on this discussion:

${context.messages.join("\n")}`;

  console.log(prompt);
  const result = streamObject({
    model: openai("gpt-4o"),
    schema: codeGenObjectSchema,
    prompt,
  });

  return result.toTextStreamResponse();
}
