import "dotenv/config";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import productRoutes from "./modules/catalog/product.routes.js";
import authRoutes from "./modules/auth/auth.routes.js";
import cartRoutes from "./modules/cart/cart.routes.js";
import orderRoutes from "./modules/orders/order.routes.js";
import paymentRoutes from "./modules/payments/payment.routes.js";
import organizationRoutes from "./modules/organizations/organization.routes.js";
import orderApprovalRoutes from "./modules/orders/order-approval.routes.js";

const app = express();

app.disable("x-powered-by");
app.use(helmet());

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json({ limit: "1mb" }));
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/cart", cartRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/payments", paymentRoutes);
app.use("/api/v1/organizations", organizationRoutes);
app.use("/api/v1/organizations", orderApprovalRoutes);

app.get("/api/v1/health", (_req, res) => {
  res.status(200).json({
    data: {
      status: "ok",
      service: "commerce-api",
      timestamp: new Date().toISOString(),
    },
  });
});

app.use((_req, res) => {
  res.status(404).json({
    error: {
      code: "ROUTE_NOT_FOUND",
      message: "The requested API route does not exist.",
    },
  });
});

app.use((error, req, res, next) => {
    if (res.headersSent) {
      return next(error);
    }
  
    const statusCode = Number.isInteger(error.statusCode)
      ? error.statusCode
      : 500;
  
    const code =
      error.code ||
      (statusCode >= 500 ? "INTERNAL_SERVER_ERROR" : "REQUEST_ERROR");
  
    const message =
      statusCode >= 500 && process.env.NODE_ENV === "production"
        ? "Internal server error."
        : error.message || "Unexpected server error.";
  
    res.status(statusCode).json({
      error: {
        code,
        message,
      },
    });
  });

export default app;