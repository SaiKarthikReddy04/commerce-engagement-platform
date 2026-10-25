import { Router } from "express";
import { authenticate } from "../auth/auth.middleware.js";
import { requireOrganizationRole } from "../organizations/organization.middleware.js";
import { validateBody } from "../../common/middleware/validate.middleware.js";
import { reviewOrderBodySchema } from "./order.validation.js";
import {
    getPendingOrganizationOrders,
    reviewOrganizationOrder,
  } from "./order.controller.js";

const router = Router();

router.post(
  "/:organizationId/orders/:orderId/review",
  authenticate,
  requireOrganizationRole("ORG_ADMIN", "APPROVER"),
  validateBody(reviewOrderBodySchema),
  reviewOrganizationOrder,
);

router.get(
    "/:organizationId/orders/pending-approval",
    authenticate,
    requireOrganizationRole("ORG_ADMIN", "APPROVER"),
    getPendingOrganizationOrders,
  );

export default router;