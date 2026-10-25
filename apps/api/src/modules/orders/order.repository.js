import { Order } from "./order.model.js";

export function findOrdersByUserId(userId, { skip = 0, limit = 20 } = {}) {
  return Order.find({ userId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();
}

export function countOrdersByUserId(userId) {
  return Order.countDocuments({ userId });
}

export function findOrderByIdForUser(orderId, userId) {
  return Order.findOne({ _id: orderId, userId }).lean();
}

export function findPendingApprovalOrdersByOrganizationId(
    organizationId,
    { skip = 0, limit = 20 } = {},
  ) {
    return Order.find({
      organizationId,
      status: "PENDING_APPROVAL",
    })
      .populate({
        path: "userId",
        select: "name email",
      })
      .sort({ createdAt: 1 })
      .skip(skip)
      .limit(limit)
      .lean();
}

export function countPendingApprovalOrdersByOrganizationId(organizationId) {
    return Order.countDocuments({
      organizationId,
      status: "PENDING_APPROVAL",
    });
}