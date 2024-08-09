import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) {}

  async getDatabaseConnectionStatus(): Promise<string> {
    try {
      // データベースに対して簡単なクエリを実行
      await this.prisma.$queryRaw`SELECT 1`;
      return 'データベース接続に成功しました！';
    } catch (error) {
      return `データベース接続に失敗しました: ${error.message}`;
    }
  }
}