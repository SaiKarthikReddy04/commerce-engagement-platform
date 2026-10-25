import { Router } from "express";
import { authenticate } from "../auth/auth.middleware.js";
import { validateBody } from "../../common/middleware/validate.middleware.js";
import { simulatePaymentBodySchema } from "./payment.validation.js";
import { simulatePayment } from "./payment.controller.js";

const router = Router();

router.post(
  "/:orderId/simulate",
  authenticate,
  validateBody(simulatePaymentBodySchema),
  simulatePayment,
);

export default router;