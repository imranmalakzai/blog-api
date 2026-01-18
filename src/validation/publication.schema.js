import { z } from "zod";

//create new publication
export const create = z.object({
  name: z
    .string()
    .min(5, "publication name must be at least 5 characters")
    .max(100, "publiction name must be less then 100 characters"),
  description: z
    .string()
    .min(25, "publication description must be at least 25 characters")
    .max(1500, "publiction description must be less then 1500 chracters"),
});

//update publication schema
export const update = z.object({
  name: z
    .string()
    .min(5, "publication name must be at least 5 characters")
    .max(100, "publiction name must be less then 100 characters"),
  description: z
    .string()
    .min(25, "publication description must be at least 25 characters")
    .max(1500, "publiction description must be less then 1500 chracters"),
});
