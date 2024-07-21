import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import * as jwt from "jsonwebtoken";
import { PrismaService } from "src/prisma/prisma.service";

interface JWTPayload {
    id: number, iat: number, exp: number
}

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
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
                    request.userRole = user.role
                    request.userId = user.id
                    request.userPostIds = user.posts.map(post => post.id)
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