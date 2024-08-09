import { IsString, IsEmail, MinLength, IsNotEmpty } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateUser {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}

export class UpdateUser extends PartialType(CreateUser) {}

export interface User {
  id: number;
  name: string;
  email: string;
}

export interface UserWithPassword extends User {
  password: string;
}