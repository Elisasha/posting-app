import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import * as jwt from "jsonwebtoken";
import { PrismaService } from "src/prisma/prisma.service";

interface JWTPayload {
    id: number, iat: number, exp: number
}

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector,
        private readonly prismaService: PrismaService
    ) { }
    async canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest()
        const token = request.headers?.authorization?.split("Bearer ")[1]
        if (token) {
            try {
                const payload = (jwt.verify(token, process.env.JWT_KEY)) as JWTPayload
                const user = await this.prismaService.user.findUnique({
                    include: {
                        posts: true,
                      },
                    where: {
                        id: payload.id
                    }
                })
                if (!user) {
                    return false
                }
                else {
                    const postIds = user.posts.map(post => post.id)
                    request.userRole = user.role
                    request.userId = user.id
                    request.userPostIds = postIds
                    return true   
                }
            } catch (error) {
                // TODO add message
                return false
            }
        }
        return false
    }
}