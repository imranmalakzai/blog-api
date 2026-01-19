import { z } from "zod";

//create tags
export const create = z.object({
  name: z
    .string()
    .min(3, "tag name must be at least 3 characters")
    .max(20, "tag name should be not be more then 20 characters"),
});

//update tags
export const update = z.object({
  name: z
    .string()
    .min(3, "tag name must be at least 3 characters")
    .max(20, "tag name should be not be more then 20 characters"),
});
