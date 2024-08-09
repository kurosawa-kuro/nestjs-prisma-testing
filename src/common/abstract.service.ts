// src/common/abstract.service.ts

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export abstract class AbstractService {
  constructor(
    protected readonly prisma: PrismaService,
    protected readonly modelName: string
  ) {}

  async findAll(relations = []): Promise<any[]> {
    return this.prisma[this.modelName].findMany({
      include: this.parseRelations(relations),
    });
  }

  async paginate(page = 1, relations = []): Promise<PaginatedResult> {
    const take = 15;
    const skip = (page - 1) * take;

    const [data, total] = await Promise.all([
      this.prisma[this.modelName].findMany({
        take,
        skip,
        include: this.parseRelations(relations),
      }),
      this.prisma[this.modelName].count(),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        last_page: Math.ceil(total / take),
      },
    };
  }

  async create(data: any): Promise<any> {
    return this.prisma[this.modelName].create({ data });
  }

  async findOne(condition: any, relations = []): Promise<any> {
    return this.prisma[this.modelName].findUnique({
      where: condition,
      include: this.parseRelations(relations),
    });
  }

  async update(id: number, data: any): Promise<any> {
    return this.prisma[this.modelName].update({
      where: { id },
      data,
    });
  }

  async remove(id: number): Promise<any> {
    return this.prisma[this.modelName].delete({
      where: { id },
    });
  }

  private parseRelations(relations: string[]): Record<string, boolean> {
    const include: Record<string, boolean> = {};
    for (const relation of relations) {
      include[relation] = true;
    }
    return include;
  }
}

interface PaginatedResult {
  data: any[];
  meta: {
    total: number;
    page: number;
    last_page: number;
  };
}