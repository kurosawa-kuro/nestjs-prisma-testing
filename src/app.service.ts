// src/app.service.ts

import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) {}

  async getDatabaseConnectionStatus(): Promise<string> {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return 'データベース接続に成功しました！';
    } catch (error) {
      return `データベース接続に失敗しました: ${error.message}`;
    }
  }

  // // 例: ユーザーの取得
  // async getAllUsers() {
  //   return this.prisma.findAll('user');
  // }

  // // 例: ページネーション付きのユーザー取得
  // async getPaginatedUsers(page: number) {
  //   return this.prisma.paginate('user', page);
  // }

  // 他のCRUD操作も同様に実装できます
}