import { z } from "zod";
import { codeGenObjectSchema } from "./code-gen-object";

export const localstorageDbSchema = z.object({
  products: z.array(codeGenObjectSchema),
});
