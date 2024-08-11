// src/todos/todos.controller.ts

import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { TodosService } from '@/todos/todos.service';
import { CreateTodo, UpdateTodo } from '@/todos/todo.model';

@Controller('todos')
export class TodosController {
  constructor(private readonly todoService: TodosService) {}

  @Post()
  create(@Body() createTodo: CreateTodo) {
    return this.todoService.create(createTodo);
  }

  @Get()
  index() {
    return this.todoService.all();
  }

  @Get(':id')
  show(@Param('id', ParseIntPipe) id: number) {
    return this.todoService.find(id);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTodo: UpdateTodo,
  ) {
    return this.todoService.update(id, updateTodo);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.todoService.destroy(id);
  }
}
