import { Request } from 'express';
import { UserPayload } from '../types/user.types';

export interface CustomRequest extends Request {
  user?: UserPayload;
}
