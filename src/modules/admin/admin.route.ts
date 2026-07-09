import { Router } from "express";
import { verifyAuth } from "../../middleWares/verifyAuth";
import { UserRole } from "../../../generated/prisma/enums";
import { adminController } from "./admin.controller";

const router = Router()

router.get("/users", verifyAuth(UserRole.ADMIN), adminController.getAllUsers)
router.post("/users/:id", verifyAuth(UserRole.ADMIN), adminController.updateUserStatus)

export const adminRoutes = router