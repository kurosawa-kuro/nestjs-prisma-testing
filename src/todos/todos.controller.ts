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
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';
import { TodosService } from '@/todos/todos.service';
import { CreateTodo, UpdateTodo } from '@/todos/todo.model';

@ApiTags('todos') // Swagger UI のタグを設定
@Controller('todos')
export class TodosController {
  constructor(private readonly todoService: TodosService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new todo' })
  @ApiBody({ type: CreateTodo }) // リクエストボディの型を指定
  @ApiResponse({ status: 201, description: 'The todo has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  create(@Body() createTodo: CreateTodo) {
    return this.todoService.create(createTodo);
  }

  @Get()
  @ApiOperation({ summary: 'Get all todos' })
  @ApiResponse({ status: 200, description: 'Return all todos.', type: [CreateTodo] })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  index() {
    return this.todoService.all();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a todo by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'Todo ID' }) // パラメータの型を指定
  @ApiResponse({ status: 200, description: 'The todo has been successfully retrieved.', type: CreateTodo })
  @ApiResponse({ status: 404, description: 'Todo not found.' })
  show(@Param('id', ParseIntPipe) id: number) {
    return this.todoService.find(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a todo by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'Todo ID' })
  @ApiBody({ type: UpdateTodo }) // リクエストボディの型を指定
  @ApiResponse({ status: 200, description: 'The todo has been successfully updated.', type: CreateTodo })
  @ApiResponse({ status: 404, description: 'Todo not found.' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTodo: UpdateTodo,
  ) {
    return this.todoService.update(id, updateTodo);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a todo by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'Todo ID' })
  @ApiResponse({ status: 200, description: 'The todo has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Todo not found.' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.todoService.destroy(id);
  }
}
