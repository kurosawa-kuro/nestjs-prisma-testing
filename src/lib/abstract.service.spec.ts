import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { AbstractService } from './abstract.service';

// テスト用の具象クラス
class TestService extends AbstractService {
  constructor(prisma: PrismaService) {
    super(prisma, 'testModel');
  }
}

// PrismaServiceのモック用の型を定義
type MockPrismaService = {
  [key: string]: {
    findMany: jest.Mock;
  };
};

describe('AbstractService', () => {
  let service: TestService;
  let prismaService: MockPrismaService;

  beforeEach(async () => {
    const mockPrismaService: MockPrismaService = {
      testModel: {
        findMany: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: TestService,
          useFactory: () => new TestService(mockPrismaService as unknown as PrismaService),
        },
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<TestService>(TestService);
    prismaService = module.get(PrismaService) as unknown as MockPrismaService;
  });

  describe('all', () => {
    it('should return all records', async () => {
      const mockData = [{ id: 1 }, { id: 2 }];
      prismaService.testModel.findMany.mockResolvedValue(mockData);

      const result = await service.all();

      expect(result).toEqual(mockData);
      expect(prismaService.testModel.findMany).toHaveBeenCalledTimes(1);
      expect(prismaService.testModel.findMany).toHaveBeenCalledWith();
    });
  });
});