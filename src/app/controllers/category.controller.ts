// src/category/category.controller.ts
import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { CategoryService } from '@/app/services/category.service';
import { Category } from '@prisma/client';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  async create(@Body() data: { title: string }): Promise<Category> {
    return this.categoryService.create(data);
  }

  @Get()
  async findAll(): Promise<Category[]> {
    return this.categoryService.all();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Category | null> {
    return this.categoryService.find(+id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: { title: string }): Promise<Category> {
    return this.categoryService.update(+id, data);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<Category> {
    return this.categoryService.destroy(+id);
  }

  @Get(':id/todos')
  async findCategoryWithTodos(@Param('id') id: string) {
    return this.categoryService.findCategoryWithTodos(+id);
  }
}