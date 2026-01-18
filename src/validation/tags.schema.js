import { z } from "zod";

//create tags
export const create = z.object({
  name: z.string()
    .min(3, "tag name must be at least 3 characters")
    .max(15, "tag name should be not be more then 15 characters");
});
