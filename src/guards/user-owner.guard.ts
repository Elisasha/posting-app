import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';

@Injectable()
export class UserOwnerGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest()
        const role = request.userRole
        if (role !== Role.ADMIN) {
            const userId = request.userId
            const ownerId = parseInt(request.params.id, 10)
    
            if (userId !== ownerId) {
                throw new ForbiddenException('You are not allowed to access this resource')
            }
        }

    return true;
  }
}