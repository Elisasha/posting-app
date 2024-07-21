import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RoleGuard } from './role.guard';

@Injectable()
export class UserOwnerGuard implements CanActivate {
  constructor(private reflector: Reflector, private roleGuard: RoleGuard) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest()
    const userId = request.userId
    const ownerId = parseInt(request.params.id, 10)
    if (userId === ownerId) {
      return true
    } else {
      return this.roleGuard.canActivate(context)
    }
  }
}