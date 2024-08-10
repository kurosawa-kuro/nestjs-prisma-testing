// External libraries
import { Test, TestingModule } from '@nestjs/testing';

// Internal modules
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';

describe('AppService', () => {
  let appService: AppService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppService,
        {
          provide: PrismaService,
          useValue: {
            $queryRaw: jest.fn(),
          },
        },
      ],
    }).compile();

    appService = module.get<AppService>(AppService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe('getDatabaseConnectionStatus', () => {
    it('データベース接続に成功した場合、成功メッセージを返すべき', async () => {
      (prismaService.$queryRaw as jest.Mock).mockResolvedValue([{ 1: 1 }]);

      const result = await appService.getDatabaseConnectionStatus();
      expect(result).toBe('データベース接続に成功しました！');
      expect(prismaService.$queryRaw).toHaveBeenCalled();
    });

    it('データベース接続に失敗した場合、エラーメッセージを返すべき', async () => {
      const errorMessage = 'Connection failed';
      (prismaService.$queryRaw as jest.Mock).mockRejectedValue(
        new Error(errorMessage),
      );

      const result = await appService.getDatabaseConnectionStatus();
      expect(result).toBe(`データベース接続に失敗しました: ${errorMessage}`);
      expect(prismaService.$queryRaw).toHaveBeenCalled();
    });
  });
});
