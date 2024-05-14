import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, OneToMany } from 'typeorm';
import { BaseModel } from './baseModel.model';
import { ROLES, USERSTATUS } from '../../../utils/enums.utils';
import { SleepEntry } from './sleepEntry.model';

@Entity()
export class User extends BaseModel {
  @ApiProperty()
  @Column({
    default:
      'https://res.cloudinary.com/deujp1l2i/image/upload/v1680121426/abstract-user-flat-4_xzrl1p.png',
  })
  profileImage: string;

  @ApiProperty()
  @Column()
  firstName: string;

  @ApiProperty()
  @Column()
  phoneNumber: string;

  @ApiProperty()
  @Column({ nullable: true })
  otherNames: string;

  @ApiProperty()
  @Column()
  email: string;

  @ApiProperty()
  @Column()
  password: string;

  @ApiProperty({ enum: ROLES })
  @Column({ default: ROLES.USER })
  role: ROLES;

  @ApiProperty({ enum: USERSTATUS })
  @Column({ default: USERSTATUS.ACTIVE })
  status: USERSTATUS;

  @ApiProperty({ type: () => [SleepEntry] })
  @OneToMany(() => SleepEntry, (sleepEntry) => sleepEntry.user)
  sleepEntry: [SleepEntry];
}
