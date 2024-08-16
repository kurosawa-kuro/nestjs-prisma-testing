// src/category-todo/category-todo.module.ts
import { Module } from '@nestjs/common';
import { CategoryTodosController } from '@/app/controllers/categoryTodos.controller';
import { CategoryTodosService } from '@/app/services/categoryTodos.service';
import { PrismaClientService } from '@/orm/prisma-client.service';

@Module({
  controllers: [CategoryTodosController],
  providers: [CategoryTodosService, PrismaClientService],
  exports: [CategoryTodosService],
})
export class CategoryTodoModule {}
