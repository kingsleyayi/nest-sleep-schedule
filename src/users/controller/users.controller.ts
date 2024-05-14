import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  UsePipes,
  ValidationPipe,
  Get,
  Req,
  UseGuards,
  InternalServerErrorException,
} from '@nestjs/common';
import { UsersService } from '../service/users.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import eventLogger from '../../config/logger/index.logger';
import { AuthUserDto, CreateUserDto } from '../../dto/user.dto';
import { AuthUserResponseType } from '../../swagger/user.swagger';
import { User } from '../../config/database/models/user.model';
import { CustomRequest } from '../../interfaces/request.interface';
import { AuthGuard } from '../../middleware/guards/authentication.guard';
import { UserGuard } from '../../middleware/guards/authorization.guard';

@ApiTags('User')
@Controller('users')
export class UsersController {
  constructor(
    @Inject(UsersService) private readonly userService: UsersService,
  ) {}

  @Post('create-user')
  @ApiBody({ type: CreateUserDto })
  @ApiOkResponse({
    status: 200,
    type: AuthUserResponseType,
  })
  @UsePipes(ValidationPipe)
  @HttpCode(HttpStatus.OK)
  async createUser(@Body() createUserDto: CreateUserDto) {
    try {
      return await this.userService.createUser(createUserDto);
    } catch (error) {
      eventLogger.error(`create-user - ${error}`);
      if (error.status && error.status === 500) {
        throw new InternalServerErrorException(error.message);
      }
      throw error;
    }
  }

  @Post('login-user')
  @ApiOkResponse({
    status: 200,
    type: AuthUserResponseType,
  })
  @UsePipes(ValidationPipe)
  @HttpCode(HttpStatus.OK)
  async loginUser(@Body() authUserDto: AuthUserDto) {
    try {
      return await this.userService.loginUser(authUserDto);
    } catch (error) {
      eventLogger.error(`login-user - ${error}`);
      if (error.status && error.status === 500) {
        throw new InternalServerErrorException(error.message);
      }
      throw error;
    }
  }

  @Get('user-details')
  @ApiOkResponse({
    status: 200,
    type: User,
  })
  @UseGuards(AuthGuard, UserGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('Authorization')
  @HttpCode(HttpStatus.OK)
  async userDetails(@Req() req: CustomRequest) {
    try {
      const { user } = req.user;
      return user;
    } catch (error) {
      eventLogger.error(`user-details - ${error}`);
      if (error.status && error.status === 500) {
        throw new InternalServerErrorException(error.message);
      }
      throw error;
    }
  }
}
