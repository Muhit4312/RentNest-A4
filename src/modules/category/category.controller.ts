import { NextFunction, Request, Response } from "express"
import { catchAsync } from "../../utilities/catchAsync"
import { sendResponse } from "../../utilities/sendResponse"
import { categoryServices } from "./category.service"
import httpStatus from "http-status"

const createCategory = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body

    const category = await categoryServices.createCategoryDB(payload)


    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Property created successfully",
        data: {category}
    })

})
const getCategories = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const categories = await categoryServices.getCategoriesDB()


    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Property created successfully",
        data: {categories}
    })

})



export const categoryController = {
    createCategory,
    getCategories
}