import { z } from "zod";

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters.")
  .refine(
    (password) => Buffer.byteLength(password, "utf8") <= 72,
    "Password must be no more than 72 bytes.",
  );

export const registerBodySchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(254).toLowerCase(),
  password: passwordSchema,
});

export const loginBodySchema = z.object({
  email: z.string().trim().email().max(254).toLowerCase(),
  password: z.string().min(1),
});