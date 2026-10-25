import { z } from "zod";

const productIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "A valid product ID is required.");

export const addCartItemBodySchema = z.object({
  productId: productIdSchema,
  quantity: z.number().int().safe().min(1),
});

export const updateCartItemBodySchema = z.object({
  quantity: z.number().int().safe().min(1),
});