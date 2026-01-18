import { z } from "zod";

//create reaciton
export const create = z.object({
  name: z
    .string()
    .min(3, "rection name must be at least 3 characters")
    .max(10, "reaction should not be more then 10 characters"),
});

//create reaciton
export const update = z.object({
  name: z
    .string()
    .min(3, "rection name must be at least 3 characters")
    .max(10, "reaction should not be more then 10 characters"),
});
