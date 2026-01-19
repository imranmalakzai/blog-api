import { z } from "zod";

//create article
export const create = z.object({
  title: z
    .string("title is required")
    .min(5, "title must be at least 5 characters")
    .max(50, "title should not be more then 50 characters"),
  content: z
    .string("content is required")
    .min(10)
    .max(2500, "article must not be more then 2500 characters"),
  excerpt: z
    .string("excerpt is required")
    .min(10)
    .max(250, "please excerpt should be not more then 250 characters"),
  status: z
    .enum(["draft", "published"])
    .refine((val) => ["published", "draft"].includes(val), {
      message: "Invalid status please select published || draft ",
    }),
  visibility: z
    .enum(["public", "privite", "unlisted"])
    .refine((val) => ["public", "privite", "unlisted"].includes(val), {
      message: "Invalid visiblity please select public || privit || unlisted",
    }),
});

//update article
export const update = z.object({
  title: z
    .string()
    .min(5, "title must be at least 5 characters")
    .max(50, "title should not be more then 50 characters"),
  content: z
    .string()
    .min(10)
    .max(2500, "article must not be more then 2500 characters"),
  excerpt: z
    .string()
    .min(10)
    .max(250, "please excerpt should be not more then 250 characters"),
});
