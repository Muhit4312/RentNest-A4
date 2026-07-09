import { NextFunction, Request, Response } from "express"
import { catchAsync } from "../../utilities/catchAsync"
import httpStatus from "http-status"
import { sendResponse } from "../../utilities/sendResponse"
import { propertyServices } from "./property.service"

const createProperty = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body
    const userId = req.user!.id

    const property = await propertyServices.createPropertyDB(payload, userId)


    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Category created successfully",
        data: {property}
    })

})

const updateProperty = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body
    const userId = req.user!.id
    const propertyId = req.params.id

    const property = await propertyServices.updatedPropertyDB(payload, userId, propertyId as string)


    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Category updated successfully",
        data: {property}
    })

})
const deleteProperty = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user!.id
    const propertyId = req.params.id

    await propertyServices.deltedPropertyDB( userId, propertyId as string)


    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Category deleted successfully",
        data: null
    })

})





export const properyController = {
    createProperty,
    updateProperty,
    deleteProperty,

}