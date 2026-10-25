import { z } from "zod";

export const createOrderBodySchema = z
  .object({
    organizationId: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, "A valid organization ID is required.")
      .optional(),
  })
    .default({});
  
export const reviewOrderBodySchema = z.object({
    decision: z.enum(["APPROVED", "REJECTED"]),
});