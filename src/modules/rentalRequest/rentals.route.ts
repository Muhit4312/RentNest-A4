import { Router } from "express";
import { verifyAuth } from "../../middleWares/verifyAuth";
import { UserRole } from "../../../generated/prisma/enums";
import { rentalsController } from "./rentals.controller";

const router = Router()

router.post("/", verifyAuth(UserRole.TENANT), rentalsController.createRentals)
router.get("/", verifyAuth(UserRole.TENANT), rentalsController.getAllRentalsRequest)

export const rentalsRoutes = router