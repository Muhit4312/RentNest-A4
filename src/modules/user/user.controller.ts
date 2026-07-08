import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utilities/catchAsync";
import { userServices } from "./user.service";
import { sendResponse } from "../../utilities/sendResponse";
import httpStatus from "http-status"

const createUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body

    const user = await userServices.createUserDB(payload)


    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "User registered successfully",
        data: { user }
    })

})
const userLogin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body

    const result = await userServices.loginUserDB(payload)

    res.cookie("accessToken", result.accessToken, {
        httpOnly: true,
        secure: false,
        sameSite: "none",
        maxAge: 1000 * 60 * 60 * 24 // 24 hour or 1 day
    })

    res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "none",
        maxAge: 1000 * 60 * 60 * 24 * 7 // 7 day
    })


    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "User login successfully",
        data: result
    })

})

const currentUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const userId = req.user!.id
    const user = await userServices.getCurrentUser(userId)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "User retrived successfully",
        data: { user }
    })



})


const refreshToken = catchAsync(async (req : Request, res : Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken;

    const {accessToken} = await userServices.refreshToken(refreshToken);

    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: false,
        sameSite: "none",
        maxAge: 1000 * 60 * 60 * 24 // 24 hour or 1 day
    })

    sendResponse(res, {
        success : true,
        statusCode : httpStatus.OK,
        message : "Token Refreshed Successfully",
        data : {
            accessToken
        }
    })
})

export const userController = {
    createUser,
    userLogin,
    currentUser,
    refreshToken
}