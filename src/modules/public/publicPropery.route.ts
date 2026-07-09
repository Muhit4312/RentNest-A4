import { Router } from "express";
import { publicPropertyController } from "./publicProperty.controller";

const router = Router()

router.get("/", publicPropertyController.getAllProperties)
router.get("/:id", publicPropertyController.getPropertyById)

export const publicProperyRoutes = router