import { z } from "zod";

export const react = z.object({
  reactionId: z.string("reaction id is required"),
});
