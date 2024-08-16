import { Module } from '@nestjs/common';
import { TodosController } from '@/api/todos/todos.controller';
import { TodosService } from '@/api/todos/todos.service';
import { PrismaClientService } from '@/orm/prisma-client.service';

@Module({
  controllers: [TodosController],
  providers: [TodosService, PrismaClientService],
})
export class TodoModule {}
