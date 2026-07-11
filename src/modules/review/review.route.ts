import { Router } from "express";
import { verifyAuth } from "../../middleWares/verifyAuth";
import { UserRole } from "../../../generated/prisma/enums";
import { reviewController } from "./review.controller";

const router = Router()

router.post("/",verifyAuth(UserRole.TENANT),reviewController.createReview)


export const reviewRoutes = router