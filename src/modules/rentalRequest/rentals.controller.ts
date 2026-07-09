import { NextFunction, Request, Response } from "express"
import { catchAsync } from "../../utilities/catchAsync"
import { sendResponse } from "../../utilities/sendResponse"
import httpStatus from "http-status"
import { rentalsServices } from "./rentals.service"

const createRentals = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body
    const userId = req.user!.id

    const id = await rentalsServices.createRentalsDB(payload, userId)


    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Rentals request submitted successfully",
        data: {id}
    })

})
const getAllRentalsRequest = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user!.id

    const result = await rentalsServices.getAllRentalsRequestsDB(userId)


    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Rental requests retrieved successfully",
        data: {result}
    })

})

const getRentalRequestById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const rentalId = req.params.id
    const rental = await rentalsServices.getRentalRequestByIdDB(rentalId as string)


    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Rental request retrieved successfully",
        data: {rental}
    })
})

export const rentalsController = {
    createRentals,
    getAllRentalsRequest,
    getRentalRequestById,

}