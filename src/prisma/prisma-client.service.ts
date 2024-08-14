// src\prisma\prisma-client.service.ts

import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaClientService
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
            typeof this[key].deleteMany === 'function' &&
            // モデルのプロパティをより明確に識別するための追加のチェック
            Reflect.has(this[key], 'findFirst') // 通常、Prisma モデルは findFirst メソッドを持っています
        );
    });

    return Promise.all(models.map((model) => this[model].deleteMany()));
}

}
