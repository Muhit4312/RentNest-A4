import { NextFunction, Request, Response } from "express"
import { catchAsync } from "../../utilities/catchAsync"
import { sendResponse } from "../../utilities/sendResponse"
import httpStatus from "http-status"
import { publicPropertyServices } from "./publicProperty.service"

const getAllProperties = catchAsync(async(req: Request, res: Response, next: NextFunction) => {

    const query = req.query

    const result = await publicPropertyServices.getAllPropertiesDB(query)

    sendResponse(res, {
        success : true,
        statusCode : httpStatus.OK,
        message : "Properties Retrieved Successfully",
        data: result.data,
        meta: result.meta
    })

})


const getPropertyById = catchAsync(async(req: Request, res: Response, next: NextFunction) => {

    const propertyId = req.params.id

    const result = await publicPropertyServices.getPropertyByIdDB(propertyId as string)

    sendResponse(res, {
        success : true,
        statusCode : httpStatus.OK,
        message : "Property Retrieved Successfully",
        data: result
    })

})

export const publicPropertyController = {
    getAllProperties,
    getPropertyById
}