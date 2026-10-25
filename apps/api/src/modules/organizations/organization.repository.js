import { Organization } from "./organization.model.js";
import { OrganizationMembership } from "./organization-membership.model.js";
import { User } from "../users/user.model.js";

export async function createOrganization(data, session) {
  const [organization] = await Organization.create([data], { session });
  return organization;
}

export async function createOrganizationMembership(data, session) {
  const [membership] = await OrganizationMembership.create([data], { session });
  return membership;
}

export function findOrganizationById(id) {
    return Organization.findById(id).select("_id status").lean();
}

export function findActiveUserByEmail(email) {
    return User.findOne({ email, status: "ACTIVE" })
      .select("_id email")
      .lean();
}

export function findMembersByOrganizationId(organizationId) {
    return OrganizationMembership.find({ organizationId })
      .populate({
        path: "userId",
        select: "name email",
      })
      .sort({ createdAt: 1 })
      .lean();
  }