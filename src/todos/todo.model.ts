// src/todos/todo.model.ts

import { IsString, IsNumber, IsOptional } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { Todo } from '@prisma/client';
import { User } from 'src/users/user.model';

export class CreateTodo {
  @IsNumber()
  userId: number;

  @IsString()
  title: string;
}

export class UpdateTodo extends PartialType(CreateTodo) {
  @IsOptional()
  @IsNumber()
  userId?: number;

  @IsOptional()
  @IsString()
  title?: string;
}

export interface TodoWithUser extends Todo {
  user?: User;
}