import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { PaginatedResult } from '@/lib/types';
import { Prisma } from '@prisma/client';

type PrismaModel<T> = {
  create: (args: any) => Promise<T>;
  findMany: (args?: any) => Promise<T[]>;
  findUnique: (args: any) => Promise<T | null>;
  findFirst: (args: any) => Promise<T | null>;
  update: (args: any) => Promise<T>;
  delete: (args: any) => Promise<T>;
  count: (args?: any) => Promise<number>;
};

interface IReadOperations<T, K extends keyof PrismaService> {
  all(): Promise<T[]>;
  find(id: number): Promise<T | null>;
  findBy(condition: Prisma.Args<K, 'findFirst'>['where']): Promise<T | null>;
  where(condition: Prisma.Args<K, 'findMany'>['where']): Promise<T[]>;
}

interface IWriteOperations<T, K extends keyof PrismaService> {
  create(data: Prisma.Args<K, 'create'>['data']): Promise<T>;
  update(id: number, data: Prisma.Args<K, 'update'>['data']): Promise<T>;
  destroy(id: number): Promise<T>;
}

interface IPaginationOperations<T> {
  paginate(page: number, perPage: number): Promise<PaginatedResult<T>>;
}

@Injectable()
export abstract class BaseService<T, K extends keyof PrismaService> 
  implements IReadOperations<T, K>, IWriteOperations<T, K>, IPaginationOperations<T> {
  
  constructor(
    protected readonly prisma: PrismaService,
    protected readonly modelName: K
  ) {}

  protected get model() {
    return this.prisma[this.modelName] as unknown as PrismaModel<T>;
  }

  // Read operations
  async all(): Promise<T[]> {
    return this.model.findMany() as Promise<T[]>;
  }

  async find(id: number): Promise<T | null> {
    return this.model.findUnique({
      where: { id } as Prisma.Args<K, 'findUnique'>['where'],
    }) as Promise<T | null>;
  }

  async findBy(condition: Prisma.Args<K, 'findFirst'>['where']): Promise<T | null> {
    return this.model.findFirst({
      where: condition,
    }) as Promise<T | null>;
  }

  async where(condition: Prisma.Args<K, 'findMany'>['where']): Promise<T[]> {
    return this.model.findMany({
      where: condition,
    }) as Promise<T[]>;
  }

  // Write operations
  async create(data: Prisma.Args<K, 'create'>['data']): Promise<T> {
    return this.model.create({ data }) as Promise<T>;
  }

  async update(id: number, data: Prisma.Args<K, 'update'>['data']): Promise<T> {
    return this.model.update({
      where: { id } as Prisma.Args<K, 'update'>['where'],
      data,
    }) as Promise<T>;
  }

  async destroy(id: number): Promise<T> {
    return this.model.delete({
      where: { id } as Prisma.Args<K, 'delete'>['where'],
    }) as Promise<T>;
  }

  // Pagination operations
  async paginate(page = 1, perPage = 15): Promise<PaginatedResult<T>> {
    const skip = (page - 1) * perPage;

    const [data, total] = await Promise.all([
      this.model.findMany({
        take: perPage,
        skip,
      }),
      this.model.count(),
    ]);

    return {
      data: data as T[],
      meta: {
        total,
        page,
        per_page: perPage,
        last_page: Math.ceil(total / perPage),
      },
    };
  }
}