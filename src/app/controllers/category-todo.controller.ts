import { Controller, Post, Delete, Body, Param, Get } from '@nestjs/common';
import { CategoryTodoService } from '@/app/services/category-todo.service';
import { CreateCategoryTodo, CategoryTodoWithRelations, TodoWithCategories, CategoryWithTodos } from '@/app/models/category-todo.model';

@Controller('category-todo')
export class CategoryTodoController {
  constructor(private readonly categoryTodoService: CategoryTodoService) {}

  @Post()
  async addTodoToCategory(@Body() data: CreateCategoryTodo): Promise<CategoryTodoWithRelations> {
    return this.categoryTodoService.addTodoToCategory(data.todoId, data.categoryId);
  }

  @Delete(':todoId/:categoryId')
  async removeTodoFromCategory(
    @Param('todoId') todoId: string,
    @Param('categoryId') categoryId: string,
  ): Promise<CategoryTodoWithRelations> {
    return this.categoryTodoService.removeTodoFromCategory(+todoId, +categoryId);
  }

  @Get('category/:categoryId')
  async getTodosForCategory(@Param('categoryId') categoryId: string): Promise<CategoryWithTodos> {
    return this.categoryTodoService.getTodosForCategory(+categoryId);
  }

  @Get('todo/:todoId')
  async getCategoriesForTodo(@Param('todoId') todoId: string): Promise<TodoWithCategories> {
    return this.categoryTodoService.getCategoriesForTodo(+todoId);
  }
}