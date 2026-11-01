import mongoose from "mongoose";
import { Product } from "../catalog/product.model.js";
import { Order } from "../orders/order.model.js";
import { invalidateProductLists } from "../catalog/product.cache.js";

function createError(statusCode, code, message) {
  const error = new Error(message);
  error.statusCode = statusCode;
  error.code = code;
  return error;
}

export async function simulateOrderPayment(userId, orderId, outcome) {
  if (!/^[0-9a-fA-F]{24}$/.test(orderId)) {
    throw createError(400, "INVALID_ORDER_ID", "Order ID is invalid.");
  }

  const session = await mongoose.startSession();
  let finalOrder;

  try {
    await session.withTransaction(async () => {
      const order = await Order.findOne({ _id: orderId, userId }).session(session);

      if (!order) {
        throw createError(404, "ORDER_NOT_FOUND", "Order was not found.");
      }

      // Repeating the same outcome is safe and doesn't change stock again.
      if (
        (order.status === "CONFIRMED" && outcome === "SUCCESS") ||
        (order.status === "CANCELLED" && outcome === "FAILURE")
      ) {
        finalOrder = order;
        return;
      }

      if (order.status !== "PENDING_PAYMENT") {
        throw createError(
          409,
          "ORDER_ALREADY_FINALIZED",
          "This order can no longer be updated.",
        );
      }

      if (outcome === "FAILURE") {
        for (const item of order.items) {
          const result = await Product.updateOne(
            { _id: item.productId },
            { $inc: { stockQuantity: item.quantity } },
            { session, runValidators: true },
          );

          if (result.matchedCount !== 1) {
            throw createError(
              409,
              "PRODUCT_MISSING",
              "Could not restore stock for a product in this order.",
            );
          }
        }

        order.status = "CANCELLED";
      } else {
        order.status = "CONFIRMED";
      }

      await order.save({ session });
      finalOrder = order;
    });

    if (stockChanged) {
      await invalidateProductLists();
    }

    return finalOrder;
  } finally {
    await session.endSession();
  }
}