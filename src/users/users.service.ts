// src/users/users.service.ts

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AbstractService } from '../common/abstract.service';
import { User } from '@prisma/client';

@Injectable()
export class UsersService extends AbstractService {
  constructor(private readonly prismaService: PrismaService) {
    super(prismaService, 'user');
  }

  async paginate(page = 1, relations = []): Promise<PaginatedResult> {
    const { data, meta } = await super.paginate(page, relations);

    return {
      data: data.map((user: User) => {
        const { password, ...data } = user;
        return data;
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
    last_page: number;
  };
}