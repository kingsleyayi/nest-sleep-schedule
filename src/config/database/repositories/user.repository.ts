import { Injectable } from '@nestjs/common';
import { BaseRepository } from './base.repository';
import { User } from '../models/user.model';

@Injectable()
export class UserRepository extends BaseRepository<User> {
  constructor() {
    super(User);
  }
}