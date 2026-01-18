import z from "zod";

//registration schema
export const register = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must be less than 30 characters")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and _"
    ),

  email: z.string().email("Invalid email address"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100)
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),

  bio: z
    .string()
    .max(160, "Bio must be under 160 characters")
    .optional()
    .or(z.literal("")),

  avatar_url: z
    .string()
    .url("Avatar must be a valid URL")
    .optional()
    .or(z.literal("")),
});

//Login schema
export const login = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "password must be more then 6 characters"),
});

//** Update profile(bio,and username) */
export const profile = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must be less than 30 characters")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and _"
    ),
  bio: z.string().max(160, "Bio must be under 160 characters"),
});
