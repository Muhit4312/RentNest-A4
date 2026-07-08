import { Router } from "express";
import { userController } from "./user.controller";
import { verifyAuth } from "../../middleWares/verifyAuth";
import { UserRole } from "../../../generated/prisma/enums";

const router = Router()

router.post("/register", userController.createUser)
router.post("/login", userController.userLogin)
router.get("/me",verifyAuth(UserRole.TENANT, UserRole.LANDLORD, UserRole.ADMIN), userController.currentUser)

router.post("/refresh-token", userController.refreshToken)



export const userRoutes = router