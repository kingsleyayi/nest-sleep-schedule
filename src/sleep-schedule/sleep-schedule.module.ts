import { Module } from '@nestjs/common';
import { SleepScheduleService } from './service/sleep-schedule.service';
import { SleepScheduleController } from './controller/sleep-schedule.controller';
import { SleepEntryRepository } from '../config/database/repositories/sleepEntry.repository';
import { UserRepository } from '../config/database/repositories/user.repository';

@Module({
  providers: [SleepScheduleService, SleepEntryRepository, UserRepository],
  controllers: [SleepScheduleController],
})
export class SleepScheduleModule {}
