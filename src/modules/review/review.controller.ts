import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utilities/catchAsync";
import { sendResponse } from "../../utilities/sendResponse";
import httpStatus from "http-status"
import { reviewServices } from "./review.service";

const createReview = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const tenantId = req.user!.id;

    const result = await reviewServices.createReviewDB(req.body,tenantId)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Review submitted successfully",
        data: result
    });

})

export const reviewController = {
    createReview,

}