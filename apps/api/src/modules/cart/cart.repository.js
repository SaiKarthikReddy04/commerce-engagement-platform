import { Cart } from "./cart.model.js";

export function findOrCreateCart(userId) {
  return Cart.findOneAndUpdate(
    { userId },
    {
      $setOnInsert: {
        userId,
        items: [],
      },
    },
    {
      upsert: true,
      returnDocument: "after",
      setDefaultsOnInsert: true,
    },
  );
}

export function findCartByUserId(userId) {
  return Cart.findOne({ userId })
    .populate({
      path: "items.productId",
      select: "sku name description category brand price stockQuantity status images",
    })
    .lean();
}

export function saveCart(cart) {
  return cart.save();
}