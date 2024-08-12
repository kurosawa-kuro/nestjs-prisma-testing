import { Injectable } from '@nestjs/common';
import { BaseService } from '@/lib/base.service';
import { PrismaService } from '@/prisma/prisma.service';
import { User, Prisma } from '@prisma/client';

@Injectable()
export class UsersService extends BaseService<User, 'user'> {
  constructor(prisma: PrismaService) {
    super(prisma, 'user');
  }

  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    return this.create(data);
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }): Promise<User[]> {
    return this.model.findMany(params);
  }

  async updateAvatar(id: number, avatarUrl: string): Promise<User> {
    return this.update(id, { avatar: avatarUrl });
  }
}