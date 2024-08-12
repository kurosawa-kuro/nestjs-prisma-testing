// src/users/users.service.ts

import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { BaseService } from '@/lib/base.service';
import { CreateUser } from '@/users/user.model';
import { User, UserPaginatedResult } from '@/lib/types';

@Injectable()
export class UsersService extends BaseService {
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
        avatar: true,
        createdAt: true,
        updatedAt: true,
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
        avatar: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async paginate(page = 1, perPage = 15): Promise<UserPaginatedResult> {
    const { data, meta } = await super.paginate(page, perPage);

    return {
      data: data.map((user: User) => {
        const { ...userData } = user;
        return userData;
      }),
      meta,
    };
  }

  async updateAvatar(id: number, avatarUrl: string) {
    return this.update(id, { avatar: avatarUrl });
  }
}
