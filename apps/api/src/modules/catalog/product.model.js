import mongoose from "mongoose";

const imageSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
      trim: true,
    },
    altText: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    sku: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 160,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 4000,
    },
    category: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    brand: {
      type: String,
      trim: true,
      maxlength: 100,
      default: "",
    },
    price: {
      amountInPaise: {
        type: Number,
        required: true,
        min: 0,
        validate: {
          validator: Number.isSafeInteger,
          message: "Price must be a whole number of paise.",
        },
      },
      currency: {
        type: String,
        enum: ["INR"],
        default: "INR",
      },
    },
    stockQuantity: {
      type: Number,
      required: true,
      min: 0,
      validate: {
        validator: Number.isSafeInteger,
        message: "Stock quantity must be a whole number.",
      },
      default: 0,
    },
    status: {
      type: String,
      enum: ["DRAFT", "ACTIVE", "ARCHIVED"],
      default: "DRAFT",
      index: true,
    },
    images: {
      type: [imageSchema],
      default: [],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

productSchema.index({ status: 1, category: 1, createdAt: -1 });
productSchema.index({ name: "text", description: "text", sku: "text" });

export const Product = mongoose.model("Product", productSchema);