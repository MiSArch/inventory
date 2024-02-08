import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../enums/role.enum';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // query is not protected
    if (!requiredRoles) {
      return true;
    }

    // get graphql context
    const ctx = GqlExecutionContext.create(context);
    const { headers } = ctx.getContext().request;

    // check if user is authorized by gateway
    if(!headers['authorized-user']) {
      return false;
    }

    // check if user has required roles
    const roles = JSON.parse(headers['authorized-user']).roles;
    return requiredRoles.some(role => roles.includes(role));
  }
}