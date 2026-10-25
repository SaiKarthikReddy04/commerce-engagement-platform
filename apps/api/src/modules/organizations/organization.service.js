import mongoose from "mongoose";
import {
    createOrganization,
    createOrganizationMembership,
    findActiveUserByEmail,
    findMembersByOrganizationId,
    findOrganizationById,
  } from "./organization.repository.js";

function createError(statusCode, code, message) {
  const error = new Error(message);
  error.statusCode = statusCode;
  error.code = code;
  return error;
}

export async function createOrganizationForUser(userId, organizationData) {
  const session = await mongoose.startSession();
  let result;

  try {
    await session.withTransaction(async () => {
      const organization = await createOrganization(
        {
          ...organizationData,
          createdBy: userId,
        },
        session,
      );

      const membership = await createOrganizationMembership(
        {
          organizationId: organization._id,
          userId,
          role: "ORG_ADMIN",
          status: "ACTIVE",
        },
        session,
      );

      result = { organization, membership };
    });

    return result;
  } catch (error) {
    if (error.code === 11000) {
      throw createError(
        409,
        "ORGANIZATION_SLUG_TAKEN",
        "That organization slug is already in use.",
      );
    }

    throw error;
  } finally {
    await session.endSession();
  }
}

export async function addMemberToOrganization(organizationId, email, role) {
    const organization = await findOrganizationById(organizationId);
  
    if (!organization) {
      throw createError(404, "ORGANIZATION_NOT_FOUND", "Organization was not found.");
    }
  
    if (organization.status !== "ACTIVE") {
      throw createError(409, "ORGANIZATION_INACTIVE", "This organization is not active.");
    }
  
    const user = await findActiveUserByEmail(email);
  
    if (!user) {
      throw createError(404, "USER_NOT_FOUND", "No active user was found with that email.");
    }
  
    try {
      return await createOrganizationMembership({
        organizationId: organization._id,
        userId: user._id,
        role,
        status: "ACTIVE",
      });
    } catch (error) {
      if (error.code === 11000) {
        throw createError(
          409,
          "ALREADY_ORGANIZATION_MEMBER",
          "That user is already a member of this organization.",
        );
      }
  
      throw error;
    }
}

export async function listOrganizationMembers(organizationId) {
    const organization = await findOrganizationById(organizationId);
  
    if (!organization) {
      throw createError(404, "ORGANIZATION_NOT_FOUND", "Organization was not found.");
    }
  
    return findMembersByOrganizationId(organizationId);
  }