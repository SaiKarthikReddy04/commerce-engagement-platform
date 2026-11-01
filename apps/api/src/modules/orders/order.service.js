import mongoose from "mongoose";
import { Cart } from "../cart/cart.model.js";
import { Product } from "../catalog/product.model.js";
import { Order } from "./order.model.js";
import {
    countOrdersByUserId,
    findOrderByIdForUser,
    findOrdersByUserId,
    countPendingApprovalOrdersByOrganizationId,
    findPendingApprovalOrdersByOrganizationId,
} from "./order.repository.js";
import { Organization } from "../organizations/organization.model.js";
import { OrganizationMembership } from "../organizations/organization-membership.model.js";
import { invalidateProductLists } from "../catalog/product.cache.js";

function createError(statusCode, code, message) {
  const error = new Error(message);
  error.statusCode = statusCode;
  error.code = code;
  return error;
}

export async function placeOrder(userId, organizationId = null) {
  const session = await mongoose.startSession();
  let createdOrder;

  try {
    await session.withTransaction(async () => {
        let organization = null;

        if (organizationId) {
          organization = await Organization.findOne({
            _id: organizationId,
            status: "ACTIVE",
          }).session(session);
        
          if (!organization) {
            throw createError(
              404,
              "ORGANIZATION_NOT_FOUND",
              "Active organization was not found.",
            );
          }
        
          const membership = await OrganizationMembership.findOne({
            organizationId,
            userId,
            status: "ACTIVE",
            role: { $in: ["BUYER", "ORG_ADMIN"] },
          }).session(session);
        
          if (!membership) {
            throw createError(
              403,
              "ORGANIZATION_PURCHASE_FORBIDDEN",
              "You are not allowed to purchase for this organization.",
            );
          }
        }
      
      const cart = await Cart.findOne({ userId }).session(session);

      if (!cart || cart.items.length === 0) {
        throw createError(400, "CART_EMPTY", "Your cart is empty.");
      }

      const orderItems = [];
      let subtotalInPaise = 0;

    for (const cartItem of cart.items) {
        const product = await Product.findOneAndUpdate(
          {
            _id: cartItem.productId,
            status: "ACTIVE",
            stockQuantity: { $gte: cartItem.quantity },
          },
          {
            $inc: { stockQuantity: -cartItem.quantity },
          },
          {
            returnDocument: "after",
            runValidators: true,
            session,
          },
        ).lean();

        if (!product) {
          throw createError(
            409,
            "PRODUCT_UNAVAILABLE_OR_INSUFFICIENT_STOCK",
            "A product is unavailable or has insufficient stock.",
          );
        }

        const unitPriceInPaise = product.price.amountInPaise;
        const lineTotalInPaise = unitPriceInPaise * cartItem.quantity;

            if (!Number.isSafeInteger(lineTotalInPaise)) {
            throw createError(
                400,
                "ORDER_TOTAL_TOO_LARGE",
                "The order total is too large.",
            );
            }

            subtotalInPaise += lineTotalInPaise;

            if (!Number.isSafeInteger(subtotalInPaise)) {
            throw createError(
                400,
                "ORDER_TOTAL_TOO_LARGE",
                "The order total is too large.",
            );
            }

            orderItems.push({
            productId: product._id,
            sku: product.sku,
            name: product.name,
            quantity: cartItem.quantity,
            unitPriceInPaise,
            lineTotalInPaise,
            });
    }
                
    if (
        organization?.spendingLimitInPaise !== null &&
        organization?.spendingLimitInPaise !== undefined &&
        subtotalInPaise > organization.spendingLimitInPaise
        ) {
        throw createError(
            409,
            "ORGANIZATION_SPENDING_LIMIT_EXCEEDED",
            "The order exceeds the organization's spending limit.",
        );
    }
        
      const [order] = await Order.create(
        [
          {
            userId,
            items: orderItems,
            currency: "INR",
            subtotalInPaise,
            organizationId: organization?._id ?? null,
            status: organization?.requiresApproval
            ? "PENDING_APPROVAL"
            : "PENDING_PAYMENT",
          },
        ],
        { session },
      );

      cart.items = [];
      await cart.save({ session });

      createdOrder = order;
    });

    await invalidateProductLists();
    return createdOrder;
  } finally {
    await session.endSession();
  }
}

