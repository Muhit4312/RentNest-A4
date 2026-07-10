import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utilities/catchAsync";
import { sendResponse } from "../../utilities/sendResponse";
import httpStatus from "http-status"
import { paymentService } from "./payment.service";

const createPayment = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const rentalRequestId = req.body.rentalRequestId;
    const tenantId = req.user!.id

    const session = await paymentService.createPaymentSession(rentalRequestId, tenantId)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Checkout session created successfully",
        data: session
    });

})

const confirmPayment = catchAsync(
    async( req : Request, res : Response, next : NextFunction) => {
        const event = req.body as Buffer;
        const signature = req.headers['stripe-signature']!;

        await paymentService.confirmPaymentDB(event, signature as string)

        sendResponse(res, {
            success : true,
            statusCode : 200,
            message : "Webhook triggered successfully",
            data : null
        })
    }
)

const getMyPayments = catchAsync(async (req, res) => {

    const userId = req.user!.id;

    const result = await paymentService.getMyPaymentsDB(userId);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Payment history retrieved successfully",
        data: result
    });

})



export const paymentController = {
    createPayment,
    confirmPayment,
    getMyPayments
}