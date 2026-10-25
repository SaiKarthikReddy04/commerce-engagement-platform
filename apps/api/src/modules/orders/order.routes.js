import { Router } from "express";
import { authenticate } from "../auth/auth.middleware.js";
import { createOrder, getOrder, listOrders } from "./order.controller.js";
import { validateBody } from "../../common/middleware/validate.middleware.js";
import { createOrderBodySchema } from "./order.validation.js";

const router = Router();

router.get("/", authenticate, listOrders);
router.get("/:orderId", authenticate, getOrder);
router.post(
    "/",
    authenticate,
    validateBody(createOrderBodySchema),
    createOrder,
  );

export default router;