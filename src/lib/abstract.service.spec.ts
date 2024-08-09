import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { AbstractService } from './abstract.service';

class TestService extends AbstractService {
  constructor(prisma: PrismaService) {
    super(prisma, 'testModel');
  }
}

type MockPrismaService = {
  [key: string]: {
    findMany: jest.Mock;
    create: jest.Mock;
    findUnique: jest.Mock;
    findFirst: jest.Mock;
    update: jest.Mock;
    delete: jest.Mock;
    count: jest.Mock;
  };
};

describe('AbstractService', () => {
  let service: TestService;
  let prismaService: MockPrismaService;

  beforeEach(async () => {
    const mockPrismaService: MockPrismaService = {
      testModel: {
        findMany: jest.fn(),
        create: jest.fn(),
        findUnique: jest.fn(),
        findFirst: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        count: jest.fn(),
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

  describe('create', () => {
    it('should create a new record', async () => {
      const mockData = { id: 1, name: 'Test' };
      prismaService.testModel.create.mockResolvedValue(mockData);

      const result = await service.create(mockData);

      expect(result).toEqual(mockData);
      expect(prismaService.testModel.create).toHaveBeenCalledTimes(1);
      expect(prismaService.testModel.create).toHaveBeenCalledWith({ data: mockData });
    });
  });

  describe('find', () => {
    it('should find a record by id', async () => {
      const mockData = { id: 1, name: 'Test' };
      prismaService.testModel.findUnique.mockResolvedValue(mockData);

      const result = await service.find(1);

      expect(result).toEqual(mockData);
      expect(prismaService.testModel.findUnique).toHaveBeenCalledTimes(1);
      expect(prismaService.testModel.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should return null if record not found', async () => {
      prismaService.testModel.findUnique.mockResolvedValue(null);

      const result = await service.find(999);

      expect(result).toBeNull();
      expect(prismaService.testModel.findUnique).toHaveBeenCalledTimes(1);
      expect(prismaService.testModel.findUnique).toHaveBeenCalledWith({
        where: { id: 999 },
      });
    });
  });

  describe('findBy', () => {
    it('should find a record by condition', async () => {
      const mockData = { id: 1, name: 'Test' };
      const condition = { name: 'Test' };
      prismaService.testModel.findFirst.mockResolvedValue(mockData);

      const result = await service.findBy(condition);

      expect(result).toEqual(mockData);
      expect(prismaService.testModel.findFirst).toHaveBeenCalledTimes(1);
      expect(prismaService.testModel.findFirst).toHaveBeenCalledWith({
        where: condition,
      });
    });

    it('should return null if no record matches the condition', async () => {
      const condition = { name: 'Non-existent' };
      prismaService.testModel.findFirst.mockResolvedValue(null);

      const result = await service.findBy(condition);

      expect(result).toBeNull();
      expect(prismaService.testModel.findFirst).toHaveBeenCalledTimes(1);
      expect(prismaService.testModel.findFirst).toHaveBeenCalledWith({
        where: condition,
      });
    });
  });

  describe('where', () => {
    it('should find records by condition', async () => {
      const mockData = [
        { id: 1, name: 'Test1', category: 'A' },
        { id: 2, name: 'Test2', category: 'A' },
      ];
      const condition = { category: 'A' };
      prismaService.testModel.findMany.mockResolvedValue(mockData);

      const result = await service.where(condition);

      expect(result).toEqual(mockData);
      expect(prismaService.testModel.findMany).toHaveBeenCalledTimes(1);
      expect(prismaService.testModel.findMany).toHaveBeenCalledWith({
        where: condition,
      });
    });

    it('should return an empty array if no records match the condition', async () => {
      const condition = { category: 'Non-existent' };
      prismaService.testModel.findMany.mockResolvedValue([]);

      const result = await service.where(condition);

      expect(result).toEqual([]);
      expect(prismaService.testModel.findMany).toHaveBeenCalledTimes(1);
      expect(prismaService.testModel.findMany).toHaveBeenCalledWith({
        where: condition,
      });
    });
  });

  describe('update', () => {
    it('should update a record', async () => {
      const id = 1;
      const updateData = { name: 'Updated Test' };
      const updatedMockData = { id, ...updateData };
      prismaService.testModel.update.mockResolvedValue(updatedMockData);

      const result = await service.update(id, updateData);

      expect(result).toEqual(updatedMockData);
      expect(prismaService.testModel.update).toHaveBeenCalledTimes(1);
      expect(prismaService.testModel.update).toHaveBeenCalledWith({
        where: { id },
        data: updateData,
      });
    });

    it('should throw an error if record not found', async () => {
      const id = 999;
      const updateData = { name: 'Updated Test' };
      prismaService.testModel.update.mockRejectedValue(new Error('Record not found'));

      await expect(service.update(id, updateData)).rejects.toThrow('Record not found');
      expect(prismaService.testModel.update).toHaveBeenCalledTimes(1);
      expect(prismaService.testModel.update).toHaveBeenCalledWith({
        where: { id },
        data: updateData,
      });
    });
  });

  describe('destroy', () => {
    it('should delete a record', async () => {
      const id = 1;
      const deletedMockData = { id, name: 'Deleted Test' };
      prismaService.testModel.delete.mockResolvedValue(deletedMockData);

      const result = await service.destroy(id);

      expect(result).toEqual(deletedMockData);
      expect(prismaService.testModel.delete).toHaveBeenCalledTimes(1);
      expect(prismaService.testModel.delete).toHaveBeenCalledWith({
        where: { id },
      });
    });

    it('should throw an error if record not found', async () => {
      const id = 999;
      prismaService.testModel.delete.mockRejectedValue(new Error('Record not found'));

      await expect(service.destroy(id)).rejects.toThrow('Record not found');
      expect(prismaService.testModel.delete).toHaveBeenCalledTimes(1);
      expect(prismaService.testModel.delete).toHaveBeenCalledWith({
        where: { id },
      });
    });
  });

  describe('paginate', () => {
    it('should return paginated results with default values', async () => {
      const mockData = [
        { id: 1, name: 'Test1' },
        { id: 2, name: 'Test2' },
      ];
      const totalCount = 30;
      prismaService.testModel.findMany.mockResolvedValue(mockData);
      prismaService.testModel.count.mockResolvedValue(totalCount);

      const result = await service.paginate();

      expect(result).toEqual({
        data: mockData,
        meta: {
          total: totalCount,
          page: 1,
          per_page: 15,
          last_page: 2,
        },
      });
      expect(prismaService.testModel.findMany).toHaveBeenCalledTimes(1);
      expect(prismaService.testModel.findMany).toHaveBeenCalledWith({
        take: 15,
        skip: 0,
      });
      expect(prismaService.testModel.count).toHaveBeenCalledTimes(1);
    });

    it('should return paginated results with custom page and perPage', async () => {
      const mockData = [
        { id: 3, name: 'Test3' },
        { id: 4, name: 'Test4' },
      ];
      const totalCount = 50;
      const page = 2;
      const perPage = 10;
      prismaService.testModel.findMany.mockResolvedValue(mockData);
      prismaService.testModel.count.mockResolvedValue(totalCount);

      const result = await service.paginate(page, perPage);

      expect(result).toEqual({
        data: mockData,
        meta: {
          total: totalCount,
          page: page,
          per_page: perPage,
          last_page: 5,
        },
      });
      expect(prismaService.testModel.findMany).toHaveBeenCalledTimes(1);
      expect(prismaService.testModel.findMany).toHaveBeenCalledWith({
        take: perPage,
        skip: (page - 1) * perPage,
      });
      expect(prismaService.testModel.count).toHaveBeenCalledTimes(1);
    });

    it('should return empty data array when no records found', async () => {
      prismaService.testModel.findMany.mockResolvedValue([]);
      prismaService.testModel.count.mockResolvedValue(0);

      const result = await service.paginate();

      expect(result).toEqual({
        data: [],
        meta: {
          total: 0,
          page: 1,
          per_page: 15,
          last_page: 0,
        },
      });
      expect(prismaService.testModel.findMany).toHaveBeenCalledTimes(1);
      expect(prismaService.testModel.count).toHaveBeenCalledTimes(1);
    });
  });
});