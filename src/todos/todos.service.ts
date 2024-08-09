// src/todos/todo_service.ts

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AbstractService } from '../lib/abstract.service';
import { Todo, User } from '@prisma/client';

interface TodoWithUser extends Todo {
  user?: User;
}

@Injectable()
export class TodosService extends AbstractService {
  constructor(private readonly prismaService: PrismaService) {
    super(prismaService, 'todo');
  }

  async findAllWithUser(): Promise<TodoWithUser[]> {
    return this.prismaService.todo.findMany({
      include: { user: true },
    });
  }
}

interface PaginatedResult {
  data: Todo[];
  meta: {
    total: number;
    page: number;
    per_page: number;
    last_page: number;
  };
}