// src/category-todo/category-todo.module.ts
import { Module } from '@nestjs/common';
import { CategoryTodoController } from '@/app/controllers/category-todo.controller';
import { CategoryTodoService } from '@/app/services/category-todo.service';
import { PrismaClientService } from '@/orm/prisma-client.service';

@Module({
  controllers: [CategoryTodoController],
  providers: [CategoryTodoService, PrismaClientService],
  exports: [CategoryTodoService],
})
export class CategoryTodoModule {}