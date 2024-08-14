import { Injectable } from '@nestjs/common';
import { BaseService } from '@/lib/base.service';
import { PrismaService } from '@/prisma/prisma.service';
import { Todo } from '@prisma/client';

@Injectable()
export class TodosService extends BaseService<Todo> {
  constructor(prisma: PrismaService) {
    super(prisma, 'todo');
  }
}