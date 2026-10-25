import { z } from "zod";

const priceSchema = z.object({
  amountInPaise: z.number().int().nonnegative(),
  currency: z.literal("INR").default("INR"),
});

const imageSchema = z.object({
  url: z.string().url(),
  altText: z.string().trim().max(200).optional().default(""),
});

export const createProductBodySchema = z.object({
  sku: z.string().trim().min(1).max(64),
  name: z.string().trim().min(1).max(160),
  description: z.string().trim().min(1).max(4000),
  category: z.string().trim().min(1).max(100),
  brand: z.string().trim().max(100).optional().default(""),
  price: priceSchema,
  stockQuantity: z.number().int().nonnegative().safe().optional().default(0),
  status: z.enum(["DRAFT", "ACTIVE", "ARCHIVED"]).optional().default("DRAFT"),
  images: z.array(imageSchema).optional().default([]),
});

export const updateProductBodySchema = createProductBodySchema
  .partial()
  .refine((body) => Object.keys(body).length > 0, {
    message: "Provide at least one product field to update.",
  });