// src\app.service.spec.ts

// External libraries
import { Test, TestingModule } from '@nestjs/testing';

// Internal modules
import { AppService } from '@/app.service';
import { PrismaClientService } from '@/prisma/prisma-client.service';

describe('AppService', () => {
  let appService: AppService;
  let PrismaClientService: PrismaClientService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppService,
        {
          provide: PrismaClientService,
          useValue: {
            $queryRaw: jest.fn(),
          },
        },
      ],
    }).compile();

    appService = module.get<AppService>(AppService);
    PrismaClientService = module.get<PrismaClientService>(PrismaClientService);
  });

  describe('getDatabaseConnectionStatus', () => {
    it('データベース接続に成功した場合、成功メッセージを返すべき', async () => {
      (PrismaClientService.$queryRaw as jest.Mock).mockResolvedValue([{ 1: 1 }]);

      const result = await appService.getDatabaseConnectionStatus();
      expect(result).toBe('データベース接続に成功しました！');
      expect(PrismaClientService.$queryRaw).toHaveBeenCalled();
    });

    it('データベース接続に失敗した場合、エラーメッセージを返すべき', async () => {
      const errorMessage = 'Connection failed';
      (PrismaClientService.$queryRaw as jest.Mock).mockRejectedValue(
        new Error(errorMessage),
      );

      const result = await appService.getDatabaseConnectionStatus();
      expect(result).toBe(`データベース接続に失敗しました: ${errorMessage}`);
      expect(PrismaClientService.$queryRaw).toHaveBeenCalled();
    });
  });
});
