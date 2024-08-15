// src\app.controller.spec.ts

// External libraries
import { Test, TestingModule } from '@nestjs/testing';

// Internal modules
import { AppController } from '@/app/controllers/app.controller';
import { AppService } from '@/app/services/app.service';
import { PrismaClientService } from '@/orm/prisma-client.service';

describe('AppController', () => {
  let appController: AppController;
  let appService: AppService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        {
          provide: PrismaClientService,
          useValue: {
            $queryRaw: jest.fn().mockResolvedValue([{ 1: 1 }]),
          },
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
    appService = app.get<AppService>(AppService);
  });

  describe('root', () => {
    it('should return database connection status', async () => {
      const result = 'データベース接続に成功しました！';
      jest
        .spyOn(appService, 'getDatabaseConnectionStatus')
        .mockResolvedValue(result);

      expect(await appController.getDatabaseStatus()).toBe(result);
    });
  });
});
