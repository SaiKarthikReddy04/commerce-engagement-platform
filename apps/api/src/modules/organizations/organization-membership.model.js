import mongoose from "mongoose";

const organizationMembershipSchema = new mongoose.Schema(
  {
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    role: {
      type: String,
      enum: ["ORG_ADMIN", "BUYER", "APPROVER"],
      required: true,
    },
    status: {
      type: String,
      enum: ["INVITED", "ACTIVE", "SUSPENDED"],
      default: "ACTIVE",
      required: true,
    },
    invitedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

organizationMembershipSchema.index(
  { organizationId: 1, userId: 1 },
  { unique: true },
);

organizationMembershipSchema.index({ userId: 1, status: 1 });

export const OrganizationMembership = mongoose.model(
  "OrganizationMembership",
  organizationMembershipSchema,
);