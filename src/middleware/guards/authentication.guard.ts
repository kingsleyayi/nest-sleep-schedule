import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { decodeUserJwt } from '../../utils/jwt.utils';
import { UserRepository } from '../../config/database/repositories/user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { USERSTATUS } from '../../utils/enums.utils';
import eventLogger from '../../config/logger/index.logger';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    let { authorization } = request.headers;
    if (!authorization) {
      throw new UnauthorizedException('Provide JWT Token');
    } else {
      try {
        authorization = request.headers.authorization.replace('Bearer ', '');
        const decode = decodeUserJwt(authorization);
        const user = await this.userRepository.findOne({
          where: { id: decode.id },
        });
        if (!user) {
          throw new UnauthorizedException('Account Not Found');
        }
        if (user.status !== USERSTATUS.ACTIVE) {
          throw new UnauthorizedException({
            message: `${
              user.status === 'deleted'
                ? 'Account not Found'
                : 'Account is ' + user.status
            }`,
          });
        }
        request.user = { user };
        return true;
      } catch (error) {
        eventLogger.error(`AUTH_GUARD,ERROR = ${error}`);
        throw new UnauthorizedException(error);
      }
    }
  }
}
