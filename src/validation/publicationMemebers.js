import { z } from "zod";

//change role
export const role = z.object({
  role: z
    .enum(["owner", "editor", "writer"])
    .refine((val) => ["owner", "editor", "writer"].includes(val), {
      message: "Invalid role please select owner || editor || writer",
    }),
});
