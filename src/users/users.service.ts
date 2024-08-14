import { Injectable } from '@nestjs/common';
import { PrismaBaseService } from '@/lib/prismaBase.service';
import { PrismaService } from '@/prisma/prisma.service';
import { User, Prisma } from '@prisma/client';

@Injectable()
export class UsersService extends PrismaBaseService<User> {
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
    return this.all(params);
  }

  async updateAvatar(id: number, avatarUrl: string): Promise<User> {
    return this.update(id, { avatar: avatarUrl });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.findBy({ email });
  }
}