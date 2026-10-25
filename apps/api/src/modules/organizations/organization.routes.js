import { Router } from "express";
import { authenticate } from "../auth/auth.middleware.js";
import { validateBody } from "../../common/middleware/validate.middleware.js";
import {
    addOrganizationMemberBodySchema,
    createOrganizationBodySchema,
  } from "./organization.validation.js";
  import {
    addOrganizationMember,
    createOrganization,
    getOrganizationMembers,
  } from "./organization.controller.js";
import { requireOrganizationRole } from "./organization.middleware.js";

const router = Router();

router.post(
  "/",
  authenticate,
  validateBody(createOrganizationBodySchema),
  createOrganization,
);

router.post(
    "/:organizationId/members",
    authenticate,
    requireOrganizationRole("ORG_ADMIN"),
    validateBody(addOrganizationMemberBodySchema),
    addOrganizationMember,
  );

  router.get(
    "/:organizationId/members",
    authenticate,
    requireOrganizationRole("ORG_ADMIN"),
    getOrganizationMembers,
);
  
export default router;