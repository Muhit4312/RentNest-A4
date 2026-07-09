import { NextFunction, Request, Response } from "express"
import { catchAsync } from "../../utilities/catchAsync"
import { adminServices } from "./admin.service"
import { sendResponse } from "../../utilities/sendResponse"
import httpStatus from "http-status"

const getAllUsers = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const query = req.query

    const users = await adminServices.getAllUsersByAdmin(query)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Users Retrieved Successfully",
        data: {users}

    })

})
const updateUserStatus = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const payload = req.body
    const userId = req.params.id

    const user = await adminServices.updateUserStatusDB(payload, userId as string)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "User Status updated Successfully",
        data: user

    })

})


export const adminController = {
    getAllUsers,
    updateUserStatus,

}