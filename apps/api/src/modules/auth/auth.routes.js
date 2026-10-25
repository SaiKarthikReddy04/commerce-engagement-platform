import { Router } from "express";
import { validateBody } from "../../common/middleware/validate.middleware.js";
import { getCurrentUser, login, register } from "./auth.controller.js";
import { authenticate } from "./auth.middleware.js";
import {
  loginBodySchema,
  registerBodySchema,
} from "./auth.validation.js";

const router = Router();

router.get("/me", authenticate, getCurrentUser);
router.post("/register", validateBody(registerBodySchema), register);
router.post("/login", validateBody(loginBodySchema), login);

export default router;