import { NextFunction, Request, Response } from "express"
import { catchAsync } from "../utilities/catchAsync"
import { jwtUtils } from "../utilities/jwt"
import config from "../config/env.config"
import { UserRole } from "../../generated/prisma/enums"
import { JwtPayload } from "jsonwebtoken"
import { prisma } from "../lib/prisma"

export const verifyAuth = (...requiredRoles : UserRole[]) => {
    return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const token =
            req.cookies.accessToken ||
            (req.headers.authorization?.startsWith("Bearer ")
                ? req.headers.authorization?.split(" ")[1] :
                req.headers.authorization)


         if (!token) {
            throw new Error("You are not logged in.")
        }

        const verifiedToken = jwtUtils.verifyToken(token, config.jwt_access_secret)

        if (!verifiedToken) {
            throw new Error("Invalid Token")
        }

        const { id, email, name, role } = verifiedToken as JwtPayload
        
        if (requiredRoles.length && !requiredRoles.includes(role)) {
            throw new Error("Forbidden access to resources.")
        }

        const user = await prisma.user.findUnique({
            where: {
                id,
                email
            }
        })

        if (!user) {
            throw new Error("User not found!")
        }

        if(user.status !== "ACTIVE"){
            throw new Error("You are banned.")
        }

        req.user = {
            id, email, name, role
        }

        next()




    })
} 