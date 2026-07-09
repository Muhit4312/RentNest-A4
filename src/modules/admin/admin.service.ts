import { UserStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
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

    return users
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


export const adminServices = {
    getAllUsersByAdmin,
    updateUserStatusDB
}