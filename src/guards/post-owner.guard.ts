import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from "src/prisma/prisma.service";


@Injectable()
export class PostOwnerGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private readonly prismaService: PrismaService)
    { }

    async canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest()
        const postId = parseInt(request.params.id, 10)
        const userPostIds = request.userPostIds 

        if (userPostIds.includes(postId)) {
            return true 
        }
        else {
            const roles = this.reflector.getAllAndOverride('roles', [
                context.getHandler(),
                context.getClass()
            ])
            if (roles?.length) {
                return roles.includes(request.userRole)
            }
        }
    }
}