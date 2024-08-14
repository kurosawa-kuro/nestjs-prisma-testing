import { Injectable } from '@nestjs/common';
import { PrismaBaseService } from '@/lib/prismaBase.service';
import { PrismaService } from '@/prisma/prisma.service';
import { Todo } from '@prisma/client';

@Injectable()
export class TodosService extends PrismaBaseService<Todo> {
  constructor(prisma: PrismaService) {
    super(prisma, 'todo');
  }
}