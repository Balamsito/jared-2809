import { Router } from "express";
import { validatePayment } from "../middleware/validatePayment";
import { processPayment } from "../controllers/payment.controller";

const router = Router();

router.post("/", validatePayment, processPayment);

export default router;
