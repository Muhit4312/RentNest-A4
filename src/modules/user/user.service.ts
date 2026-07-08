import bcrypt from "bcryptjs"
import { prisma } from "../../lib/prisma"
import config from "../../config/env.config"
import { ILoginUser, IRegisterPayload } from "./user.interface"
import { UserStatus } from "../../../generated/prisma/enums"
import { jwtUtils } from "../../utilities/jwt"
import { JwtPayload, SignOptions } from "jsonwebtoken"

const createUserDB = async (payload: IRegisterPayload) => {

    const { name, email, password } = payload

    const isUserExist = await prisma.user.findUnique({
        where: {
            email
        }
    })

    if (isUserExist) {
        throw new Error("The user is already exist with the email")
    }

    const hashPassword = await bcrypt.hash(password, Number(config.bcrypt_salt_rounds))


    const createUser = await prisma.user.create({
        data: {
            name,
            email,
            password: hashPassword,
        }
    })

    const user = await prisma.user.findUnique({
        where: {
            id: createUser.id,
            email: createUser.email
        },
        omit: {
            password: true
        }
    })

    return user

}

const loginUserDB = async (payload: ILoginUser) => {
    const { email, password } = payload


    const user = await prisma.user.findUnique({
        where: {
            email
        }
    })

    if (!user) {
        throw new Error("User not exist!")
    }

    if (user.status !== UserStatus.ACTIVE) {
        throw new Error("Your account has been blocked. Please contact support.")
    }

    const passwordMatch = await bcrypt.compare(password, user.password)
    if (!passwordMatch) {
        throw new Error("Incorrent credentials.")
    }

    const jwtPayload = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
    }

    const accessToken = jwtUtils.createToken(
        jwtPayload,
        config.jwt_access_secret,
        config.jwt_access_expairs_in as SignOptions)

    const refreshToken = jwtUtils.createToken(
        jwtPayload,
        config.jwt_refress_secret,
        config.jwt_refresh_expairs_in as SignOptions
    );

    return { accessToken, refreshToken }

}

const getCurrentUser = async (userId: string) => {

    const user = await prisma.user.findUniqueOrThrow({
        where: { id: userId },
        omit: {
            password: true
        }
    });

    return user;
}


const refreshToken = async (refreshToken : string) => {
    const verifiedRefreshToken = jwtUtils.verifyToken(refreshToken, config.jwt_refress_secret);

    if(!verifiedRefreshToken){
        throw new Error("invalid token")
    }

    const {id} = verifiedRefreshToken as JwtPayload;

    const user = await prisma.user.findUniqueOrThrow({
        where : {
            id
        }
    })

    if(user.status === "BANNED"){
        throw new Error("User is Banned!")
    }

    const jwtPayload = {
        id,
        name : user.name,
        email : user.email,
        role : user.role
    }


    const accessToken = jwtUtils.createToken(
        jwtPayload,
        config.jwt_access_secret,
        config.jwt_refresh_expairs_in as SignOptions
    );

    return {accessToken}
}

export const userServices = {
    createUserDB,
    loginUserDB,
    getCurrentUser,
    refreshToken
} 