import { z } from "zod";

export const createOrganizationBodySchema = z.object({
  name: z.string().trim().min(1).max(160),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .min(1)
    .max(100)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens for the slug."),
  requiresApproval: z.boolean().optional().default(false),
  spendingLimitInPaise: z.number().int().safe().nonnegative().nullable().optional().default(null),
});

export const addOrganizationMemberBodySchema = z.object({
    email: z.string().trim().email().max(254).toLowerCase(),
    role: z.enum(["BUYER", "APPROVER"]),
  });