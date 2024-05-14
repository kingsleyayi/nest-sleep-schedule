import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
} from 'class-validator';

export class CreateSleepEntryDto {
  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  date: Date;

  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  sleepTime: Date;

  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  wakeUpTime: Date;
}

export class UpdateSleepEntryDto {
  @ApiProperty()
  @IsDateString()
  @IsOptional()
  date: Date;

  @ApiProperty()
  @IsDateString()
  @IsOptional()
  sleepTime: Date;

  @ApiProperty()
  @IsDateString()
  @IsOptional()
  wakeUpTime: Date;
}
