import { Router } from "express";
import { authenticate } from "../auth/auth.middleware.js";
import { validateBody } from "../../common/middleware/validate.middleware.js";
import {
  addCartItemBodySchema,
  updateCartItemBodySchema,
} from "./cart.validation.js";
import {
  addCartItem,
  clearCart,
  getCart,
  removeCartItem,
  updateCartItem,
} from "./cart.controller.js";

const router = Router();

router.get("/", authenticate, getCart);
router.post(
  "/items",
  authenticate,
  validateBody(addCartItemBodySchema),
  addCartItem,
);
router.patch(
  "/items/:productId",
  authenticate,
  validateBody(updateCartItemBodySchema),
  updateCartItem,
);
router.delete("/items/:productId", authenticate, removeCartItem);
router.delete("/", authenticate, clearCart);

export default router;