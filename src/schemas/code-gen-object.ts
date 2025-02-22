import { z } from "zod";

export const codeGenObjectSchema = z.object({
  code: z.string(),
  signature: z.array(
    z.object({
      prettyName: z.string(),
      name: z.string(),
      type: z.enum(["string", "number", "boolean"]),
    })
  ),
  explanation: z.string(),
});
