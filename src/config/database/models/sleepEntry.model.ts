import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, ManyToOne } from 'typeorm';
import { User } from './user.model';
import { BaseModel } from './baseModel.model';

@Entity()
export class SleepEntry extends BaseModel {
  @ApiProperty()
  @Column()
  date: Date;

  @ApiProperty()
  @Column()
  sleepTime: Date;

  @ApiProperty()
  @Column()
  wakeUpTime: Date;

  @ApiProperty()
  @Column({ type: 'double' })
  totalSleepDuration: number;

  @ApiProperty({ type: () => [User] })
  @ManyToOne(() => User, (user) => user.sleepEntry)
  user: User;
}
