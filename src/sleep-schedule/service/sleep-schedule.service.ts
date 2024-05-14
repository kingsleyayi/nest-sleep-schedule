import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  CreateSleepEntryDto,
  UpdateSleepEntryDto,
} from '../../dto/sleepEntry.dto';
import { User } from '../../config/database/models/user.model';
import { SleepEntryRepository } from '../../config/database/repositories/sleepEntry.repository';
import { SleepEntry } from '../../config/database/models/sleepEntry.model';

@Injectable()
export class SleepScheduleService {
  constructor(
    @InjectRepository(SleepEntryRepository)
    private sleepEntryRepository: SleepEntryRepository,
  ) {}

  async createSleepEntry(
    sleepEntryDto: CreateSleepEntryDto,
    user: User,
  ): Promise<SleepEntry> {
    if (sleepEntryDto.sleepTime >= sleepEntryDto.wakeUpTime) {
      throw new BadRequestException('Sleep time must be before wake-up time');
    }

    // Check if the date matches the date part of sleepTime
    const sleepTimeDate = new Date(sleepEntryDto.sleepTime).setHours(
      0,
      0,
      0,
      0,
    );
    const providedDate = new Date(sleepEntryDto.date).setHours(0, 0, 0, 0);
    if (sleepTimeDate !== providedDate) {
      throw new BadRequestException(
        'The date must match the date part of sleep time',
      );
    }

    // Calculate totalSleepDuration
    const sleepTime = new Date(sleepEntryDto.sleepTime);
    const wakeUpTime = new Date(sleepEntryDto.wakeUpTime);
    const totalSleepDuration =
      (wakeUpTime.getTime() - sleepTime.getTime()) / (1000 * 60 * 60);

    const sleepEntry = this.sleepEntryRepository.create({
      ...sleepEntryDto,
      totalSleepDuration,
      user,
    });

    return this.sleepEntryRepository.save(sleepEntry);
  }

  async updateSleepEntry(
    id: number,
    updateSleepEntryDto: UpdateSleepEntryDto,
    user: User,
  ): Promise<SleepEntry> {
    const sleepEntry = await this.sleepEntryRepository.findOne({
      where: { id, user: { id: user.id } },
    });
    if (!sleepEntry) {
      throw new NotFoundException('Sleep entry not found');
    }

    // Check if the date is being updated
    if (updateSleepEntryDto.date) {
      const providedDate = new Date(updateSleepEntryDto.date).setHours(
        0,
        0,
        0,
        0,
      );
      if (providedDate !== sleepEntry.date.setHours(0, 0, 0, 0)) {
        throw new BadRequestException(
          'The date must match the date part of the existing sleep entry',
        );
      }
    }

    const date = updateSleepEntryDto.date || sleepEntry.date;
    const sleepTime = updateSleepEntryDto.sleepTime || sleepEntry.sleepTime;
    const wakeUpTime = updateSleepEntryDto.wakeUpTime || sleepEntry.wakeUpTime;

    // Check if the date matches the date part of sleepTime
    if (updateSleepEntryDto.date) {
      const sleepTimeDate = new Date(sleepTime).setHours(0, 0, 0, 0);
      const providedDate = new Date(date).setHours(0, 0, 0, 0);
      if (sleepTimeDate !== providedDate) {
        throw new BadRequestException(
          'The date must match the date part of sleep time',
        );
      }
    }


    // Check if both sleepTime and wakeUpTime are being updated
    if (updateSleepEntryDto.sleepTime && updateSleepEntryDto.wakeUpTime) {
      if (sleepTime >= wakeUpTime) {
        throw new BadRequestException('Sleep time must be before wake-up time');
      }
      const totalSleepDuration =
        (new Date(wakeUpTime).getTime() - new Date(sleepTime).getTime()) /
        (1000 * 60 * 60);
      sleepEntry.totalSleepDuration = totalSleepDuration;
    }

    // Check if only the sleepTime is being updated
    if (updateSleepEntryDto.sleepTime && !updateSleepEntryDto.wakeUpTime) {
      if (sleepTime >= wakeUpTime) {
        throw new BadRequestException('Sleep time must be before wake-up time');
      }
      const totalSleepDuration =
        (new Date(wakeUpTime).getTime() - new Date(sleepTime).getTime()) /
        (1000 * 60 * 60);
      sleepEntry.totalSleepDuration = totalSleepDuration;
    }

    // Check if only the wakeUpTime is being updated
    if (!updateSleepEntryDto.sleepTime && updateSleepEntryDto.wakeUpTime) {
      if (sleepTime >= wakeUpTime) {
        throw new BadRequestException('Sleep time must be before wake-up time');
      }
      const totalSleepDuration =
        (new Date(wakeUpTime).getTime() - new Date(sleepTime).getTime()) /
        (1000 * 60 * 60);
      sleepEntry.totalSleepDuration = totalSleepDuration;
    }

    Object.assign(sleepEntry, updateSleepEntryDto);

    return this.sleepEntryRepository.save(sleepEntry);
  }

  async deleteSleepEntry(id: number, user: User): Promise<void> {
    const sleepEntry = await this.sleepEntryRepository.findOne({
      where: { id, user: { id: user.id } },
    });
    if (!sleepEntry) {
      throw new NotFoundException('Sleep entry not found');
    }

    await this.sleepEntryRepository.remove(sleepEntry);
  }

  async findAllUserSleepEntries(user: User): Promise<SleepEntry[]> {
    return this.sleepEntryRepository.find({ where: { user: { id: user.id } } });
  }
}
