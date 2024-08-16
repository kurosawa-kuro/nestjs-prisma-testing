// src/category-todo/category-todo.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaBaseService } from '@/lib/prisma-base.service';
import { PrismaClientService } from '@/orm/prisma-client.service';
import { CategoryTodo } from '@prisma/client';

@Injectable()
export class CategoryTodoService extends PrismaBaseService<CategoryTodo> {
  constructor(prisma: PrismaClientService) {
    super(prisma, 'categoryTodo');
  }

  async addTodoToCategory(todoId: number, categoryId: number): Promise<CategoryTodo> {
    return this.prisma.categoryTodo.create({
      data: {
        todoId,
        categoryId,
      },
    });
  }

  async removeTodoFromCategory(todoId: number, categoryId: number): Promise<CategoryTodo> {
    return this.prisma.categoryTodo.delete({
      where: {
        todoId_categoryId: {
          todoId,
          categoryId,
        },
      },
    });
  }

  async getTodosForCategory(categoryId: number) {
    return this.prisma.categoryTodo.findMany({
      where: { categoryId },
      include: { todo: true },
    });
  }

  async getCategoriesForTodo(todoId: number) {
    return this.prisma.categoryTodo.findMany({
      where: { todoId },
      include: { category: true },
    });
  }
}