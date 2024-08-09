// src\users\user.model.ts

import { IsString, IsEmail, MinLength } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateUser {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}

export class UpdateUser extends PartialType(CreateUser) {}