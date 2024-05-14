import { Injectable } from '@nestjs/common';
import { BaseRepository } from './base.repository';
import { SleepEntry } from '../models/sleepEntry.model';

@Injectable()
export class SleepEntryRepository extends BaseRepository<SleepEntry> {
  constructor() {
    super(SleepEntry);
  }
}
