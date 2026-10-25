import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
      maxlength: 254,
    },
    // Store only a password hash, never the original password.
    passwordHash: {
      type: String,
      required: true,
      select: false,
    },
    role: {
      type: String,
      enum: ["SHOPPER", "BUYER", "APPROVER", "ADMIN"],
      default: "SHOPPER",
      required: true,
    },
    status: {
      type: String,
      enum: ["ACTIVE", "LOCKED"],
      default: "ACTIVE",
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const User = mongoose.model("User", userSchema);