// // PrismaClient のメソッドをモック化しますが、PrismaClientService クラス自体はそのままにします。
// jest.mock('@prisma/client', () => {
//   const actualPrismaClient = jest.requireActual('@prisma/client').PrismaClient;
//   return {
//     PrismaClient: jest.fn().mockImplementation(() => ({
//       ...new actualPrismaClient(),
//       $connect: jest.fn().mockResolvedValue(undefined),
//       $disconnect: jest.fn().mockResolvedValue(undefined),
//       user: { deleteMany: jest.fn().mockResolvedValue(undefined) },
//       todo: { deleteMany: jest.fn().mockResolvedValue(undefined) },
//     })),
//   };
// });

import { PrismaClientService } from './prisma-client.service';

describe('PrismaClientService', () => {
  let service: PrismaClientService;

  beforeEach(() => {
    // PrismaClientService インスタンスの生成
    service = new PrismaClientService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should connect when module is initialized', async () => {
    await service.onModuleInit();
    expect(service.$connect).toHaveBeenCalled();
  });

  it('should disconnect when module is destroyed', async () => {
    await service.onModuleDestroy();
    expect(service.$disconnect).toHaveBeenCalled();
  });

  // it('should clean the database before module is destroyed', async () => {
  //   await service.cleanDatabase();
  //   expect(service.user.deleteMany).toHaveBeenCalled();
  //   expect(service.todo.deleteMany).toHaveBeenCalled();
  // });
});
