import { prisma } from "../../lib/prisma"
import { IRentalRequestPayload } from "./rentals.interface"

const createRentalsDB = async (payload: IRentalRequestPayload, userId: string) => {

    const property = await prisma.property.findUniqueOrThrow({
        where: {
            id: payload.propertyId
        }
    })

    if (!property.isAvailable) {

        throw new Error("Property is not available.")
    }

    if (property.landlordId === userId) {
        throw new Error("You cannot rent your own property.");
    }

    const exist = await prisma.rentalRequest.findFirst({
        where: {
            propertyId: payload.propertyId,
            tenantId: userId
        }
    });

    if (exist) {
        throw new Error("Rental request already submitted.");
    }

    const rental = await prisma.rentalRequest.create({
        data: {
            moveInDate: new Date(payload.moveInDate),
            message: payload.message,
            note: payload.note,
            tenantId: userId,
            propertyId: payload.propertyId,
        }
    });

    return rental.id

}


const getAllRentalsRequestsDB = async (userId: string) => {

    const rentals = await prisma.rentalRequest.findMany({
        where: {
            tenantId: userId
        },
        include: {
            property: true,
            tenant: {
                omit: {
                    password: true
                }
            }
        },
        orderBy: {
            createdAt: "desc"
        }
    });

    return rentals
}


const getRentalRequestByIdDB = async (rentalId: string) => {

    const rental = await prisma.rentalRequest.findUniqueOrThrow({
        where: {
            id: rentalId
        },
        include: {
            property: {
                include: {
                    category: true,
                    landlord: {
                        omit: {
                            password: true
                        }
                    }
                }

            },
            tenant: {
                omit: {
                    password: true
                }
            }

        }
    });


    return rental



}



export const rentalsServices = {
    createRentalsDB,
    getAllRentalsRequestsDB,
    getRentalRequestByIdDB
}