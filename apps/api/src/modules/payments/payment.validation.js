import { z } from "zod";

export const simulatePaymentBodySchema = z.object({
  outcome: z.enum(["SUCCESS", "FAILURE"]),
});