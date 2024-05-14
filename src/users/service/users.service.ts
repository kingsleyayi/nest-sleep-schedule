import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserRepository } from '../../config/database/repositories/user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthUserDto, CreateUserDto } from '../../dto/user.dto';
import { bcryptCompare, bcryptPassword } from '../../utils/bcrypt.utils';
import { JwtService } from '@nestjs/jwt';
import { AuthUserResponseType } from '../../swagger/user.swagger';
import { ROLES, USERSTATUS } from '../../utils/enums.utils';
import { User } from '../../config/database/models/user.model';
import { jwtSecret } from '../../config/environmentVariables';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async createUser(
    createUserDto: CreateUserDto,
  ): Promise<AuthUserResponseType> {
    if (createUserDto.password !== createUserDto.confirmPassword) {
      throw new HttpException('passswords must match', HttpStatus.BAD_REQUEST);
    }
    const findUser = await this.userRepository.findOne({
      where: [
        { email: createUserDto.email },
        { phoneNumber: createUserDto.phoneNumber },
      ],
    });
    if (findUser) {
      throw new HttpException('user already exist', HttpStatus.BAD_REQUEST);
    }
    createUserDto.password = await bcryptPassword(createUserDto.password);
    const userdetails = this.userRepository.create({
      ...createUserDto,
    });
    const user = await this.userRepository.save(userdetails);

    return await this.sendUserLoginTokens(user);
  }

  async sendUserLoginTokens(user: User): Promise<AuthUserResponseType> {
    const { token, refreshToken } = await this.getUserToken(
      user.id,
      user.email,
      user.role,
    );
    const res: AuthUserResponseType = {
      refreshToken,
      token,
      user,
    };
    return res;
  }

  async getUserToken(
    id: number,
    email: string,
    role: ROLES,
  ): Promise<{ token: string; refreshToken: string }> {
    const token = await this.jwtService.signAsync(
      {
        id,
        email,
        role,
      },
      {
        secret: jwtSecret,
        expiresIn: 60 * 60 * 24 * 7, // one week
      },
    );

    const refreshToken = await this.jwtService.signAsync(
      {
        id,
        email,
        role,
      },
      {
        secret: jwtSecret,
        expiresIn: 60 * 60 * 24 * 14, // 2 weeks
      },
    );
    return { token, refreshToken };
  }

  async loginUser(authUserDto: AuthUserDto) {
    const user = await this.userRepository.findOne({
      where: { email: authUserDto.email },
    });
    if (!user || user.status !== USERSTATUS.ACTIVE) {
      throw new NotFoundException('User Not Found');
    }
    if (!user.password)
      throw new BadRequestException(
        "Can't Login at the moment. Contact Support",
      );
    const isMatch = await bcryptCompare(authUserDto.password, user.password);
    if (isMatch) {
      return await this.sendUserLoginTokens(user);
    }
    throw new NotFoundException('Incorrect Email Or Password');
  }
}
