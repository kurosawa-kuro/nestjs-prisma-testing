// src\app.service.ts

// External libraries
import { Injectable } from '@nestjs/common';

// Internal modules
import { PrismaClientService } from '@/prisma/prisma-client.service';

@Injectable()
export class AppService {
  constructor(private prisma: PrismaClientService) {}

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
