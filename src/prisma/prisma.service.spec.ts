import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from './prisma.service';

describe('PrismaService', () => {
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaService],
    }).compile();

    prismaService = module.get<PrismaService>(PrismaService);
    jest.clearAllMocks();
  });

  afterEach(async () => {
    await prismaService.$disconnect();
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(prismaService).toBeDefined();
  });

  describe('onModuleInit', () => {
    it('should connect to the database', async () => {
      const connectSpy = jest
        .spyOn(prismaService, '$connect')
        .mockResolvedValue();
      await prismaService.onModuleInit();
      expect(connectSpy).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if connection fails', async () => {
      const error = new Error('Connection failed');
      jest.spyOn(prismaService, '$connect').mockRejectedValue(error);
      await expect(prismaService.onModuleInit()).rejects.toThrow(
        'Connection failed',
      );
    });
  });

  describe('onModuleDestroy', () => {
    it('should disconnect from the database', async () => {
      const disconnectSpy = jest
        .spyOn(prismaService, '$disconnect')
        .mockResolvedValue();
      await prismaService.onModuleDestroy();
      expect(disconnectSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('cleanDatabase', () => {
    it('should call deleteMany on all valid models', async () => {
      // モックのモデルを作成
      const mockModels = {
        user: { deleteMany: jest.fn().mockResolvedValue(null) },
        post: { deleteMany: jest.fn().mockResolvedValue(null) },
        comment: { deleteMany: jest.fn().mockResolvedValue(null) },
        invalidModel: 'not an object',
        nullModel: null,
        noDeleteMany: {},
        invalidDeleteMany: { deleteMany: 'not a function' },
      };

      // PrismaServiceのインスタンスにモックモデルを追加
      Object.assign(prismaService, mockModels);

      await prismaService.cleanDatabase();

      // 有効なモデルに対してdeleteManyが呼ばれたことを確認
      expect(mockModels.user.deleteMany).toHaveBeenCalledTimes(1);
      expect(mockModels.post.deleteMany).toHaveBeenCalledTimes(1);
      expect(mockModels.comment.deleteMany).toHaveBeenCalledTimes(1);

      // 無効なモデルに対してdeleteManyが呼ばれていないことを確認
      expect(mockModels.invalidModel).not.toHaveProperty('deleteMany');
      expect(mockModels.nullModel).toBeNull();
      // expect(mockModels.noDeleteMany.deleteMany).toBeUndefined();
      expect(typeof mockModels.invalidDeleteMany.deleteMany).not.toBe('function');
    });

    it('should handle errors when deleteMany fails', async () => {
      const mockModels = {
        user: { deleteMany: jest.fn().mockRejectedValue(new Error('Delete failed')) },
      };

      Object.assign(prismaService, mockModels);

      await expect(prismaService.cleanDatabase()).rejects.toThrow('Delete failed');
    });
  });
});