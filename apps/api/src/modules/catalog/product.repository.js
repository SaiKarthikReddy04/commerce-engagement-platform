import { Product } from "./product.model.js";

export function findProducts({
  filter = {},
  sort = { createdAt: -1 },
  skip = 0,
  limit = 20,
} = {}) {
  return Product.find(filter).sort(sort).skip(skip).limit(limit).lean();
}

export function countProducts(filter = {}) {
  return Product.countDocuments(filter);
}

export function findProductById(id) {
  return Product.findById(id).lean();
}

export function createProduct(productData) {
  return Product.create(productData);
}

export function updateProductById(id, productData) {
  return Product.findByIdAndUpdate(id, productData, {
    new: true,
    runValidators: true,
  });
}

export function deleteProductById(id) {
  return Product.findByIdAndDelete(id);
}

export function findActiveProductCategories() {
  return Product.distinct("category", { status: "ACTIVE" });
}