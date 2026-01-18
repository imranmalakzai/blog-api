import { z } from "zod";

//create comment
export const create = z.object({
  article_id: z.number().int().positive(),
  user_id: z.number().int().positive(),
  parent_id: z.number().int().positive().optional,
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
