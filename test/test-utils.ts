// test\test-utils.ts

// External libraries
import { Test, TestingModule } from '@nestjs/testing';

// Internal modules
import { PrismaService } from '../src/prisma/prisma.service';


export const setupTestModule = async <T>(
  ServiceClass: new (...args: any[]) => T,
  modelName: string,
): Promise<{ service: T; prismaService: jest.Mocked<PrismaService> }> => {
  const module: TestingModule = await Test.createTestingModule({
    providers: [
      ServiceClass,
      {
        provide: PrismaService,
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
  const prismaService = module.get<PrismaService>(
    PrismaService,
  ) as jest.Mocked<PrismaService>;

  return { service, prismaService };
};
