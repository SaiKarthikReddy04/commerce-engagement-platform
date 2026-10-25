import { Router } from "express";
import {
  createProduct,
  deleteProductById,
  getProductById,
  listProducts,
  updateProductById,
  listProductCategories,
  listAdminProducts,
} from "./product.controller.js";
import {
  createProductBodySchema,
  updateProductBodySchema,
} from "./product.validation.js";
import { validateBody } from "../../common/middleware/validate.middleware.js";
import { authenticate, requireRole } from "../auth/auth.middleware.js";

const router = Router();

// Fixed paths must come before /:productId.
router.route("/").get(listProducts);
router.get("/categories", listProductCategories);
router.get("/admin", authenticate, requireRole("ADMIN"), listAdminProducts);

router.post(
  "/",
  authenticate,
  requireRole("ADMIN"),
  validateBody(createProductBodySchema),
  createProduct,
);

router.patch(
  "/:productId",
  authenticate,
  requireRole("ADMIN"),
  validateBody(updateProductBodySchema),
  updateProductById,
);

router
  .route("/:productId")
  .get(getProductById)
  .delete(authenticate, requireRole("ADMIN"), deleteProductById);

export default router;
