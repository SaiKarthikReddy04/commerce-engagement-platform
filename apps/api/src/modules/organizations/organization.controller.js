import {
    addMemberToOrganization,
    createOrganizationForUser,
    listOrganizationMembers,
} from "./organization.service.js";
  
export async function createOrganization(req, res, next) {
  try {
    const result = await createOrganizationForUser(req.user.id, req.body);

    res.status(201).json({
      data: {
        organization: result.organization,
        membership: result.membership,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function addOrganizationMember(req, res, next) {
    try {
      const membership = await addMemberToOrganization(
        req.params.organizationId,
        req.body.email,
        req.body.role,
      );
  
      res.status(201).json({
        data: {
          membership,
        },
      });
    } catch (error) {
      next(error);
    }
}
  
export async function getOrganizationMembers(req, res, next) {
    try {
      const members = await listOrganizationMembers(req.params.organizationId);
      res.status(200).json({ data: members });
    } catch (error) {
      next(error);
    }
}
  