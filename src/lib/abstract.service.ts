// src\lib\abstract.service.ts

// External libraries
import { Injectable } from '@nestjs/common';

// Internal modules
import { PrismaService } from '../prisma/prisma.service';
import { PaginatedResult } from '../lib/types';

@Injectable()
export abstract class AbstractService {
  constructor(
    protected readonly prisma: PrismaService,
    protected readonly modelName: string,
  ) {}

  async create(data: any): Promise<any> {
    return this.prisma[this.modelName].create({ data });
  }

  async all(): Promise<any[]> {
    return this.prisma[this.modelName].findMany();
  }

  async find(id: number): Promise<any> {
    return this.prisma[this.modelName].findUnique({
      where: { id },
    });
  }

  async findBy(condition: any): Promise<any> {
    return this.prisma[this.modelName].findFirst({
      where: condition,
    });
  }

  async where(condition: any): Promise<any[]> {
    return this.prisma[this.modelName].findMany({
      where: condition,
    });
  }

  async update(id: number, data: any): Promise<any> {
    return this.prisma[this.modelName].update({
      where: { id },
      data,
    });
  }

  async destroy(id: number): Promise<any> {
    return this.prisma[this.modelName].delete({
      where: { id },
    });
  }

  async paginate(page = 1, perPage = 15): Promise<PaginatedResult> {
    const skip = (page - 1) * perPage;

    const [data, total] = await Promise.all([
      this.prisma[this.modelName].findMany({
        take: perPage,
        skip,
      }),
      this.prisma[this.modelName].count(),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        per_page: perPage,
        last_page: Math.ceil(total / perPage),
      },
    };
  }
}
