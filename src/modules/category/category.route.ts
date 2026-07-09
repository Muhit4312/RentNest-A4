import { Router } from "express";
import { categoryController } from "./category.controller";
import { verifyAuth } from "../../middleWares/verifyAuth";
import { UserRole } from "../../../generated/prisma/enums";

const router = Router()

router.post("/",verifyAuth(UserRole.ADMIN), categoryController.createCategory)
router.get("/", categoryController.getCategories)


export const categoryRoutes = router