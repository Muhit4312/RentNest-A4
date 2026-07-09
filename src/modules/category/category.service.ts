import { prisma } from "../../lib/prisma";
import { ICatagoryPayload } from "./category.interface"

const createCategoryDB = async (payload: ICatagoryPayload) => {
    const isCategoryExist = await prisma.category.findUnique({
        where: {
            name: payload.name
        }
    });

    if (isCategoryExist) {
        throw new Error("Category already exists");
    }

    const createCategory = await prisma.category.create({
        data: payload
    })


    return createCategory


}

const getCategoriesDB = async () => {

    const categories = await prisma.category.findMany({
        orderBy: {
            createdAt: "desc"
        }
    })

    return categories
}


export const categoryServices = {
    createCategoryDB,
    getCategoriesDB
}