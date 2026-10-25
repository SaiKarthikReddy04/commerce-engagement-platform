import mongoose from "mongoose";

const organizationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 160,
    },
    slug: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      maxlength: 100,
      match: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      unique: true,
    },
    status: {
      type: String,
      enum: ["ACTIVE", "SUSPENDED"],
      default: "ACTIVE",
      required: true,
      index: true,
    },
    requiresApproval: {
      type: Boolean,
      default: false,
    },
    spendingLimitInPaise: {
      type: Number,
      default: null,
      min: 0,
      validate: {
        validator: (value) => value === null || Number.isSafeInteger(value),
        message: "Spending limit must be a nonnegative whole number of paise.",
      },
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

organizationSchema.index({ status: 1, createdAt: -1 });

export const Organization = mongoose.model("Organization", organizationSchema);