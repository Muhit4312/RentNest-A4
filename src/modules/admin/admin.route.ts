import { Router } from "express";
import { verifyAuth } from "../../middleWares/verifyAuth";
import { UserRole } from "../../../generated/prisma/enums";
import { adminController } from "./admin.controller";

const router = Router()

router.get("/users", verifyAuth(UserRole.ADMIN), adminController.getAllUsers)
router.post("/users/:id", verifyAuth(UserRole.ADMIN), adminController.updateUserStatus)

router.get("/properties", verifyAuth(UserRole.ADMIN), adminController.getAllProperties )
router.get("/rentals", verifyAuth(UserRole.ADMIN), adminController.getAllRentalsReq)


export const adminRoutes = router