import mongoose from "mongoose";
import * as productRepository from "./product.repository.js";

function createError(statusCode, message) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function validateProductId(id) {
  if (!mongoose.isValidObjectId(id)) {
    throw createError(400, "Invalid product ID.");
  }
}

function parsePositiveInteger(value, fallback, max) {
  const parsed = Number.parseInt(value, 10);

  if (!Number.isInteger(parsed) || parsed < 1) {
    return fallback;
  }

  return Math.min(parsed, max);
}

const PRODUCT_SORTS = {
  newest: { createdAt: -1 },
  price_asc: { "price.amountInPaise": 1, createdAt: -1 },
  price_desc: { "price.amountInPaise": -1, createdAt: -1 },
  name_asc: { name: 1 },
};

export async function listProducts(query = {}, { admin = false } = {}) {
  const page = parsePositiveInteger(query.page, 1, 1_000_000);
  const limit = parsePositiveInteger(query.limit, 20, 100);

  const filter = {};

  if (query.category) {
    filter.category = String(query.category).trim();
  }

  const search =
    typeof query.search === "string" ? query.search.trim().slice(0, 100) : "";

  if (search) {
    filter.$text = { $search: search };
  }

  if (admin && query.status) {
    filter.status = String(query.status).toUpperCase();
  } else if (!admin) {
    filter.status = "ACTIVE";
  }

  const sort =
    typeof query.sort === "string" && PRODUCT_SORTS[query.sort]
      ? PRODUCT_SORTS[query.sort]
      : PRODUCT_SORTS.newest;

  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    productRepository.findProducts({ filter, sort, skip, limit }),
    productRepository.countProducts(filter),
  ]);

  return {
    items,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
}

export async function getProductById(id, { admin = false } = {}) {
  validateProductId(id);

  const product = await productRepository.findProductById(id);

  if (!product || (!admin && product.status !== "ACTIVE")) {
    throw createError(404, "Product not found.");
  }

  return product;
}

export async function createProduct(productData) {
  try {
    return await productRepository.createProduct(productData);
  } catch (error) {
    if (error.code === 11000) {
      throw createError(409, "A product with that SKU already exists.");
    }

    throw error;
  }
}

export async function updateProductById(id, productData) {
  validateProductId(id);

  const allowedFields = [
    "name",
    "description",
    "category",
    "brand",
    "price",
    "stockQuantity",
    "status",
    "images",
  ];

  const updates = Object.fromEntries(
    Object.entries(productData).filter(([key]) => allowedFields.includes(key)),
  );

  if (Object.keys(updates).length === 0) {
    throw createError(400, "No valid product fields were provided.");
  }

  const product = await productRepository.updateProductById(id, updates);

  if (!product) {
    throw createError(404, "Product not found.");
  }

  return product;
}

export async function deleteProductById(id) {
  validateProductId(id);

  const product = await productRepository.deleteProductById(id);

  if (!product) {
    throw createError(404, "Product not found.");
  }

  return product;
}

export async function listProductCategories() {
  const categories = await productRepository.findActiveProductCategories();
  return categories.sort((a, b) => a.localeCompare(b));
}