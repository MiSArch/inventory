import { SetMetadata } from '@nestjs/common';
import { Role } from '../enums/role.enum';

export const ROLES_KEY = 'roles';
/**
 * Decorator that sets the roles metadata for a given resource or endpoint.
 * @param roles The roles to be assigned to the resource or endpoint.
 */
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);