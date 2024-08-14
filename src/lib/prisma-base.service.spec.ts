import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClientService } from '@/prisma/prisma-client.service';
import { PrismaBaseService } from '@/lib/prisma-base.service';

// テスト用のモデル型
interface TestModel {
  id: number;
  name: string;
}

// PrismaBaseServiceを継承したテスト用のサービス
class TestService extends PrismaBaseService<TestModel> {
  constructor(prisma: PrismaClientService) {
    super(prisma, 'test');
  }
}

describe('PrismaBaseService', () => {
  let service: TestService;
  let prismaService: jest.Mocked<PrismaClientService>;

  beforeEach(async () => {
    const mockPrismaService = {
      test: {
        create: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TestService,
        {
          provide: PrismaClientService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<TestService>(TestService);
    prismaService = module.get(PrismaClientService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new item', async () => {
      const newItem: TestModel = { id: 1, name: 'Test Item' };
      (prismaService as any).test.create.mockResolvedValue(newItem);

      const result = await service.create(newItem);
      expect(result).toEqual(newItem);
      expect((prismaService as any).test.create).toHaveBeenCalledWith({
        data: newItem,
      });
    });
  });
});
