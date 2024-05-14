import { ApiProperty } from '@nestjs/swagger';
import { User } from '../config/database/models/user.model';

export class AuthUserResponseType {
  @ApiProperty()
  user: User;

  @ApiProperty()
  token: string;

  @ApiProperty()
  refreshToken: string;
}
