import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { TodosService } from './todos.service';
import { CreateTodo, UpdateTodo } from './todo.model';

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
  show(@Param('id') id: string) {
    return this.todoService.find(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateTodo: UpdateTodo) {
    return this.todoService.update(+id, updateTodo);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.todoService.destroy(+id);
  }
}