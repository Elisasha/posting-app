import { CanActivate, ExecutionContext, Inject, Injectable, forwardRef } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RoleGuard } from './role.guard';


@Injectable()
export class PostOwnerGuard implements CanActivate {
    constructor(private reflector: Reflector,
        private roleGuard: RoleGuard) { }

    async canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest()
        const postId = parseInt(request.params.id, 10)
        const userPostIds = request.userPostIds 

        if (userPostIds.includes(postId)) {
            return true 
        }
        else {
            return this.roleGuard.canActivate(context)
        }
    }
}