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


const getLandLordPropertyReq = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const landlordId = req.user!.id

    const rentalRequests = await propertyServices.getLandLordPropertyReqDB(landlordId)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "All landord's property rental requests are retrieved successfully",
        data: {rentalRequests}
    })
})


const updateRequestStatusByLandlord = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const payload = req.body
    const rentalId = req.params.id
    const landlordId = req.user!.id;

    const request = await propertyServices.updateRequestStatusByLandlord (payload, rentalId as string, landlordId)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Rental request Status has been updated Successfully",
        data: request

    })

})





export const properyController = {
    createProperty,
    updateProperty,
    deleteProperty,
    getLandLordPropertyReq,
    updateRequestStatusByLandlord

}