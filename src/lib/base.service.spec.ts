// src\lib\base.service.spec.ts

// External libraries
import { Test, TestingModule } from '@nestjs/testing';

// Internal modules
import { PrismaClientService } from '@/prisma/prisma-client.service';
import { BaseService } from '@/lib/base.service';

class TestService extends BaseService {
  constructor(prisma: PrismaClientService) {
    super(prisma, 'testModel');
  }
}

type MockPrismaClientService = {
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

describe('BaseService', () => {
  let service: TestService;
  let PrismaClientService: MockPrismaClientService;

  beforeEach(async () => {
    const mockPrismaClientService: MockPrismaClientService = {
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
          useFactory: () =>
            new TestService(
              mockPrismaClientService as unknown as PrismaClientService,
            ),
        },
        {
          provide: PrismaClientService,
          useValue: mockPrismaClientService,
        },
      ],
    }).compile();

    service = module.get<TestService>(TestService);
    PrismaClientService = module.get(
      PrismaClientService,
    ) as unknown as MockPrismaClientService;
  });

  describe('all', () => {
    it('should return all records', async () => {
      const mockData = [{ id: 1 }, { id: 2 }];
      PrismaClientService.testModel.findMany.mockResolvedValue(mockData);

      const result = await service.all();

      expect(result).toEqual(mockData);
      expect(PrismaClientService.testModel.findMany).toHaveBeenCalledTimes(1);
      expect(PrismaClientService.testModel.findMany).toHaveBeenCalledWith();
    });
  });

  describe('create', () => {
    it('should create a new record', async () => {
      const mockData = { id: 1, name: 'Test' };
      PrismaClientService.testModel.create.mockResolvedValue(mockData);

      const result = await service.create(mockData);

      expect(result).toEqual(mockData);
      expect(PrismaClientService.testModel.create).toHaveBeenCalledTimes(1);
      expect(PrismaClientService.testModel.create).toHaveBeenCalledWith({
        data: mockData,
      });
    });
  });

  describe('find', () => {
    it('should find a record by id', async () => {
      const mockData = { id: 1, name: 'Test' };
      PrismaClientService.testModel.findUnique.mockResolvedValue(mockData);

      const result = await service.find(1);

      expect(result).toEqual(mockData);
      expect(PrismaClientService.testModel.findUnique).toHaveBeenCalledTimes(1);
      expect(PrismaClientService.testModel.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should return null if record not found', async () => {
      PrismaClientService.testModel.findUnique.mockResolvedValue(null);

      const result = await service.find(999);

      expect(result).toBeNull();
      expect(PrismaClientService.testModel.findUnique).toHaveBeenCalledTimes(1);
      expect(PrismaClientService.testModel.findUnique).toHaveBeenCalledWith({
        where: { id: 999 },
      });
    });
  });

  describe('findBy', () => {
    it('should find a record by condition', async () => {
      const mockData = { id: 1, name: 'Test' };
      const condition = { name: 'Test' };
      PrismaClientService.testModel.findFirst.mockResolvedValue(mockData);

      const result = await service.findBy(condition);

      expect(result).toEqual(mockData);
      expect(PrismaClientService.testModel.findFirst).toHaveBeenCalledTimes(1);
      expect(PrismaClientService.testModel.findFirst).toHaveBeenCalledWith({
        where: condition,
      });
    });

    it('should return null if no record matches the condition', async () => {
      const condition = { name: 'Non-existent' };
      PrismaClientService.testModel.findFirst.mockResolvedValue(null);

      const result = await service.findBy(condition);

      expect(result).toBeNull();
      expect(PrismaClientService.testModel.findFirst).toHaveBeenCalledTimes(1);
      expect(PrismaClientService.testModel.findFirst).toHaveBeenCalledWith({
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
      PrismaClientService.testModel.findMany.mockResolvedValue(mockData);

      const result = await service.where(condition);

      expect(result).toEqual(mockData);
      expect(PrismaClientService.testModel.findMany).toHaveBeenCalledTimes(1);
      expect(PrismaClientService.testModel.findMany).toHaveBeenCalledWith({
        where: condition,
      });
    });

    it('should return an empty array if no records match the condition', async () => {
      const condition = { category: 'Non-existent' };
      PrismaClientService.testModel.findMany.mockResolvedValue([]);

      const result = await service.where(condition);

      expect(result).toEqual([]);
      expect(PrismaClientService.testModel.findMany).toHaveBeenCalledTimes(1);
      expect(PrismaClientService.testModel.findMany).toHaveBeenCalledWith({
        where: condition,
      });
    });
  });

  describe('update', () => {
    it('should update a record', async () => {
      const id = 1;
      const updateData = { name: 'Updated Test' };
      const updatedMockData = { id, ...updateData };
      PrismaClientService.testModel.update.mockResolvedValue(updatedMockData);

      const result = await service.update(id, updateData);

      expect(result).toEqual(updatedMockData);
      expect(PrismaClientService.testModel.update).toHaveBeenCalledTimes(1);
      expect(PrismaClientService.testModel.update).toHaveBeenCalledWith({
        where: { id },
        data: updateData,
      });
    });

    it('should throw an error if record not found', async () => {
      const id = 999;
      const updateData = { name: 'Updated Test' };
      PrismaClientService.testModel.update.mockRejectedValue(
        new Error('Record not found'),
      );

      await expect(service.update(id, updateData)).rejects.toThrow(
        'Record not found',
      );
      expect(PrismaClientService.testModel.update).toHaveBeenCalledTimes(1);
      expect(PrismaClientService.testModel.update).toHaveBeenCalledWith({
        where: { id },
        data: updateData,
      });
    });
  });

  describe('destroy', () => {
    it('should delete a record', async () => {
      const id = 1;
      const deletedMockData = { id, name: 'Deleted Test' };
      PrismaClientService.testModel.delete.mockResolvedValue(deletedMockData);

      const result = await service.destroy(id);

      expect(result).toEqual(deletedMockData);
      expect(PrismaClientService.testModel.delete).toHaveBeenCalledTimes(1);
      expect(PrismaClientService.testModel.delete).toHaveBeenCalledWith({
        where: { id },
      });
    });

    it('should throw an error if record not found', async () => {
      const id = 999;
      PrismaClientService.testModel.delete.mockRejectedValue(
        new Error('Record not found'),
      );

      await expect(service.destroy(id)).rejects.toThrow('Record not found');
      expect(PrismaClientService.testModel.delete).toHaveBeenCalledTimes(1);
      expect(PrismaClientService.testModel.delete).toHaveBeenCalledWith({
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
      PrismaClientService.testModel.findMany.mockResolvedValue(mockData);
      PrismaClientService.testModel.count.mockResolvedValue(totalCount);

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
      expect(PrismaClientService.testModel.findMany).toHaveBeenCalledTimes(1);
      expect(PrismaClientService.testModel.findMany).toHaveBeenCalledWith({
        take: 15,
        skip: 0,
      });
      expect(PrismaClientService.testModel.count).toHaveBeenCalledTimes(1);
    });

    it('should return paginated results with custom page and perPage', async () => {
      const mockData = [
        { id: 3, name: 'Test3' },
        { id: 4, name: 'Test4' },
      ];
      const totalCount = 50;
      const page = 2;
      const perPage = 10;
      PrismaClientService.testModel.findMany.mockResolvedValue(mockData);
      PrismaClientService.testModel.count.mockResolvedValue(totalCount);

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
      expect(PrismaClientService.testModel.findMany).toHaveBeenCalledTimes(1);
      expect(PrismaClientService.testModel.findMany).toHaveBeenCalledWith({
        take: perPage,
        skip: (page - 1) * perPage,
      });
      expect(PrismaClientService.testModel.count).toHaveBeenCalledTimes(1);
    });

    it('should return empty data array when no records found', async () => {
      PrismaClientService.testModel.findMany.mockResolvedValue([]);
      PrismaClientService.testModel.count.mockResolvedValue(0);

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
      expect(PrismaClientService.testModel.findMany).toHaveBeenCalledTimes(1);
      expect(PrismaClientService.testModel.count).toHaveBeenCalledTimes(1);
    });
  });
});
