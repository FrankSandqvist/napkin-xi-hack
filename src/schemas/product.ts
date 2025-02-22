import { z } from "zod";
import { codeGenObjectSchema } from "./code-gen-object";

export const productSchema = z
  .object({
    productName: z.string(),
    draft: z.boolean(),
  })
  .extend(codeGenObjectSchema.shape);
