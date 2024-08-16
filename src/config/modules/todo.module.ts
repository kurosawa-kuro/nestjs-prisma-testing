import { Module } from '@nestjs/common';
import { TodosController } from '@/app/controllers/todos.controller';
import { TodosService } from '@/app/services/todos.service';
import { PrismaClientService } from '@/orm/prisma-client.service';

@Module({
  controllers: [TodosController],
  providers: [TodosService, PrismaClientService],
})
export class TodoModule {}
