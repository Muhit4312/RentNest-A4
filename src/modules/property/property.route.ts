import { Router } from "express";
import { verifyAuth } from "../../middleWares/verifyAuth";
import { UserRole } from "../../../generated/prisma/enums";
import { properyController } from "./property.controller";

const router = Router()

router.post("/properties",verifyAuth(UserRole.LANDLORD), properyController.createProperty)
router.put("/properties/:id",verifyAuth(UserRole.LANDLORD), properyController.updateProperty)   
router.delete("/properties/:id",verifyAuth(UserRole.LANDLORD), properyController.deleteProperty)
router.get("/requests",verifyAuth(UserRole.LANDLORD), properyController.getLandLordPropertyReq)
router.patch("/requests/:id",verifyAuth(UserRole.LANDLORD), properyController.updateRequestStatusByLandlord)






export const propertyRoutes = router