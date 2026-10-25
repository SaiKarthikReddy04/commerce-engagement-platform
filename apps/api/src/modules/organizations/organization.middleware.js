import { OrganizationMembership } from "./organization-membership.model.js";

export function requireOrganizationRole(...allowedRoles) {
  return async (req, res, next) => {
    const { organizationId } = req.params;

    if (!/^[0-9a-fA-F]{24}$/.test(organizationId || "")) {
      return res.status(400).json({
        error: {
          code: "INVALID_ORGANIZATION_ID",
          message: "Organization ID is invalid.",
        },
      });
    }

    try {
      const membership = await OrganizationMembership.findOne({
        organizationId,
        userId: req.user.id,
        status: "ACTIVE",
      })
        .select("role")
        .lean();

      if (!membership || !allowedRoles.includes(membership.role)) {
        return res.status(403).json({
          error: {
            code: "FORBIDDEN",
            message: "You do not have permission in this organization.",
          },
        });
      }

      req.organizationMembership = membership;
      next();
    } catch (error) {
      next(error);
    }
  };
}