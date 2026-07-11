import { RentalStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { ICreateReviewPayload } from "./review.interface";

const createReviewDB = async (payload: ICreateReviewPayload, tenantId: string) => {

    const rental = await prisma.rentalRequest.findFirst({
        where: {
            tenantId,
            propertyId: payload.propertyId 
        }
    })

    if(!rental){
        throw new Error("Rental Request is not exists!")
    }

    if (rental?.status !== RentalStatus.COMPLETED) {
        throw new Error(
            "You can review only after completing the rental."
        )
    }

    const exists = await prisma.review.findFirst({
        where: {
            tenantId,
            propertyId: payload.propertyId
        }
    });

    if (exists) {
        throw new Error("You have already reviewed this property.");
    }

    const review = await prisma.review.create({
        data: {
            propertyId: payload.propertyId,
            tenantId,
            rating: payload.rating,
            comment: payload.comment
        }
    })

    return review;

}

export const reviewServices = {
    createReviewDB
}


