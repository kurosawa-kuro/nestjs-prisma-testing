import { Module } from '@nestjs/common';
import { TodosController } from '@/todos/todos.controller';
import { TodosService } from '@/todos/todos.service';
import { PrismaClientService } from '@/prisma/prisma-client.service';

@Module({
  controllers: [TodosController],
  providers: [TodosService, PrismaClientService],
})
export class TodosModule {}
