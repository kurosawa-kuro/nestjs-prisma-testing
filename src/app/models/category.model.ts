import { IsString, IsOptional } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { Category as PrismaCategory } from '@prisma/client';

export type Category = PrismaCategory;

export class CreateCategory {
  @IsString()
  title: string;
}

export class UpdateCategory extends PartialType(CreateCategory) {
  @IsOptional()
  @IsString()
  title?: string;
}

export type CategoryWithTodos = Category & {
  todos: {
    todoId: number;
    categoryId: number;
    todo: {
      id: number;
      title: string;
      userId: number;
      createdAt: Date;
      updatedAt: Date;
    };
  }[];
};