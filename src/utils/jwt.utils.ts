import * as jwt from 'jsonwebtoken';
import { UnauthorizedException } from '@nestjs/common';
import { jwtSecret } from '../config/environmentVariables';
import { DecodedJwtToken } from '../types/user.types';

export const decodeUserJwt = (token: any) => {
  try {
    const decode = jwt.verify(token, jwtSecret) as DecodedJwtToken;
    return decode;
  } catch (error) {
    throw new UnauthorizedException('Invalid jwt ');
  }
};
