import { findProductById } from "../catalog/product.repository.js";
import {
  findCartByUserId,
  findOrCreateCart,
  saveCart,
} from "./cart.repository.js";

function createError(statusCode, code, message) {
  const error = new Error(message);
  error.statusCode = statusCode;
  error.code = code;
  return error;
}

async function loadCart(userId) {
  await findOrCreateCart(userId);
  return findCartByUserId(userId);
}

function toCartResponse(cart) {
  const items = cart.items.map(({ productId, quantity }) => {
    const product = productId;
    const available =
      product !== null &&
      product.status === "ACTIVE" &&
      product.stockQuantity >= quantity;

    const lineTotalInPaise = available
      ? product.price.amountInPaise * quantity
      : null;

    return {
      product: product
        ? {
            id: product._id.toString(),
            sku: product.sku,
            name: product.name,
            brand: product.brand,
            price: product.price,
            stockQuantity: product.stockQuantity,
            status: product.status,
            images: product.images,
          }
        : null,
      quantity,
      available,
      lineTotalInPaise,
    };
  });

  const subtotalInPaise = items.reduce(
    (sum, item) => sum + (item.lineTotalInPaise ?? 0),
    0,
  );

  return {
    id: cart._id.toString(),
    items,
    subtotal: {
      amountInPaise: subtotalInPaise,
      currency: "INR",
    },
    updatedAt: cart.updatedAt,
  };
}

async function getActiveProduct(productId) {
  const product = await findProductById(productId);

  if (!product || product.status !== "ACTIVE") {
    throw createError(404, "PRODUCT_NOT_AVAILABLE", "Product is not available.");
  }

  return product;
}

function findCartItem(cart, productId) {
  return cart.items.find((item) => item.productId.toString() === productId);
}

export async function getUserCart(userId) {
  return toCartResponse(await loadCart(userId));
}

export async function addItemToCart(userId, { productId, quantity }) {
  const product = await getActiveProduct(productId);

  const cart = await findOrCreateCart(userId);
  const existingItem = findCartItem(cart, productId);
  const newQuantity = (existingItem?.quantity ?? 0) + quantity;

  if (newQuantity > product.stockQuantity) {
    throw createError(409, "INSUFFICIENT_STOCK", "Requested quantity exceeds available stock.");
  }

  if (existingItem) {
    existingItem.quantity = newQuantity;
  } else {
    cart.items.push({ productId, quantity });
  }

  await saveCart(cart);
  return toCartResponse(await loadCart(userId));
}

export async function updateCartItemQuantity(userId, productId, quantity) {
  const product = await getActiveProduct(productId);

  if (quantity > product.stockQuantity) {
    throw createError(409, "INSUFFICIENT_STOCK", "Requested quantity exceeds available stock.");
  }

  const cart = await findOrCreateCart(userId);
  const item = findCartItem(cart, productId);

  if (!item) {
    throw createError(404, "CART_ITEM_NOT_FOUND", "That product is not in the cart.");
  }

  item.quantity = quantity;
  await saveCart(cart);

  return toCartResponse(await loadCart(userId));
}

export async function removeItemFromCart(userId, productId) {
  const cart = await findOrCreateCart(userId);
  const originalLength = cart.items.length;

  cart.items = cart.items.filter(
    (item) => item.productId.toString() !== productId,
  );

  if (cart.items.length === originalLength) {
    throw createError(404, "CART_ITEM_NOT_FOUND", "That product is not in the cart.");
  }

  await saveCart(cart);
  return toCartResponse(await loadCart(userId));
}

export async function clearUserCart(userId) {
  const cart = await findOrCreateCart(userId);
  cart.items = [];
  await saveCart(cart);

  return toCartResponse(await loadCart(userId));
}