import express from "express";
import cors from "cors";
import paymentRoutes from "./routes/payment.routes";
import { errorHandler } from "./middleware/errorHandler";

const app = express();

app.use(cors());
app.use(express.json());

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "SnailPay Gateway" });
});

app.use("/api/payments", paymentRoutes);

// Global error handler (must be last)
app.use(errorHandler);

export default app;
