// src\app.service.spec.ts

// External libraries
import { Test, TestingModule } from '@nestjs/testing';

// Internal modules
import { AppService } from '@/app/services/app.service'; // 相対パスに変更が必要かもしれません
import { PrismaClientService } from '@/orm/prisma-client.service';

describe('AppService', () => {
  let appService: AppService;
  let prismaClientServiceMock: Partial<PrismaClientService>; // Mock インスタンスの名前を変更

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppService,
        {
          provide: PrismaClientService, // この行はそのままで良いです
          useValue: {
            // モックの具体的な値
            $queryRaw: jest.fn().mockResolvedValue([{ 1: 1 }]), // デフォルトのモック実装を設定
          },
        },
      ],
    }).compile();

    appService = module.get<AppService>(AppService);
    prismaClientServiceMock =
      module.get<PrismaClientService>(PrismaClientService); // 変数名を変更
  });

  describe('getDatabaseConnectionStatus', () => {
    it('データベース接続に成功した場合、成功メッセージを返すべき', async () => {
      const result = await appService.getDatabaseConnectionStatus();
      expect(result).toBe('データベース接続に成功しました！');
      expect(prismaClientServiceMock.$queryRaw).toHaveBeenCalled(); // モックが呼び出されたことを検証
    });

    it('データベース接続に失敗した場合、エラーメッセージを返すべき', async () => {
      const errorMessage = 'Connection failed';
      (prismaClientServiceMock.$queryRaw as jest.Mock).mockRejectedValueOnce(
        new Error(errorMessage),
      );

      const result = await appService.getDatabaseConnectionStatus();
      expect(result).toBe(`データベース接続に失敗しました: ${errorMessage}`);
      expect(prismaClientServiceMock.$queryRaw).toHaveBeenCalled();
    });
  });
});
