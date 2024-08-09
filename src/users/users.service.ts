// src/users/users.service.ts

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AbstractService } from '../lib/abstract.service';
import { User } from '@prisma/client';

@Injectable()
export class UsersService extends AbstractService {
  constructor(private readonly prismaService: PrismaService) {
    super(prismaService, 'user');
  }

  async paginate(page = 1, perPage = 15): Promise<PaginatedResult> {
    const { data, meta } = await super.paginate(page, perPage);

    return {
      data: data.map((user: User) => {
        const { password, ...userData } = user;
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