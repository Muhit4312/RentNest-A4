import { UserStatus } from "../../../generated/prisma/enums";
import { PropertyWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";
import { IPropertyQuery } from "../public/publicProperty.interface";
import { IUpdateUserStatus, IUsersQuery } from "./admin.interface";

const getAllUsersByAdmin = async (query: IUsersQuery) => {


    const limit = query.limit ? Number(query.limit) : 10;
    const page = query.page ? Number(query.page) : 1;
    const skip = (page - 1) * limit;


    const users = await prisma.user.findMany({


        take: limit,
        skip,
        orderBy: {
            createdAt: "asc"
        },
        omit: {
            password: true
        },
        include: {
            properties: true,
            rentalRequest: true,
        }

    })

    const totalPropertiesCount = await prisma.property.count()

    return {
        data: users,
        meta: {
            page,
            limit,
            total: totalPropertiesCount,
            totalPage: Math.ceil(totalPropertiesCount / limit)

        }
    }
}


const updateUserStatusDB = async (payload: IUpdateUserStatus, userId: string) => {

    const user = await prisma.user.findUnique({
        where: {
            id: userId
        }
    })

    if (!user) {
        throw new Error("User is not exists!")
    }

    const updatedUser = await prisma.user.update({
        where: {
            id: userId
        },
        data: {
            status: payload.status
        },
        omit: {
            password: true
        }
    })

    return updatedUser

}


const getAllPropertiesDB = async (query: IPropertyQuery) => {

    const limit = query.limit ? Number(query.limit) : 10;
    const page = query.page ? Number(query.page) : 1;
    const skip = (page - 1) * limit;



    const andConditions: PropertyWhereInput[] = []


    if (query.searchTerm) {
        andConditions.push({
            OR: [
                {
                    title: {
                        contains: query.searchTerm,
                        mode: "insensitive"
                    }
                },
                {
                    description: {
                        contains: query.searchTerm,
                        mode: "insensitive"
                    }
                }
            ]
        })
    }



    const properties = await prisma.property.findMany({
        where: {
            AND: andConditions
        },
        take: limit,
        skip: skip,
        orderBy: {
            updatedAt: "desc"
        },
        include: {
            landlord: {
                omit: {
                    password: true
                }
            },
            category: true,
            rentalRequest: true,
        }
    })

    const totalPropertiesCount = await prisma.property.count({
        where: {
            AND: andConditions
        }
    })

    return {
        data: properties,
        meta: {
            page,
            limit,
            total: totalPropertiesCount,
            totalPage: Math.ceil(totalPropertiesCount / limit)

        }
    }


}



export const adminServices = {
    getAllUsersByAdmin,
    updateUserStatusDB,
    getAllPropertiesDB
}