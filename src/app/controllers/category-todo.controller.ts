// src/category-todo/category-todo.controller.ts
import { Controller, Post, Delete, Body, Param, Get } from '@nestjs/common';
import { CategoryTodoService } from '@/app/services/category-todo.service';
import { CategoryTodo } from '@prisma/client';

@Controller('category-todo')
export class CategoryTodoController {
  constructor(private readonly categoryTodoService: CategoryTodoService) {}

  @Post()
  async addTodoToCategory(
    @Body() data: { todoId: number; categoryId: number },
  ): Promise<CategoryTodo> {
    return this.categoryTodoService.addTodoToCategory(data.todoId, data.categoryId);
  }

  @Delete(':todoId/:categoryId')
  async removeTodoFromCategory(
    @Param('todoId') todoId: string,
    @Param('categoryId') categoryId: string,
  ): Promise<CategoryTodo> {
    return this.categoryTodoService.removeTodoFromCategory(+todoId, +categoryId);
  }

  @Get('category/:categoryId')
  async getTodosForCategory(@Param('categoryId') categoryId: string) {
    return this.categoryTodoService.getTodosForCategory(+categoryId);
  }

  @Get('todo/:todoId')
  async getCategoriesForTodo(@Param('todoId') todoId: string) {
    return this.categoryTodoService.getCategoriesForTodo(+todoId);
  }
}