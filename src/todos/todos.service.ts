import { Injectable } from '@nestjs/common';
import { PrismaModelBase } from '@/lib/prisma-model.base';
import { PrismaClientService } from '@/prisma/prisma-client.service';
import { Todo } from '@prisma/client';

@Injectable()
export class TodosService extends PrismaModelBase<Todo> {
  constructor(prisma: PrismaClientService) {
    super(prisma, 'todo');
  }
}