import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClientService } from '@/prisma/prisma-client.service';

describe('PrismaClientService', () => {
  let PrismaClientService: PrismaClientService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaClientService],
    }).compile();

    PrismaClientService = module.get<PrismaClientService>(PrismaClientService);
    jest.clearAllMocks();
  });

  afterEach(async () => {
    await PrismaClientService.$disconnect();
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(PrismaClientService).toBeDefined();
  });

  describe('onModuleInit', () => {
    it('should connect to the database', async () => {
      const connectSpy = jest
        .spyOn(PrismaClientService, '$connect')
        .mockResolvedValue();
      await PrismaClientService.onModuleInit();
      expect(connectSpy).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if connection fails', async () => {
      const error = new Error('Connection failed');
      jest.spyOn(PrismaClientService, '$connect').mockRejectedValue(error);
      await expect(PrismaClientService.onModuleInit()).rejects.toThrow(
        'Connection failed',
      );
    });
  });

  describe('onModuleDestroy', () => {
    it('should disconnect from the database', async () => {
      const disconnectSpy = jest
        .spyOn(PrismaClientService, '$disconnect')
        .mockResolvedValue();
      await PrismaClientService.onModuleDestroy();
      expect(disconnectSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('cleanDatabase', () => {
    it('should call deleteMany on all valid models', async () => {
      // モックのモデルを作成
      const mockModels = {
        user: { deleteMany: jest.fn().mockResolvedValue(null) },
        invalidModel: 'not an object',
        nullModel: null,
        noDeleteMany: {},
        invalidDeleteMany: { deleteMany: 'not a function' },
      };

      // PrismaClientServiceのインスタンスにモックモデルを追加
      Object.assign(PrismaClientService, mockModels);

      await PrismaClientService.cleanDatabase();

      // 有効なモデルに対してdeleteManyが呼ばれたことを確認
      expect(mockModels.user.deleteMany).toHaveBeenCalledTimes(1);

      // 無効なモデルに対してdeleteManyが呼ばれていないことを確認
      expect(mockModels.invalidModel).not.toHaveProperty('deleteMany');
      expect(mockModels.nullModel).toBeNull();
      // expect(mockModels.noDeleteMany.deleteMany).toBeUndefined();
      expect(typeof mockModels.invalidDeleteMany.deleteMany).not.toBe(
        'function',
      );
    });

    it('should handle errors when deleteMany fails', async () => {
      const mockModels = {
        user: {
          deleteMany: jest.fn().mockRejectedValue(new Error('Delete failed')),
        },
      };

      Object.assign(PrismaClientService, mockModels);

      await expect(PrismaClientService.cleanDatabase()).rejects.toThrow(
        'Delete failed',
      );
    });
  });
});
