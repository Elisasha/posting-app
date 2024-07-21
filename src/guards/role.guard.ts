import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';


@Injectable()
export class RoleGuard implements CanActivate {
    constructor(private reflector: Reflector){ }

    async canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest()
        const roles = this.reflector.getAllAndOverride('roles', [
            context.getHandler(),
            context.getClass()
        ])

        if (!roles) {
            return false
        }
        return roles.includes(request.userRole)
    }
}