import {
  getUserOrder,
  listPendingOrganizationOrders,
  listUserOrders,
  placeOrder,
  reviewOrganizationOrder as reviewOrganizationOrderService,
} from "./order.service.js";
  
export async function createOrder(req, res, next) {
  try {
    const order = await placeOrder(
        req.user.id,
        req.body?.organizationId ?? null,
      );

    res.status(201).json({
      data: order,
    });
  } catch (error) {
    next(error);
  }
}

export async function listOrders(req, res, next) {
    try {
      const result = await listUserOrders(req.user.id, req.query);
  
      res.status(200).json({
        data: result.orders,
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
}

export async function getOrder(req, res, next) {
    try {
      const order = await getUserOrder(req.user.id, req.params.orderId);
      res.status(200).json({ data: order });
    } catch (error) {
      next(error);
    }
}

export async function reviewOrganizationOrder(req, res, next) {
  try {
    const order = await reviewOrganizationOrderService(
      req.user.id,
      req.params.organizationId,
      req.params.orderId,
      req.body.decision,
    );

    res.status(200).json({ data: order });
  } catch (error) {
    next(error);
  }
}

export async function getPendingOrganizationOrders(req, res, next) {
  try {
    const result = await listPendingOrganizationOrders(
      req.params.organizationId,
      req.query,
    );

    res.status(200).json({
      data: result.orders,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
}