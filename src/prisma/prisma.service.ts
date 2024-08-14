// src\prisma\prisma.service.ts

import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  async cleanDatabase() {
    const models = Object.keys(this).filter((key) => {
      return (
        typeof this[key] === 'object' &&
        this[key] !== null &&
        'deleteMany' in this[key] &&
        typeof this[key].deleteMany === 'function'
      );
    });

    return Promise.all(models.map((model) => this[model].deleteMany()));
  }
}
