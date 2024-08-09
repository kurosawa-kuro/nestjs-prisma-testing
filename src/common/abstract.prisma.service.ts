// src/common/abstract.prisma.service.ts

import { OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

export abstract class AbstractPrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  async findAll(model: string): Promise<any[]> {
    return this[model].findMany();
  }

  async paginate(model: string, page = 1, take = 15): Promise<PaginatedResult> {
    const skip = (page - 1) * take;
    const [data, total] = await Promise.all([
      this[model].findMany({ skip, take }),
      this[model].count(),
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

  async create(model: string, data: any): Promise<any> {
    return this[model].create({ data });
  }

  async findOne(model: string, condition: any): Promise<any> {
    return this[model].findFirst({ where: condition });
  }

  async update(model: string, id: number, data: any): Promise<any> {
    return this[model].update({ where: { id }, data });
  }

  async delete(model: string, id: number): Promise<any> {
    return this[model].delete({ where: { id } });
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