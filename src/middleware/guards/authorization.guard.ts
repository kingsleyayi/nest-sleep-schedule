import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { decodeUserJwt } from '../../utils/jwt.utils';
import eventLogger from '../../config/logger/index.logger';
import { ROLES } from '../../utils/enums.utils';

function createGuard(role: ROLES) {
  @Injectable()
  class RoleGuard implements CanActivate {
    async canActivate(context: ExecutionContext): Promise<boolean> {
      const request = context.switchToHttp().getRequest();
      let { authorization } = request.headers;
      if (!authorization) {
        throw new UnauthorizedException('Provide JWT Token');
      } else {
        try {
          authorization = request.headers.authorization.replace('Bearer ', '');
          const decode = decodeUserJwt(authorization);
          if (decode.role !== role) {
            throw new UnauthorizedException('Access Denied');
          }
          return true;
        } catch (error) {
          eventLogger.error(
            `AUTHORIZATION_GUARD,ERROR = ${error}, role = ${role}`,
          );
          throw new UnauthorizedException('You Are Not authorized');
        }
      }
    }
  }
  return RoleGuard;
}

export const SuperAdminGuard = createGuard(ROLES.SUPERADMIN);
export const AdminGuard = createGuard(ROLES.ADMIN);
export const UserGuard = createGuard(ROLES.USER);
