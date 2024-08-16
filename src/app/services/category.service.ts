// src/category/category.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaBaseService } from '@/lib/prisma-base.service';
import { PrismaClientService } from '@/orm/prisma-client.service';
import { Category } from '@prisma/client';

@Injectable()
export class CategoryService extends PrismaBaseService<Category> {
  constructor(prisma: PrismaClientService) {
    super(prisma, 'category');
  }

  async findCategoryWithTodos(id: number) {
    return this.prisma.category.findUnique({
      where: { id },
      include: {
        todos: {
          include: {
            todo: true,
          },
        },
      },
    });
  }
}