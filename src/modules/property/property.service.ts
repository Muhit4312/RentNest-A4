import { RentalStatus } from "../../../generated/prisma/enums"
import { PropertyWhereInput } from "../../../generated/prisma/models"
import { prisma } from "../../lib/prisma"
import { IPropertyPayload, IRentalReqStatus, IUpdatePropertyPayload } from "./property.interface"

const createPropertyDB = async (payload: IPropertyPayload, userId: string) => {

    const result = await prisma.property.create({
        data: {
            ...payload,
            landlordId: userId
        }
    })

    return result


}


const updatedPropertyDB = async (payload: IUpdatePropertyPayload, userId: string, propertyId: string) => {

    const property = await prisma.property.findUnique({
        where: {
            id: propertyId,
            landlordId: userId
        }
    })

    if (!property) {
        throw new Error("Property not found or you are not authorized.");
    }



    const updateProperty = await prisma.property.update({
        where: {
            id: propertyId
        },
        data: payload,
        include: {
            landlord: {
                omit: {
                    password: true
                }
            }
        }
    })


    return updateProperty


}

const deltedPropertyDB = async (userId: string, propertyId: string) => {

    const property = await prisma.property.findUnique({
        where: {
            id: propertyId,
            landlordId: userId
        }
    })

    if (!property) {
        throw new Error("Property not found or you are not authorized.");
    }



    await prisma.property.delete({
        where: {
            id: propertyId
        }
    })



}

const getLandLordPropertyReqDB = async (landlordId: string) => {

    const requests = await prisma.rentalRequest.findMany({
        where: {
            property: {
                landlordId
            }
        },
        include: {
            tenant: {
                omit: {
                    password: true
                }
            },
            property: {
                include: {
                    category: true
                }
            },
            //payment: true
        },
        orderBy: {
            createdAt: "desc"
        }
    })

    return requests

}

const updateRequestStatusByLandlord = async (payload: IRentalReqStatus, rentalId: string, landlordId: string) => {

    const rental = await prisma.rentalRequest.findUnique({
        where: {
            id: rentalId
        },
        include: {
            property: true
        }
    });

    if (!rental) {
        throw new Error("Rental request not found.");
    }

    if (rental.property.landlordId !== landlordId) {
        throw new Error("You are not authorized.");
    }

    if (rental.status !== RentalStatus.PENDING) {
        throw new Error("Rental request already processed.");
    }

    const updatedRental = await prisma.rentalRequest.update({
        where: {
            id: rentalId
        },
        data: {
            status: payload.status
        }
    });

    return updatedRental;


}




export const propertyServices = {
    createPropertyDB,
    updatedPropertyDB,
    deltedPropertyDB,
    getLandLordPropertyReqDB,
    updateRequestStatusByLandlord,

}