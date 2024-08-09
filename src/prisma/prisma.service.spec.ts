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
});
