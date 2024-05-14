import { User } from '../config/database/models/user.model';
import { ROLES } from '../utils/enums.utils';

export type UserPayload = {
  user: User;
  token?: string;
};

export type DecodedJwtToken = {
  id: number;
  email: string;
  role: ROLES;
  iat: number;
  exp: number;
};
