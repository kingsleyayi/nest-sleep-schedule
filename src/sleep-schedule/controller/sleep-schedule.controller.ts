import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { SleepScheduleService } from '../service/sleep-schedule.service';
import {
  CreateSleepEntryDto,
  UpdateSleepEntryDto,
} from '../../dto/sleepEntry.dto';
import { CustomRequest } from '../../interfaces/request.interface';
import {
  ApiOkResponse,
  ApiBearerAuth,
  ApiTags,
  ApiBody,
} from '@nestjs/swagger';
import { User } from '../../config/database/models/user.model';
import { AuthGuard } from '../../middleware/guards/authentication.guard';
import { UserGuard } from '../../middleware/guards/authorization.guard';
import eventLogger from '../../config/logger/index.logger';

@ApiTags('Sleep Schedule')
@Controller('sleep-schedule')
export class SleepScheduleController {
  constructor(private readonly sleepService: SleepScheduleService) {}

  @Post('create-sleep-entry')
  @ApiBody({ type: CreateSleepEntryDto })
  @ApiOkResponse({
    status: 200,
    type: User,
  })
  @UseGuards(AuthGuard, UserGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('Authorization')
  @HttpCode(HttpStatus.OK)
  createSleepEntryDto(
    @Req() req: CustomRequest,
    @Body() createSleepEntryDto: CreateSleepEntryDto,
  ) {
    try {
      return this.sleepService.createSleepEntry(
        createSleepEntryDto,
        req.user.user,
      );
    } catch (error) {
      eventLogger.error(`create-sleep-entry - ${error}`);
      if (error.status && error.status === 500) {
        throw new InternalServerErrorException(error.message);
      }
      throw error;
    }
  }

  @Put('update-sleep-entry/:id')
  @UseGuards(AuthGuard, UserGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('Authorization')
  async updateSleepEntry(
    @Req() req: CustomRequest,
    @Param('id') id: number,
    @Body() updateSleepEntryDto: UpdateSleepEntryDto,
  ) {
    try {
      return this.sleepService.updateSleepEntry(
        id,
        updateSleepEntryDto,
        req.user.user,
      );
    } catch (error) {
      eventLogger.error(`update-sleep-entry - ${error}`);
      throw error;
    }
  }

  @Delete('delete-sleep-entry/:id')
  @UseGuards(AuthGuard, UserGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('Authorization')
  async deleteSleepEntry(@Req() req: CustomRequest, @Param('id') id: number) {
    try {
      await this.sleepService.deleteSleepEntry(id, req.user.user);
      return { message: 'Sleep entry deleted successfully' };
    } catch (error) {
      eventLogger.error(`delete-sleep-entry - ${error}`);
      throw error;
    }
  }

  @Get('user-sleep-entries')
  @UseGuards(AuthGuard, UserGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('Authorization')
  async findAllUserSleepEntries(@Req() req: CustomRequest) {
    try {
      return this.sleepService.findAllUserSleepEntries(req.user.user);
    } catch (error) {
      eventLogger.error(`findAllUserSleepEntries - ${error}`);
      throw error;
    }
  }
}
