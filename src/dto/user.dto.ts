import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  Length,
  IsEmail,
  IsOptional,
  IsDateString,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Length(0, 150)
  firstName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Length(0, 150)
  otherNames: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  @Length(0, 150)
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  @Length(0, 150)
  phoneNumber: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Length(0, 150)
  password: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Length(0, 150)
  confirmPassword: string;
}

export class AuthUserDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  @Length(0, 150)
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Length(0, 150)
  password: string;
}