export async function listUserOrders(userId, { page = 1, limit = 20 } = {}) {
    const pageNumber = Number(page);
    const limitNumber = Number(limit);
  
    if (
      !Number.isInteger(pageNumber) ||
      pageNumber < 1 ||
      !Number.isInteger(limitNumber) ||
      limitNumber < 1 ||
      limitNumber > 50
    ) {
      throw createError(
        400,
        "INVALID_PAGINATION",
        "Page must be positive and limit must be between 1 and 50.",
      );
    }
  
    const skip = (pageNumber - 1) * limitNumber;
  
    const [orders, total] = await Promise.all([
      findOrdersByUserId(userId, { skip, limit: limitNumber }),
      countOrdersByUserId(userId),
    ]);
  
    return {
      orders,
      pagination: {
        page: pageNumber,
        limit: limitNumber,
        total,
        pages: Math.ceil(total / limitNumber),
      },
    };
}

export async function getUserOrder(userId, orderId) {
    if (!/^[0-9a-fA-F]{24}$/.test(orderId)) {
      throw createError(400, "INVALID_ORDER_ID", "Order ID is invalid.");
    }
  
    const order = await findOrderByIdForUser(orderId, userId);
  
    if (!order) {
      throw createError(404, "ORDER_NOT_FOUND", "Order was not found.");
    }
  
    return order;
}

export async function reviewOrganizationOrder(
    approverUserId,
    organizationId,
    orderId,
    decision,
  ) {
    if (
      !/^[0-9a-fA-F]{24}$/.test(organizationId) ||
      !/^[0-9a-fA-F]{24}$/.test(orderId)
    ) {
      throw createError(400, "INVALID_ID", "Organization or order ID is invalid.");
    }
  
    const session = await mongoose.startSession();
    let reviewedOrder;
  
    try {
      await session.withTransaction(async () => {
        const membership = await OrganizationMembership.findOne({
          organizationId,
          userId: approverUserId,
          status: "ACTIVE",
          role: { $in: ["ORG_ADMIN", "APPROVER"] },
        }).session(session);
  
        if (!membership) {
          throw createError(
            403,
            "ORGANIZATION_APPROVAL_FORBIDDEN",
            "You cannot review orders for this organization.",
          );
        }
  
        const order = await Order.findOne({
          _id: orderId,
          organizationId,
        }).session(session);
  
        if (!order) {
          throw createError(404, "ORDER_NOT_FOUND", "Order was not found.");
        }
  
        if (order.approvalDecision === decision) {
          reviewedOrder = order;
          return;
        }
  
        if (order.status !== "PENDING_APPROVAL") {
          throw createError(
            409,
            "ORDER_NOT_PENDING_APPROVAL",
            "This order is no longer awaiting approval.",
          );
        }
  
        if (order.userId.toString() === approverUserId) {
          throw createError(
            403,
            "SELF_APPROVAL_NOT_ALLOWED",
            "You cannot approve your own order.",
          );
        }
  
        if (decision === "REJECTED") {
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
          order.status = "PENDING_PAYMENT";
        }
  
        order.approvalDecision = decision;
        order.reviewedBy = approverUserId;
        order.reviewedAt = new Date();
  
        await order.save({ session });
        reviewedOrder = order;
      });
  
      if (stockChanged) {
        await invalidateProductLists();
      }

      return reviewedOrder;
    } finally {
      await session.endSession();
    }
}

export async function listPendingOrganizationOrders(
    organizationId,
    { page = 1, limit = 20 } = {},
  ) {
    const pageNumber = Number(page);
    const limitNumber = Number(limit);
  
    if (
      !Number.isInteger(pageNumber) ||
      pageNumber < 1 ||
      !Number.isInteger(limitNumber) ||
      limitNumber < 1 ||
      limitNumber > 50
    ) {
      throw createError(
        400,
        "INVALID_PAGINATION",
        "Page must be positive and limit must be between 1 and 50.",
      );
    }
  
    const skip = (pageNumber - 1) * limitNumber;
  
    const [orders, total] = await Promise.all([
      findPendingApprovalOrdersByOrganizationId(organizationId, {
        skip,
        limit: limitNumber,
      }),
      countPendingApprovalOrdersByOrganizationId(organizationId),
    ]);
  
    return {
      orders,
      pagination: {
        page: pageNumber,
        limit: limitNumber,
        total,
        pages: Math.ceil(total / limitNumber),
      },
    };
}