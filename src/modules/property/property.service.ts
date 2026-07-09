import { PropertyWhereInput } from "../../../generated/prisma/models"
import { prisma } from "../../lib/prisma"
import { IPropertyPayload, IUpdatePropertyPayload } from "./property.interface"

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




export const propertyServices = {
    createPropertyDB,
    updatedPropertyDB,
    deltedPropertyDB,

}