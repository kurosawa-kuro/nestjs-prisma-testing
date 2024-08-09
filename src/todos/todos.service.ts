// src/todos/todo_service.ts

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AbstractService } from '../lib/abstract.service';
import { TodoWithUser } from 'src/todos/todo.model';

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