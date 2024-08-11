import { Module } from '@nestjs/common';
import { TodosController } from '@/todos/todos.controller';
import { TodosService } from '@/todos/todos.service';
import { PrismaService } from '@/prisma/prisma.service';

@Module({
  controllers: [TodosController],
  providers: [TodosService, PrismaService],
})
export class TodosModule {}
