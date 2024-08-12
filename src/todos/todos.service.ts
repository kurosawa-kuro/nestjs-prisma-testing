// src/todos/todo_service.ts

import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { BaseService } from '@/lib/base.service';
import { TodoWithUser } from '@/todos/todo.model';

@Injectable()
export class TodosService extends BaseService {
  constructor(private readonly prismaService: PrismaService) {
    super(prismaService, 'todo');
  }

  async findAllWithUser(): Promise<TodoWithUser[]> {
    return this.prismaService.todo.findMany({
      include: { user: true },
    });
  }
}
