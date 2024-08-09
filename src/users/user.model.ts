import { IsString, IsEmail, MinLength, IsNotEmpty, Matches } from 'class-validator';
import { PartialType, OmitType } from '@nestjs/mapped-types';

export class CreateUser {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, {
    message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number',
  })
  password: string;
}

export class UpdateUser extends PartialType(CreateUser) {}

export class CreateUserWithoutPassword extends OmitType(CreateUser, ['password'] as const) {}

export interface User {
  id: number;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserWithPassword extends User {
  password: string;
}