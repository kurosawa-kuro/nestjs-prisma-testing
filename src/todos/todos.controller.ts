import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { TodosService } from './todos.service';
import { CreateTodo, UpdateTodo } from './todo.model';

@Controller('todos')
export class TodosController {
  constructor(private readonly todoService: TodosService) {}

  @Post()
  create(@Body() CreateTodo: CreateTodo) {
    return this.todoService.create(CreateTodo);
  }

  @Get()
  findAll() {
    return this.todoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.todoService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() UpdateTodo: UpdateTodo) {
    return this.todoService.update(+id, UpdateTodo);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.todoService.remove(+id);
  }
}