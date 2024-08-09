// src/users/users.service.ts

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AbstractService } from '../lib/abstract.service';
import { CreateUser, User } from './user.model';

@Injectable()
export class UsersService extends AbstractService {
  constructor(private readonly prismaService: PrismaService) {
    super(prismaService, 'user');
  }

  async create(data: CreateUser): Promise<User> {
    const user = await this.prisma['user'].create({
      data,
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
        // password フィールドは含まれません
      },
    });
    return user;
  }

  async all(): Promise<User[]> {
    return this.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
        // password フィールドは含まれません
      },
    });
  }

  async paginate(page = 1, perPage = 15): Promise<PaginatedResult> {
    const { data, meta } = await super.paginate(page, perPage);

    return {
      data: data.map((user: User) => {
        const { ...userData } = user;
        return userData;
      }),
      meta,
    };
  }
}

interface PaginatedResult {
  data: Partial<User>[];
  meta: {
    total: number;
    page: number;
    per_page: number;
    last_page: number;
  };
}
