import { z } from "zod";

//create comment
export const create = z.object({
  parent_id: z.number().optional(),
  content: z
    .string()
    .min(1)
    .max(100, "comment lenght must be less then 100 characters"),
});

//create comment
export const update = z.object({
  content: z
    .string()
    .min(1)
    .max(100, "comment lenght must be less then 100 characters"),
});
