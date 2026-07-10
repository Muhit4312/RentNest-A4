import { Router } from "express";
import { verifyAuth } from "../../middleWares/verifyAuth";
import { UserRole } from "../../../generated/prisma/enums";
import { paymentController } from "./payment.controller";

const router = Router()

router.post(
    "/create",
    verifyAuth(UserRole.TENANT),
    paymentController.createPayment
)

router.post(
    "/confirm",
    paymentController.confirmPayment
)

router.get(
    "/",
    verifyAuth(UserRole.TENANT),
    paymentController.getMyPayments
);

export const paymentRoutes = router