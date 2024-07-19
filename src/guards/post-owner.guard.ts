import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';
import { PrismaService } from "src/prisma/prisma.service";


@Injectable()
export class PostOwnerGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private readonly prismaService: PrismaService)
    { }

    async canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest()
        if (request.userRole == Role.ADMIN) {
            return true
        }
        const postId = parseInt(request.params.id, 10)
        const userPostIds = request.userPostIds
        if (!userPostIds.includes(postId)) {
            throw new ForbiddenException('You are not allowed to acces this resource')
        }
        return true;
    }

}