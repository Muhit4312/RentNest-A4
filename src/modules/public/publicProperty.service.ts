import { PropertyWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";
import { IPropertyQuery } from "./publicProperty.interface";

const getAllPropertiesDB = async (query: IPropertyQuery) => {

    const limit = query.limit ? Number(query.limit) : 10;
    const page = query.page ? Number(query.page) : 1;
    const skip = (page - 1) * limit;
    const sortBy =
    query.sortBy && [
        "createdAt",
        "rent",
        "title"
    ].includes(query.sortBy)
        ? query.sortBy
        : "createdAt";
    const sortOrder = query.sortOrder ? query.sortOrder : "desc"

    const category = query.category ? JSON.parse(query.category as string) : null

    const categoryArray = Array.isArray(category) ? category : []


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

    if (query.title) {
        andConditions.push({
            title: query.title
        })
    }

    if (query.description) {
        andConditions.push({
            description: query.description
        })
    }

    if (query.location) {
        andConditions.push({
            location: query.location
        })
    }

    if (query.rent) {
        andConditions.push({
            rent: query.rent
        })
    }

    if (query.landlordId) {
        andConditions.push({
            landlordId: query.landlordId
        })
    }

    if (categoryArray.length) {
        andConditions.push({
            categoryId: {
                in: categoryArray
            }
        })
    }

    andConditions.push({
        isAvailable: true
    })


    const properties = await prisma.property.findMany({
        where: {
            AND: andConditions
        },
        take: limit,
        skip: skip,
        orderBy: {
            [sortBy]: sortOrder
        },
        include: {
            landlord: {
                omit: {
                    password: true
                }
            },
            category: true
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


const getPropertyByIdDB = async (propertyId: string) => {

    const property = await prisma.property.findUnique({
        where: {
            id: propertyId
        }
    })

    if (!property) {
        throw new Error("Property not found!!");
    }

    return property

}

export const publicPropertyServices = {
    getAllPropertiesDB,
    getPropertyByIdDB
}