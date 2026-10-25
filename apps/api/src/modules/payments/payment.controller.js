import { simulateOrderPayment } from "./payment.service.js";

export async function simulatePayment(req, res, next) {
  try {
    const order = await simulateOrderPayment(
      req.user.id,
      req.params.orderId,
      req.body.outcome,
    );

    res.status(200).json({
      data: order,
    });
  } catch (error) {
    next(error);
  }
}