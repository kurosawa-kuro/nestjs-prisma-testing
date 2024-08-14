// test\test-utils.ts

// External libraries
import { Test, TestingModule } from '@nestjs/testing';

// Internal modules
import { PrismaClientService } from '@/prisma/prisma-client.service';

export const setupTestModule = async <T>(
  ServiceClass: new (...args: any[]) => T,
  modelName: string,
): Promise<{
  service: T;
  PrismaClientService: jest.Mocked<PrismaClientService>;
}> => {
  const module: TestingModule = await Test.createTestingModule({
    providers: [
      ServiceClass,
      {
        provide: PrismaClientService,
        useValue: {
          [modelName]: {
            findMany: jest.fn(),
            count: jest.fn(),
            findUnique: jest.fn(),
            findFirst: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      },
    ],
  }).compile();

  const service = module.get<T>(ServiceClass);
  const PrismaClientService = module.get<PrismaClientService>(
    PrismaClientService,
  ) as jest.Mocked<PrismaClientService>;

  return { service, PrismaClientService };
};
