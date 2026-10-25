import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    sku: {
      type: String,
      required: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      validate: Number.isSafeInteger,
    },
    unitPriceInPaise: {
      type: Number,
      required: true,
      min: 0,
      validate: Number.isSafeInteger,
    },
    lineTotalInPaise: {
      type: Number,
      required: true,
      min: 0,
      validate: Number.isSafeInteger,
    },
  },
  {
    _id: false,
  },
);

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    organizationId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Organization",
            default: null,
            index: true,
        },
    items: {
        type: [orderItemSchema],
        required: true,
        validate: {
            validator: (items) => items.length > 0,
            message: "An order must contain at least one item.",
        },
    },
    currency: {
      type: String,
      enum: ["INR"],
      default: "INR",
      required: true,
    },
    subtotalInPaise: {
      type: Number,
      required: true,
      min: 0,
      validate: Number.isSafeInteger,
    },
    status: {
      type: String,
      enum: ["PENDING_APPROVAL", "PENDING_PAYMENT", "CONFIRMED", "CANCELLED"],
      default: "PENDING_PAYMENT",
      required: true,
      index: true,
    },
    approvalDecision: {
        type: String,
        enum: ["APPROVED", "REJECTED"],
        default: null,
    },
    reviewedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null,
    },
    reviewedAt: {
        type: Date,
        default: null,
    },
          
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

orderSchema.index({ userId: 1, createdAt: -1 });

export const Order = mongoose.model("Order", orderSchema);